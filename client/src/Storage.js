const electron = require('electron')

function Loader(name,path,defaultdata) {
  return async ()=>{
    var fileExists = await self.fs.exists(path)
    if(fileExists){
      var txt = await self.fs.readFile(path)
      var data = JSON.parse(txt)
      self.data[name]=data
      return data
    } else {
      if(defaultdata !== false) {
        await self.fs.writeFile(path,JSON.stringify(defaultdata))
        self.data[name]=defaultdata;
        return defaultdata
      }
    }
  }
}

class Card {
  constructor(data,path) {
    this.ID = data.ID;
    this.title = data.title;
    this.dateCaught = new Date(data.dateCaught);
    this.datePublished = new Date(data.datePublished);
    this.author = data.author;
    this.url = data.url;
    this.keywords = data.keywords;
    this.dbSignature = data.dbSignature;
    this.quals = data.quals;
    this.path=path
  }

  async getText(){
    console.log("Card text is being accessed".cyan);
    if(this.text){
      return this.text;
    }
    var cardTextPath = this.path+"/cards/"+this.ID+".cardText.json";
    var fileExists = await self.fs.exists(cardTextPath);
    if (fileExists){
      var cardTextFileTxt = (await self.fs.readFile(cardTextPath)).toString();
      var cardTextFileObj = JSON.parse(cardTextFileTxt);
      if (cardTextFileObj.ID && cardTextFileObj.ID === this.ID && cardTextFileObj.text){
        if (!cardTextFileObj.textHash || self.hash(cardTextFileObj.text)!=cardTextFileObj.textHash) {
          console.error("Hashing Error --- Text was modified");
        }
        this.text = cardTextFileObj.text;
        return this.text;
      } else {
        console.error("Card was malformatted");
      }
    } else {
      console.error("Card couldn't be looked up --- File doesn't exist at path "+cardTextPath);
    }
  }
}

class CardCollection {

  constructor(data,path){
    this.path=path;
    this.pull();
  }

  async push(){
    var fileExists = await self.fs.exists(this.path+"/cardMetadata.json")
    if (!fileExists){throw new Error("cardMetadata.json was missing")}
    for (var i = 0; i < this.cards.length; i++) {
      delete this.cards[i].text
    }
    var data = JSON.stringify(this)
    return await self.fs.writeFile(this.path+"/cardMetadata.json",data)
  }

  async pull(){
    var fileExists = await self.fs.exists(this.path+"/cardMetadata.json")
    var cardCollectionTXT, data;
    if (fileExists){
      cardCollectionTXT = await self.fs.readFile(this.path+"/cardMetadata.json")
      data = JSON.parse(cardCollectionTXT)
    } else {
      throw new Error("cardMetadata.json was missing")
    }
    this.collectionName=data.collectionName;
    this.collectionID=data.collectionID
    this.lastUpdated=new Date(data.lastUpdated);
    this.created = new Date(data.created);
    this.cards = []

    if( self.hash({
      collectionName:this.collectionName,
      created:this.created.toJSON(),
    }) !== this.collectionID) {
      console.error("Card DB hash doesnt match with its name and creation date")
    }

    for (var i = 0; i < data.cards.length; i++) {
      this.cards[i] = new Card(data.cards[i],this.path)
    }
  }

  async addCard(cardData){
    cardData.ID = self.hash({
      title:cardData.title,
      author:cardData.author,
      url:cardData.url,
      text:cardData.text,
    })

    await this.pull()
    this.cards.push(new Card(cardData,this.path))
    this.lastUpdated=new Date();
    await this.push()

    await self.fs.writeFile(
      this.path+"/cards/"+cardData.ID+".cardText.json",
      JSON.stringify({
        ID:cardData.ID,
        textHash:self.hash(cardData.text),
        text:cardData.text
      })
    );

    return "success"
  }
}

var self ={
  init:function(){
    if(!self.loading){
      self.loading=true
      self.fs=require('mz/fs')
      self.hash=require('object-hash')
      self.load.usrSettings()
        .then(self.load.cardDBs)
        .then(()=>{self.ready=true})
    } else {
      console.log("appStorage already ready!")
    }
  },//


  load:{
    usrSettings: Loader("usrSettings","./cfg/usrSettings.json",{cardSrces:[]}),

    DB: async function (path) {
      var fileExists = await self.fs.exists(path+"/cardMetadata.json")
      if (fileExists){
        var cardCollectionTXT = await self.fs.readFile(path+"/cardMetadata.json")
        var cardCollectionData = JSON.parse(cardCollectionTXT)
        self.data.cardDBs.push(new CardCollection(cardCollectionData,path))
        return
      } else {
        console.error("File does not exist --- [appStorage].[load].[DB]")
      }
    },

    cardDBs: async function(){
      var promises = []
      for (var i = 0; i < self.data.usrSettings.cardSrces.length; i++) {
        self.load.DB(self.data.usrSettings.cardSrces[i])
      }
      for (var i = 0; i < promises.length; i++) {
        try{
          await promises[i]
        } catch (e) {
          console.error("Failed to load cardCollection #"+i)
        }
      }
      self.data.cardDBs.ready = true
      return
    }
  },


  data:{
    cardDBs:[],
    usrSettings:{loaded:false},
  },


  save:{
    usrSettings: async ()=>{
      await self.fs.writeFile(
        './cfg/usrSettings.json',
        JSON.stringify(
          self.data.usrSettings
        )
      )
      return
    },
  }


}

