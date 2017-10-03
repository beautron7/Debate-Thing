var self = {
  get usrSettings(){
    return new Promise(function(resolve, reject) {
      callMainStorage({usrSettings:true},resolve)
    });
  },
  getCard(cardID,collectionID){
    return new Promise(function(resolve, reject) {
      callMainStorage({cardID:cardID,collectionID:collectionID},resolve)
    });
  },
  get DBlist(){
    return new Promise(function(resolve, reject) {
      callMainStorage({DBlist:true},resolve)
    });
  },
}

function callMainStorage(args,callback){
  var uniqueChannel = window.hash([new Date,Math.random()])
  args.replyChannel=uniqueChannel
  window.electron.ipcRenderer.once("appStorage"+uniqueChannel,(event,reply)=>{
    console.log(reply)
    if(reply.status=="ok")
      callback(reply.data);
    else
      console.error("ThErE's aN eRrOr",reply.status)
  })
  window.electron.ipcRenderer.send("appStorage",{
    replyChannel:uniqueChannel,
    ...args
  })
}

export default self
