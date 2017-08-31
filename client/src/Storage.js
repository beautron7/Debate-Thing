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

var self ={
  init:function(){
    if(!self.loading){
      self.loading=true
      self.fs=window.nodeRequire('mz/fs')
      self.load.usrSettings()
        .then(self.load.cardDBs)
        .then(()=>{self.ready=true})
    } else {
      console.log("appStorage already ready!")
    }
  },
  load:{
    usrSettings: Loader("usrSettings","./cfg/usrSettings.json",{cardSrces:[]}),
    DB: async function (path) {
      var fileExists = await self.fs.exists(path+"/cardMetadata.json")
      if (fileExists){
        var cardCollectionTXT = await self.fs.readFile(path+"/cardMetadata.json")
        var cardCollectionData = JSON.parse(cardCollectionTXT)

        cardCollectionData.getCard = (async function(ID,_self){
          var cardTextPath = path+"/cards/"+ID+".cardText.json"
          var fileExists = await self.fs.exists(cardTextPath)
          if (fileExists){
            var txt = (await self.fs.readFile(cardTextPath)).toString()
            var obj = JSON.parse(txt)
            if (obj.ID && obj.ID === ID && obj.text) {
              _self.lazyText = obj.text
              return _self.lazyText
            } else {
              console.error("Card was malformatted")
            }
          } else {
            console.error("Card couldn't be looked up --- File doesn't exist")
          }
        })

        for (var i = 0; i < cardCollectionData.cards.length; i++){
          var currentCard = cardCollectionData.cards[i]
          delete currentCard.text
          cardCollectionData.cards[i]={
            set text(v){
              console.error(v,"Trace");
            },
            get text(){
              var _self = this
              if (_self.lazyText)
                return new Promise(function(resolve){resolve(_self.lazyText)});
              return cardCollectionData.getCard(currentCard.ID,_self)
            },
            ...cardCollectionData.cards[i]
          }
        }

        self.data.cardDBs.push({
          path:path,
          dateCaught:new Date(cardCollectionData.dateCaught),
          datePublished:new Date(cardCollectionData.datePublished),
          ...cardCollectionData
        })
        return
      } else {
        console.error("File does not exist --- appStorage.load.DB")
      }
    },
    cardDBs: async function(){
      var promises = []

      for (var i = 0; i < self.data.usrSettings.cardSrces.length; i++) {
        self.load.DB(self.data.usrSettings.cardSrces[i])
        // var path = self.data.usrSettings.cardSrces[i]
        // var fileExists = await self.fs.exists(path)
        // if (fileExists){
        //   promises.push(
        //     self.fs.readFile(path)
        //   )
        // } else {
        //   console.error("File does not exist --- appStorage.load.cardDBs");
        // }
      }

      for (var i = 0; i < promises.length; i++) {
        try{
          await promises[i]
        //   self.data.cardDBs.push({
        //     path:self.data.usrSettings.cardSrces[i],
        //     ...JSON.parse(await promises[i])
        //   })
        //   console.log(i)
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
    getIDS(query,sort,maxResults){
      var possibleFields = [
        "ID",
        "title",
        "dateCaught",
        "datePublished",
        "text",
        "author",
        "url",
        "keywords",
        "dbSignature",
      ]
      if(self.ready){
        var results = []

        for (var key in query) {
          if(possibleFields.contains(key)){

          } else {
            console.log("Unidentified Key: "+key)
          }
        }
      }
    },
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
export default self
