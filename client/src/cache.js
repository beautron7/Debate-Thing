var self = {
  async loadState(path){
    /*{
      metadata:{
        "filename":"afds"
        "authors":[{
          "First":"Name",
          "Last":"Name",
          "Team":{
            "name":"school",
            "id":"rwerqrew897"
          }
        }]
      }
      data:{
        ["file-name"],
        [
          "Contention1",
          {
            "Tag":"Global climate action",
            "meta":{
              //card metadata
            },
            "Sections":[
              {
                "start_snippet":"the shortness of human life is the onto",
                "start_index":10,
                "end_snippet":"ontological death",
                "start_index":100,
              }, // ...
            ]
          }
        ]
      }
    }*/
    this.state = await new Promise(function(resolve,reject){
      callMainStorage({
        action:"loadState",
        params:{path:path}
      })
    })
    window.App.editor
  },
  get usrSettings(){
    return new Promise(function(resolve, reject) {
      callMainStorage({
        action:"getUsrSettings"
      },resolve)
    });
  },
  getCard(cardID,collectionID,justMeta){
    return new Promise(function(resolve, reject) {
      callMainStorage({
        action:"getCard",
        params:{
          cardID:cardID,
          collectionID:collectionID,
          justMeta:justMeta
        }
      },resolve)
    });
  },
  getRecentCards(number){
    return new Promise(function(resolve, reject) {
        callMainStorage({
          action:"getRecentCards",
          params:{
            numResults:number
          }
        },resolve)
    });
  },
  get DBlist(){
    return new Promise(function(resolve, reject) {
      callMainStorage({
        action:"DBlist"
      },resolve)
    });
  },
  DBmeta(id){
    return new Promise(function(resolve, reject) {
      callMainStorage({
        action:"getDBmeta",
        params:{
          collectionID:id
        }
      },resolve)
    });
  },
  addCard(cardData,collectionID){
    return new Promise(function(resolve, reject) {
      callMainStorage({
        action:"addCard",
        params:{
          cardData:cardData,
          collectionID:collectionID,
        }
      },resolve)
    });
  },
}

function callMainStorage(args,callback){
  var uniqueChannel = window.hash([new Date(),Math.random()])
  args.replyChannel=uniqueChannel
  window.electron.ipcRenderer.once("appStorage"+uniqueChannel,(event,reply)=>{
    if(reply.status==="ok")
      callback(reply.data);
    else
      console.error("ThErE's aN eRrOr: ",reply)
  })
  window.electron.ipcRenderer.send("appStorage",{
    replyChannel:uniqueChannel,
    ...args
  })
}

export default self
