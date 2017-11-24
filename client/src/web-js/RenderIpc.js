window.electron |= window.nodeRequire("electron");

var handler = {
  set(target, prop, value, receiver) {
    callMain({
      action:"setValue",
      path:[...target],
      prop:prop,
      value:value,
    })
  },

  get(target, prop){
    switch (prop) {
      case "callSync":
        return (...args) => new Promise((resolve,reject) => {
          callMain({
            action:"callSync",
            path:target,
            arguments:args,
          },resolve)
        })
        break;
      case "callAsync":
        return (...args) => new Promise((resolve,reject) => {
          callMain({
            action:"callAsync",
            path:target,
            arguments:args
          },resolve)
        })
        break;
      case "then":
        return callback => callMain({
          action:"getValue",
          path:target
        },callback);
        break;
      default: //accessing normal prop
        return new Proxy([...target,prop],handler);
        break;
    }
  }
}

function callMain(args,callback){
  args.replyChannel=window.qi;

  window.electron.ipcRenderer.once("ipc_proxy_reply ("+args.replyChannel+")",(event,reply)=>{
    if (reply.status==="ok") {
      if (callback instanceof Function)
        callback(reply.data);
    } else {
      console.error("RenderIpc Failed --- reply was:",reply);
    }
  });

  window.electron.ipcRenderer.send("ipc_proxy",args);
}

export default (new Proxy([],handler));
