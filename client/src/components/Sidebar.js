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
      // shrinkTopMargin,
    } = this.props;

    var style = {}
    if(right){style.order='1'}
    if(left){style.order='-1'}
    // if(!window.App.Ribbon.show){style.top='1.8em
    // if(!this.show){
    //   style.flexBasis="0.1em";
    //   style.maxWidth="0";
    //   style.visibility="hidden"
    // } else {
    //   style.flexBasis="23%"
    //   style.visibility="visible"
    //   style.maxWidth="9999999em";
    // }
    return this.show? (
      <div className="side-bar" style={style}>
        {children}
      </div>
    ):null
  }
}
