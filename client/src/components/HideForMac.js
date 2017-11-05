import React, {Component} from 'react';

export default class HideForMac extends Component {
  render(){
    if(window.electron.remote.process.platform === "darwin"){
      return null
    } else {
      return this.props.children
    }
  }
}
