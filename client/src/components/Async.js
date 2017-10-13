import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Async extends Component {
  constructor(props,b,c){
    super(props,b,c)
    var prom;
    this.status="pending"

    if (props.function){
      prom = new Promise(props.function);
    } else {
      prom = props.promise
    }

    prom.then((data)=>{
      this.data=data;
      this.status="resolved";
      this.forceUpdate();
    }).catch((e)=>{
      this.status="rejected";
      this.data=e;
      this.forceUpdate();
    });
  }

  render(){
    if(this.status=="resolved"){
      for (prop of ["resolved","success","ready"]) {
        if (this.props[prop]) {
          return this.props[prop](this.data)
        }
      }
    }
    if(this.status=="rejected"){
      for (var prop of ["rejected","failed","error"]) {
        if (this.props[prop]) {
          return this.props[prop](this.data)
        }
      }
    }
    if(this.status=="pending"){
      return this.props.children
    }
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
