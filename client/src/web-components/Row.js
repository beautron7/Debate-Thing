import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import '../web-css/ButtonGroup.css'

export default class Row extends Component {
  render(){
    const {
      children
    } = this.props

    return (
      <div className="row">{children}</div>
    )
  }
}
