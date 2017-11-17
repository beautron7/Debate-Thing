import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './ButtonGroup.css'

export default class RibbonGroup extends Component {
  render(){
    const {
      children,
      title
    } = this.props

    return (
      <ribbongroup>
        <rbody>
          {children}
          <title>
            {title}
          </title>
        </rbody>
      </ribbongroup>
    )
  }
}
