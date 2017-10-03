import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Tab from './Tab'
import './Tabbar.css'

export default class Tabbar extends Component {
  constructor(a,b,c){
    super(a,b,c)
    this.paneNumber=0
    window.electron = window.electron||window.nodeRequire('electron');
    window.electron.ipcRenderer.on('Window-State',(event, message) => {
      console.log(message)
      window.state=message
      window.App.Tabbar.forceUpdate()
    })
  }

  showRibbon(){
    return this.currentTab !== -1
  }

  toggleMaximize(){
    var browserWindow = window.electron.remote.getCurrentWindow()
    if(window.state==="maximized"){
      browserWindow.unmaximize()
    } else {
      browserWindow.maximize()
    }
  }



  render(){

    const {updateGUI} = window.App

    const tabs = ['File','Edit','Settings','View'].map((x,i)=>(
      <Tab
        active={this.paneNumber===i}
        name={x}
        key={i}
        onClick={()=>{
          if(window.App.Ribbon.show){
            this.paneNumber=i
            this.forceUpdate()
            window.App.Ribbon.forceUpdate()
          } else {
            this.paneNumber=i
            updateGUI()
          }
        }}
      />
    ))
    return (
      <div className='tab-container'>
        {tabs}
        <i ariaLabel="close window" className="fa fa-window-thing fa-window-close"    onClick={x=>window.electron.remote.getCurrentWindow().close()}></i>
        <i ariaLabel="restore-down / maximize window" className={"fa fa-window-thing fa-window-"+(window.state==='maximized'?'restore':'maximize')} onClick={this.toggleMaximize}></i>
        <i ariaLabel="minimize window" className="fa fa-window-thing fa-window-minimize" onClick={x=>window.electron.remote.getCurrentWindow().minimize()}></i>

        <i style={{'float':'right'}} onClick={()=>{this.paneNumber=-1;updateGUI()}} className="tab glyphicon glyphicon-eject"></i>
      </div>
    )
  }
}
