import React, {Component} from 'react';

export default class Sidebar extends Component {
  constructor(props,a,b){
    super(arguments)
  }

  get style(){
    return {
      float: this.props.float,
      backgroundColor:'red',
      minHeight:'100%',
      minWidth:'10%'
    }
  }

  render(){
    const {
      left,
      right,
      children,
      ...props
    } = this.props;

    return (
      <div style={this.style}>
        <span>foo</span>
      </div>
    )
  }
}
