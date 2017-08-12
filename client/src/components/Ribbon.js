import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Ribbon.css'

export default class Ribbon extends Component {
  static propTypes = {
    show: PropTypes.bool,
    paneNumber: PropTypes.number,
  }

  static spools = [
    (
      <span>file</span>
    ),(
      <span>edit</span>
    ),(
      <span>Settings</span>
    ),(
      <span>View Options</span>

    )
  ]

  render(){
    const {
      show,
      paneNumber,
    } = this.props

    return show? (
      <div className='ribbon'>
        {Ribbon.spools[paneNumber]}
      </div>
    ):null
  }
}
