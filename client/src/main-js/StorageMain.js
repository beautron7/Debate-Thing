const electron = require('electron')
const fs       = require('fs')
const CSON     = require('cson')
const MZFS     = require('mz/fs')
const HASH     = require('object-hash')

function _assert(test,msg){
  if(!test){
    throw new Error("Assertion Failed: "+msg)
  }
}

class Card {
  constructor(data,path,collectionID) {
    this.ID            = data.ID;
    this.title         = data.title;
    this.dateCaught    = new Date(data.dateCaught);
    this.datePublished = new Date(data.datePublished);
    this.author        = data.author;
    this.url           = data.url;
    this.keywords      = data.keywords;
    this.collectionID  = collectionID;
    this.quals         = data.quals;
    this.path          = path
    this.text          = this.text.bind(this)
    this.taggedAs      = data.taggedAs;
  }

  async text(){
    console.log("Card text is being accessed".yellow);
    var cardTextPath =  this.path+"/cards/"+this.ID+".cardText.json";
    var fileExists = await MZFS.exists(cardTextPath);
    _assert(fileExists,"Cardfile wasn't found")
    var cardTextFile = await MZFS.readFile(cardTextPath)
    var cardTextFileTxt = cardTextFile.toString();
    var cardTextFileObj = JSON.parse(cardTextFileTxt);
    _assert(
      (
        cardTextFileObj.ID &&
        cardTextFileObj.ID === this.ID
        && cardTextFileObj.text
      ),
      "Card Was malformatted"
    );
    _assert(
      (
        HASH(cardTextFileObj.text) ==
        cardTextFileObj.textHash
      ),
      "Hashing Error!"
    );
    return cardTextFileObj.text;
  }

  metadataCopy(){
    return {
      ID            : this.ID,
      title         : this.title,
      dateCaught    : this.dateCaught,
      datePublished : this.datePublished,
      author        : this.author,
      url           : this.url,
      keywords      : this.keywords,
      quals         : this.quals,
      taggedAs      : this.taggedAs,
    }
  }

  async completeCopy(){
    var card = Object.assign({},this)//copies object
    card.text = await this.text()    //get text
    return card
  }
}

class Database {
  constructor(path){
    this.path=path;
    this.init()
  }

  async init(){
    var fileExists = await MZFS.exists(this.path+"/cardMetadata.json");
    var cardCollectionTXT, data;
    if (fileExists){
      cardCollectionTXT = await MZFS.readFile(
        this.path+"/cardMetadata.json"
      );
      data = JSON.parse(cardCollectionTXT);
    } else {
      throw new Error("cardMetadata.json was missing")
    }

    this.collectionName=data.collectionName;
    this.collectionID=data.collectionID
    this.lastUpdated=new Date(data.lastUpdated);
    this.created = new Date(data.created);
    this.cards = []

    if( HASH({
      collectionName:this.collectionName,
      created:this.created.toJSON(),
    }) !== this.collectionID) {
      console.error("Card DB hash doesnt match with its name and creation date")
    }

    for (var i = 0; i < data.cards.length; i++) {
      this.cards[i] = new Card(data.cards[i],this.path,this.collectionID)
    }
    delete this.init;
  }

  async addCard(cardData){
    cardData.ID = HASH({
      title:cardData.title,
      author:cardData.author,
      url:cardData.url,
      text:cardData.text,
    })

    this.cards.push(new Card(cardData,this.path))
    this.lastUpdated=new Date();
    this.updateMetadataFile();

    await MZFS.writeFile(
      this.path+"/cards/"+this.ID+".cardText.json",
      JSON.stringify({
        ID:cardData.ID,
        textHash:HASH(cardData.text),
        text:cardData.text
      })
    );
    return "success"
  }

  async updateCardMeta(){
    var fileExists = await MZFS.exists(this.path+"/cardMetadata.json");
    if (!fileExists)
      throw new Error("cardMetadata.json was missing")
    }

    data.collectionName= this.collectionName;
    data.collectionID  = this.collectionID
    data.lastUpdated   = this.lastUpdated);
    data.created       = this.created;
    data.cards         = this.cards.map(c=>c.metadataCopy())

    await MZFS.writeFile(this.path+'/cardMetadata.json',data)
    delete data;
  }

  async getCard(id){
    var result = this.cards.find(card => card.ID=id)
    return !!~result && await result.completeCopy();
  }
}

