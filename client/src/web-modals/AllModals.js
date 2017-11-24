// var modals = ["newCard",""]
// var modules = [];
// for (var i = 0; i < modals.length; i++) {
//   modules[modals[i]] = require("./"+modals[i]).default
// }

var tmp = new Proxy({},{
  get: (target,name)=>{
    if(!target[name]){
      target[name]=require("./"+name).default
    }
    return target[name]
  }
})

export default tmp
