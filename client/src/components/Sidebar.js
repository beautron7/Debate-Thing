import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css'

export default class Sidebar extends Component {
  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
  }

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
    if(right){style.right='0em'}
    if(left){style.left='0em'}
    if(!window.App.Ribbon.show){style.top='1.8em'}
    if(!this.show){style.visibility='hidden'}
    return (
      <div className="side-bar" style={style}>
        {children}
      </div>
    )
  }
}
