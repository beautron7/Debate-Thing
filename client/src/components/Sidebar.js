import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Sidebar extends Component {
  static propTypes = {
    left: PropTypes.bool,
    right: PropTypes.bool,
  }

  get baseStyle(){
    return {
      position: 'fixed',
      top: '7em',
      backgroundColor: 'lightgray',
      minWidth:'15em',
      width:'23%',
      height: '100%',
      paddingTop: '0em',
    }
  }

  render(){
    const {
      left,
      right,
      children,
    } = this.props;

    var style = {...this.baseStyle}
    if(right){style.right='0em'}
    if(left){style.left='0em'}

    return (
      <div style={style}>
        {children}
      </div>
    )
  }
}
