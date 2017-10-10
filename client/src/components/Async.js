import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Async extends Component {
  constructor(props,b,c){
    super(props,b,c)
    this.status="pending"
    props.promise.then((data)=>{
      this.data=data
      this.status="resolved"
      this.forceUpdate();
    }).catch(()=>{
      this.status="rejected"
      this.forceUpdate();
    });
  }

  render(){
    if(this.status=="resolved"){
      return this.props.resolved(this.data)
    }
    if(this.status=="rejected"){
      return this.props.rejected;
    }
    if(this.status=="pending"){
      return this.props.pending
    }
    return <span>Error</span>;
  }
}

// <Async
//   prom={/*Promise*/}
//   resolved={x=>(<span>{x}</span>)}
//   pending={<span>Loading</span>}
//   rejected={<span>Failed</span>}
// />
