import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './RibbonButtons.css'

export default class RibbonButton extends Component {
  static propTypes = {
    group:PropTypes.bool,
    children:PropTypes.node,
  }

  render(){
    const {
      group,
      children,
    } = this.props

    return group?
    (
      <div className="ribbon-button-group">
        {children}
      </div>
    ):(
      <div>
        
      </div>
    )
  }
}
