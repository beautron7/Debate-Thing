import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css'

export default class Sidebar extends Component {
  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
    shrinkTopMargin: PropTypes.bool.isRequired,
  }

  render(){
    const {
      left,
      right,
      children,
      shrinkTopMargin,
    } = this.props;

    var style = {}
    if(right){style.right='0em'}
    if(left){style.left='0em'}
    if(!shrinkTopMargin()){style.top='1.8em'}

    return (
      <div className="side-bar" style={style}>
        {children}
      </div>
    )
  }
}
