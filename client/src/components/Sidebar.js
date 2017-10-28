import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Sidebar.css'

export default class Sidebar extends Component {
  // static propTypes = {
  //   left: PropTypes.bool,
  //   right: PropTypes.bool,
  // }

  constructor(a,b,c){
    super(a,b,c)
    this.show=true
    this.toggleVis =()=> {
      this.show = !this.show;
      this.forceUpdate()
      window.App.editor.forceUpdate()
    }
  }

  render(){
    const {
      left,
      right,
      children,
    } = this.props;

    var className = "side-bar"
    if(left)className+=" left";
    if(right)className+=" right";

    return this.show? (
      <div className={className}>
        {children}
      </div>
    ):null
  }
}
