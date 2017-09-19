import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './RibbonButtons.css'

export default class RibbonButton extends Component {
  static propTypes = {
    title:PropTypes.string,
    dropdown:PropTypes.node,
    icon:PropTypes.node,
  }

  render(){
    var {
      title,
      icon,
      dropdown,
      size,
    } = this.props
    size = size || "md"
    return (
      <div className={"ribbon-button "+size}>

        {icon? <div className="icon">{icon}</div>:null}
        {title? <div className="title">{title}</div>:null}
        {/* <table><tbody><tr>
        </tr></tbody></table>*/}

      </div>
    )
  }
}
