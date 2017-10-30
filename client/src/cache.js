var self = {
  async loadState(path){
    this.state = await new Promise(function(resolve,reject){
      callMainStorage({
        action:"loadState",
        params:{path:path}
      })
    })
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
