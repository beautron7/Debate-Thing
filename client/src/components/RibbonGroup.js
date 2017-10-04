import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ButtonGroup.css'

export default class RibbonGroup extends Component {
  render(){
    const {
      children,
      title
    } = this.props

    return (
      <div className="ribbon-group">
        <div className="top">
          {children}
          <div className="bottom">
            {title}
          </div>
        </div>
      </div>
    )
  }
}
