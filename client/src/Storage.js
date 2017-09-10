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

class CardCollection {
  class Card {
    constructor() {

    }
    getText(){
      console.log("Card text is being accessed".cyan)
      if(this.cachedText){
        return this.cachedText
      }
      var cardTextPath = this.collection.path+"/cards/"+this.ID+".cardText.json"
      var fileExists = await self.fs.exists(cardTextPath)
      if (fileExists){
        var cardTextFileTxt = (await self.fs.readFile(cardTextPath)).toString()
        var cardTextFileObj = JSON.parse(cardTextFileTxt)
        if (cardTextFileObj.ID && cardTextFileObj.ID === this.ID && cardTextFileObj.text){
          if (!cardTextFileObj.textHash || self.hash(cardTextFileObj.text)!=cardTextFileObj.textHash) {
            console.error("Hashing Error --- Text was modified")
          }
          this.cachedText = obj.text
          return card.cachedText
        } else {
          console.error("Card was malformatted")
        }
      } else {
        console.error("Card couldn't be looked up --- File doesn't exist")
      }
    }
  }

  constructor(data,path){
    this.path=path
    this.data=data

    if( self.hash({
      collectionName:this.data.collectionName,
      created:this.data.created
    }) !== this.data.collectionID) {
      console.error("Card DB hash doesnt match with its name and creation date")
    }

    this.updateData()
  }

  updateData(){
    for (var i = 0; i < this.data.cards.length; i++){
      var currentCard = this.data.cards[i]
      Object.defineProperty(currentCard,"text",{
        get:x=> this.getCard(currentCard)
      })
      currentCard.dateCaught=new Date(currentCard.dateCaught)
      currentCard.datePublished=new Date(currentCard.datePublished)
    }
  }

  async addCard(cardData){
    cardData.ID = self.hash({
      title:cardData.title,
      author:cardData.author,
      url:cardData.url,
      text:cardData.text,
    })
    //eventually, verify metadata here
    var fileExists = await self.fs.exists(this.path+"/cardMetadata.json")
    if (fileExists){
      var cardCollectionTXT = await self.fs.readFile(this.path+"/cardMetadata.json")
      var cardCollectionData = JSON.parse(cardCollectionTXT)
      this.data=cardCollectionData //This works bec we are replacing the getters with the actual text, so there is no difference
      var cardText = cardData.text;
      delete cardData.text; //Only delete the one because we are reading from json anyways
      this.data.cards.push(cardData)
      this.data.lastUpdated=new Date();
      await Promise.all([
        self.fs.writeFile(
          this.path+"/cardMetadata.json",
          JSON.stringify(this.data)
        ),
        self.fs.writeFile(
          this.path+"/cards/"+cardData.ID+".cardText.json",
          JSON.stringify({
            ID:cardData.ID,
            textHash:self.hash(cardData.text),
            text:cardData.text
          })
        )
      ])
      this.updateData()
      return "success"
    } else {
      throw new Error("cardMetadata.json was missing")
    }
  }

  async getCard(card){
    console.log("Card text is being accessed".cyan)
    if(card.lazyText){
      return card.lazyText
    }
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
              DB = self.data.cardDBs[i].data.collectionID==arg.params.collectionID? i:DB
            } else {
              var myfoo = self.data.cardDBs[i]//THIS MAKES NO SENSE BUT WHEN I DO IT THE NORMAL WAY IT DOESNT WORK
              for (var j = 0; j < (myfoo).data.cards.length; j++) {
                if(self.data.cardDBs[i].data.cards[j].ID === arg.params.cardID){
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
          DB = self.data.cardDBs[DB].data;


          for (var i = 0; i < DB.cards.length; i++) {
            if(DB.cards[i].ID === arg.params.cardID){
              var card = DB.cards[i];
              (async ()=>{
                if(!arg.params.justMeta){
                  var text = await card.text
                  card = JSON.parse(JSON.stringify(card))//Duplicate it
                  card.text = text //Set the duplicate
                  event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:card})
                } else {
                  var newCard = {}
                  for (var prop in card)
                    if (card.hasOwnProperty(prop) && prop !== "text" || prop !=="lazyText")
                      newCard[prop]=card[prop];
                  event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:newCard})
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
            var tmp = self.data.cardDBs[i].data
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
            console.log(arg )
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
          if(self.data.cardDBs[i].data.collectionID == arg.params.collectionID){
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
          dateCaught: new Date(1800,0,0),//Chances are nobody will catch a card before this date.
        }]
        var numResults = arg.params.numResults || 10

        for (var i = 0; i < self.data.cardDBs.length; i++) {
          var tmp_db = self.data.cardDBs[i]
          for (var j = 0; j < tmp_db.data.cards.length; j++) {
            var tmp_card = tmp_db.data.cards[j]
            if(tmp_card.dateCaught > results[results.length-1].dateCaught){
              results.push({
                ID:tmp_card.ID,
                dateCaught:tmp_card.dateCaught,
                collectionID:self.data.cardDBs[i].data.collectionID
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
