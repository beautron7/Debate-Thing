import {Component} from 'react';

export default class Async extends Component {
  shouldComponentUpdate(){return false}

  constructor(props,b,c){
    super(props,b,c)
    this.state={status:"pending"}

    var prom;

    if (props.function){
      prom = new Promise(props.function);
    } else {
      prom = props.promise
    }

    prom.then((data)=>{
      this.setState({
        status:"resolved",
        data:data,
      });
      this.forceUpdate(); //is ok
    }).catch((e)=>{
      this.setState({
        status:"rejected",
        data:e,
      })
      this.forceUpdate(); //is ok
    });
  }

  render(){
    if(this.state.status==="resolved"){
      for (var good_prop of ["resolved","success","ready"]) {
        if (this.props[good_prop]) {
          return this.props[good_prop](this.state.data)
        }
      }
    } else if(this.state.status==="rejected"){
      for (var bad_prop of ["rejected","failed","error"]) {
        if (this.props[bad_prop]) {
          return this.props[bad_prop](this.state.data)
        }
      }
    } else if(this.state.status==="pending"){
      return this.props.children
    }
    return this.props.children;
  }
}

// <Async
//   promise={/*Promise*/}
//   resolved={x=><span>{x}</span>}
//   rejected={e=><span>Failed with error {e}</span>}
// >
//   <span>Loading</span>
// </Async>
//
// <Async
//   function={
//     function (success_callback,error_callback) {
//       setTimeout(function(){
//         success_callback("Woot!");
//       },1000)
//     }
//   }
//   resolved={x=>(<span>Success! this is the data:{x}</span>)}
//   rejected={e=><span>Failed! this is what happened: {e}</span>}
// >
//   <span>Loading</span>
// </Async>
