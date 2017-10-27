import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Async extends Component {
  shouldComponentUpdate(){return false}

  constructor(props,b,c){
    super(props,b,c)
    this.state={}

    var prom;
    this.state.status="pending"

    if (props.function){
      prom = new Promise(props.function);
    } else {
      prom = props.promise
    }

    prom.then((data)=>{
      this.state.data=data;
      this.state.status="resolved";
      this.forceUpdate(); //is ok
    }).catch((e)=>{
      this.state.status="rejected";
      this.state.data=e;
      this.forceUpdate(); //is ok
    });
  }

  shouldComponentUpdate(nextProps,nextState){
    //props should be constant,
    if(nextState.status !== this.state.status){
      return true
    }
  }

  render(){
    if(this.state.status=="resolved"){
      for (prop of ["resolved","success","ready"]) {
        if (this.props[prop]) {
          return this.props[prop](this.state.data)
        }
      }
    }
    if(this.state.status=="rejected"){
      for (var prop of ["rejected","failed","error"]) {
        if (this.props[prop]) {
          return this.props[prop](this.state.data)
        }
      }
    }
    if(this.state.status=="pending"){
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
