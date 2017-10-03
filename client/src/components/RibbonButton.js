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
      size,
      onClick,
      tooltip,
    } = this.props
    size = size || "md"
    return (
      <div onClick={onClick} title={tooltip} className={"ribbon-button "+size}>
        {icon? <div className="icon">{icon}</div>:null}
        {title? <span className="title">{title}</span>:null}
        {/* <table><tbody><tr>
        </tr></tbody></table>*/}

      </div>
    )
  }
}