electron.ipcMain.on('appStorage',(event,arg)=>{
  if(typeof arg=== "object" && arg.action){
    switch (arg.action) {
      case "getUsrSettings":
        event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:self.data.usrSettings})
      break; case "getCard":
        try {
          var DB = -1
          for (var i = 0; i < self.data.cardDBs.length; i++) {
            if(arg.params.collectionID){
              DB = self.data.cardDBs[i].collectionID==arg.params.collectionID? i:DB
            } else {
              var babelIsDumb = self.data.cardDBs[i]//THIS MAKES NO SENSE BUT WHEN I DO IT THE NORMAL WAY IT DOESNT WORK
              for (var j = 0; j < (babelIsDumb).cards.length; j++) {
                if(self.data.cardDBs[i].cards[j].ID === arg.params.cardID){
                  DB = i;
                  i=Infinity
                  j=Infinity
                }
              }
            }
          }
          if (DB === -1){
            throw new Error("DB can't be found")
          }
          DB = self.data.cardDBs[DB];


          for (var i = 0; i < DB.cards.length; i++) {
            if(DB.cards[i].ID === arg.params.cardID){
              var card = DB.cards[i];
              (async ()=>{
                if(arg.params.justMeta){
                  var tmp = card.text
                  delete card.text
                  event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:card})
                  card.text = tmp
                } else {
                  await card.getText()
                  event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:card})
                }
              })();
              return
            }
          }
          event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:"card not found"})
        } catch (e) {
          console.error(e)
          event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:e+""})
        }
      break; case "DBlist":
        try {
          var cardDatabases = []
          for (var i = 0; i < self.data.cardDBs.length; i++) {
            var tmp = self.data.cardDBs[i]
            cardDatabases.push({
              collectionID:tmp.collectionID,
              collectionName:tmp.collectionName,
              lastUpdated:tmp.lastUpdated,
              created:tmp.created,
              path:tmp.path,
            })
          }
          event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:cardDatabases})
        } catch (e) {
          console.error(e)
          event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:e})
        }
      break; case "addCard":
        for (var i = 0; i < self.data.cardDBs.length; i++) {
          if(self.data.cardDBs[i].collectionID = arg.params.collectionID){
            self.data.cardDBs[i].addCard(arg.params.cardData).then((result)=>{
              if (result == "success")
                event.sender.send("appStorage"+arg.replyChannel,{status:"ok"})
              else
                event.sender.send("appStorage"+arg.replyChannel,{status:"failed"})
            })
          }
        }
      break; case "getDBmeta":
        for (var i = 0; i < self.data.cardDBs.length; i++) {
          if(self.data.cardDBs[i].collectionID == arg.params.collectionID){
            (async (i)=>{
              var fileExists = await self.fs.exists(self.data.cardDBs[i].path+"/cardMetadata.json")
              if (fileExists){
                var cardCollectionTXT = await self.fs.readFile(self.data.cardDBs[i].path+"/cardMetadata.json")
                var cardCollectionData = JSON.parse(cardCollectionTXT)
                event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:cardCollectionData})
              } else {
                event.sender.send("appStorage"+arg.replyChannel,{status:"File doesnt exist"})
              }
            })(i);
          }
        }
      break; case "getRecentCards":
        var results = [{
          ID:false,
          dateCaught: new Date(1800,0,0),//Chances are nobody will catch a card before this date, even if their os is wierd.
        }]
        var numResults = arg.params.numResults || 10

        for (var i = 0; i < self.data.cardDBs.length; i++) {
          var tmp_db = self.data.cardDBs[i]
          for (var j = 0; j < tmp_db.cards.length; j++) {
            var tmp_card = tmp_db.cards[j]
            if(tmp_card.dateCaught > results[results.length-1].dateCaught){
              results.push({
                ID:tmp_card.ID,
                dateCaught:tmp_card.dateCaught,
                collectionID:self.data.cardDBs[i].collectionID
              })
              for (var k = results.length-1; k > 0; k--) {//sort tmp
                if(results[k].dateCaught > results[k-1].dateCaught){
                  var tmp_swap = results[k]
                  results[k]=results[k-1]
                  results[k-1]=tmp_swap
                }
              }
              if(results.length > numResults){//remove oldest elemnt
                delete results[results.length-1]
              }
            }
          }
        }
        event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:results})
      break; default:
        console.error("Unknown action")
      break;
    }
  }
})
exports.default = self
