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
      this.data.cards.push(cardData)
      this.data.lastUpdated=new Date
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
      this.data.cards.push(cardData)
      return "success"
    } else {
      throw new Error("cardMetadata.json was missing")
    }
  }

  async getCard(card){
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
            DB = self.data.cardDBs[i].data.collectionID==arg.params.collectionID? i:DB
          }
          if (DB === -1){
            throw new Error("DB can't be found")
          }
          DB = self.data.cardDBs[DB].data;

          for (var i = 0; i < DB.cards.length; i++) {
            if(DB.cards[i].ID === arg.params.cardID){
              var card = DB.cards[i];
              (async ()=>{
                var text = await card.text
                card = JSON.parse(JSON.stringify(card))//Duplicate it
                card.text = text //Set the duplicate
                event.sender.send("appStorage"+arg.replyChannel,{status:"ok",data:card})
              })();
              return
            }
          }
          event.sender.send("appStorage"+arg.replyChannel,{status:"failed",error:"card not found"})
        } catch (e) {
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
      break; default:
        console.error("Unknown action")
      break;
    }



  }
})
exports.default = self
