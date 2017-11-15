//var div = Check(window).app.navbar.div
//if (div._exists) {div = div._value; div.focus()}

//Check(window).search().failed
function Check(obj) {
  var failed = new Proxy(()=>{},{
    get:(target,prop)=>{
      if(prop[0]==="_"){
        return false
      } else {
        return failed;
      }
    },
    set:(target,prop)=>{},
    apply:(target,self,args)=>({failed:true}),
  })

  var handler={get:get,set:set,apply:apply}
  
  return new Proxy(obj,handler);


  function get(target,prop){
    if(prop[0]=="_"){
      if(prop=="_exists"){
        return true
      } else if (prop=="_value"){
        return target
      }
    } else if(target[prop]){
      return new Proxy(Object(target[prop]),handler)
    } else {
      return failed;
    }
  }

  function set(target,prop,value) {
    target[prop]=value
  }

  function apply(target,self,args){
    try {
      return {failed:false,value:target.apply(self,args)}
    } catch (e) {
      return {failed:true}
    }
  }
}