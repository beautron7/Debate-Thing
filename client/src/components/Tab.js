import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Tab.css'
import './noselect.css'

export default class Tab extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func,
  }

  render(){
    const {
      name,
      active,
      onClick,
    } = this.props
    var classes='tab noselect '

    if (active===true) {
      classes+= 'active '
    }

    return (
      <div onClick={onClick} className={classes}><span>{name}</span></div>
    )
  }
}
