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
        <table><tbody><tr>
          {icon? <th className="icon">{icon}</th>:null}
          {title? <th className="title">{title}</th>:null}
        </tr></tbody></table>
      </div>
    )
  }
}
