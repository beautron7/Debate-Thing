import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ButtonGroup.css'

export default class ButtonGroup extends Component {
  render(){
    const {
      children
    } = this.props
    return (
      <div className="button-group">
        {children}
      </div>
    )
  }
}