class DatabaseCollection {
  constructor(locations){
    if(DatabaseCollection.instance)
      throw new Error("Monoinstance required for DatabaseCollection");
    DatabaseCollection.instance = this;
    this._databases = []; //noindex
    locations.forEach((path) => {
      this._databases.push(new Database(path))
    });
    this.databases=new Proxy(this,{
      get(self,dbid){
        return self._databases.find(db=>db.collectionID==dbid)
      }
    })
  }

  async test_echo() {
    return "Hello, World!"
  }

  async findCard(query){
    var matches = {
      author:[],
      title:[],
      tagline:[],
    }
    this._databases.forEach()
  }

  async createDB(path,name){
    path = path.replace(/\/$/, "")
    _assert(MZFS.exists(path),"Error --- Path Doesn't exist")

    var char_blacklist = /[^A-Za-z0-9 \+\-\: \\ \/]/g
    var foldername = name.replace(char_blacklist,"")

    var files_in_folder = (await MZFS.readdir(path)).length

    if(files_in_folder.length){
      path+="/"+foldername
      await MZFS.mkdir(path)
    }

    var tmp = new Date()
    var collectionID =
      HASH({
        collectionName:name,
        created:tmp.toJSON(),
      });
    var filetext = JSON.stringify({
      path:               path,
      collectionName:     name,
      created:            tmp,
      cards:              [],
      lastUpdated:        tmp,
      collectionID:       collectionID,
    })
    await MZFS.writeFile(path+"/cardMetadata.json",filetext)
    await MZFS.mkdir    (path+"/cards")
    await this.openDB(path)
  }

  async openDB(){
    var metadata_txt = await MZFS.readFile(path+"/cardMetadata.json",'utf8')
    var metadata_obj = JSON.parse(txt)
    for (loaded_db of self.data.cardDBs) {
      if(metadata_obj.collectionID == loaded_db.ID){
        return false
      }
    }
    self.data.usrSettings.cardSrces.push(path)
    await self.save.usrSettings()
    this.databases.push(new Database(obj,path))
  }
}

class ConfigFile {
  /**
   * @class configFile
   * @example
   * var foo = new ConfigFile({
   *    path:"~/abc/def.ghi",
   *    writeInterval: 1000,
   *    construct_sync: false, //set true to force the constructor to wait for the filesystem
   * })
   *
   * foo.onReady(instance => {
   *   instance.data.prop = 5   //wont overwrite because prop2 resets write timeout.
   *   instance.prop2 = 10
   *   console.log(instance.prop) //5
   *   console.log(instance.existingProp) //Whatever is on disk
   * })
   */

  setter(...args) {
    if(this.writeTimeoutId)
      clearTimeout(this.write_timeout_id);

    Reflect.set(...args);

    this.writeTimeoutId = (
      setTimeout(() => {
        this.writeToDisk()
      },this.writeInterval)
    );

    return true;
  }

  writeToDisk(){
    fs.writeFile(this.path,(this.options.encoding || JSON).stringify(this.data))
  }

  constructor(options) {
    this.options = options;
    this.writeInterval = options.writeInterval || 1000;
    this.path=options.path;

    var init =(text)=> {//this exists so async is an option.
      var data = (options.encoding || JSON).parse(text)

      this.data = new Proxy(data,{
        set: options.readOnly? ()=>{}:this.setter.bind(this)
      })

      if(this.onReady){
        this.onReady.forEach(func=>{
          func(this);
        })
      }

      this.status="success"
    }

    if(options.construct_sync){
      try {
        var text = fs.readFileSync(options.path,"utf8");
        init(text)
      } catch (e) {
        console.error(e)
        if(Array.isArray(this.onFail)){
          this.onFail.forEach(x=>{
            x(err)
          })
        }
        this.status = "failed --- "+e.toString();
      }
    } else {
      fs.readFile(options.path,"utf8",(err,text) => {
        if(err){
          console.error(e)
          if(Array.isArray(this.onFail)){
            this.onFail.forEach(x=>{
              x(err)
            })
          }
          this.status = "failed --- "+e.toString();
        } else {
          init(text);
        }
      });
    }
  }
}

module.exports = {
  Card:Card,
  Database:Database,
  DatabaseCollection:DatabaseCollection,
  ConfigFile:ConfigFile,
}
