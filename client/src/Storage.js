const electron = require('electron')
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

class CardCollection {
  constructor(data,path){
    this.path=path
    this.data=data

    if( self.hash({
      collectionName:this.data.collectionName,
      created:this.data.created
    }) !== this.data.collectionID) {
      console.error("Card DB hash doesnt match with its name and creation date")
    }

    for (var i = 0; i < this.data.cards.length; i++){
      var currentCard = this.data.cards[i]
      currentCard.text =x=> (this.getCard(currentCard))
    }
  }

  async getCard(card){//Method
    var ID = card.ID
    var cardTextPath = this.path+"/cards/"+ID+".cardText.json"
    var fileExists = await self.fs.exists(cardTextPath)
    if (fileExists){
      var txt = (await self.fs.readFile(cardTextPath)).toString()
      var obj = JSON.parse(txt)
      if (obj.ID && obj.ID === ID && obj.text){
        if (!obj.textHash || self.hash(obj.text)!=obj.textHash) {
          console.error("Hashing Error --- Text was modified")
        }
        card.lazyText = obj.text
        return card.lazyText
      } else {
        console.error("Card was malformatted")
      }
    } else {
      console.error("Card couldn't be looked up --- File doesn't exist")
    }
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
    }
  }
}

electron.ipcMain.on('appStorage',(event,arg)=>{
  if (typeof arg=== "object" && arg.usrSettings){
    event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:self.data.usrSettings})
  }
  if (typeof arg === "object" && arg.cardID && arg.collectionID){
    try {
      var DB = -1
      for (var i = 0; i < self.data.cardDBs.length; i++) {
        DB = self.data.cardDBs[i].data.collectionID==arg.collectionID? i:DB
      }
      if (DB === -1){
        throw new Error("DB can't be found")
      }
      DB = self.data.cardDBs[DB].data;

      for (var i = 0; i < DB.cards.length; i++) {
        if(DB.cards[i].ID === arg.cardID){
          var card = DB.cards[i];
          (async ()=>{
            if(typeof card.text === "function"){
              card.text = await card.text()
            }
            event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:card})
          })();
          return
        }
      }
      event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:"card not found"})
    } catch (e) {
      event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:e+""})
    }
  }
})
exports.default = self
