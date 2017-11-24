class AbortableAsync {
  constructor(async_fn){
    this.__abort=false;

    var prom = async_fn(scope => this.clearance())
      .catch((e)=>{
        if(e.toString()==this.__stderr.toString()){
          console.info("Aborted.")
        }
      });

    for (var prop in prom) {
      this[prop]=prom[prop]
    }
  }

  clearance(){
    return this.__abort?
      this.__rejected:
      this.__accepted
  }

  abort(){
    this.__abort=true;
  }
}

AbortableAsync.__accepted = new Promise((y,n)=>{y(null)});
AbortableAsync.__rejected = new Promise((y,n)=>{n("Halted")});
(async x=>await x)(AbortableAsync.__rejected).catch((e)=>{AbortableAsync.__stderr=e})
// //Examplecode:
// var mockPromise =(time,data)=> (new Promise(a=>setTimeout(x=>a(data),time)))
//
// var tmp = new AbortableAsync(async (clearance)=>{
//   for (var i = 0; i < 10; i++) {
//     await clearance()
//     console.log(await mockPromise(1000,i))
//   }
// })
// setTimeout(()=>{tmp.abort()},6500)
