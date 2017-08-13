import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Tab from './Tab'
import './Tabbar.css'

export default class Tabbar extends Component {
  constructor(a,b,c){
    super(a,b,c)
    this.paneNumber=0
    window.electron = window.electron||window.nodeRequire('electron');
  }

  showRibbon(){
    return this.currentTab !== -1
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
        <a className="fa fa-window-thing fa-window-close"    onClick={x=>window.electron.remote.getCurrentWindow().close()}></a>
        <a className="fa fa-window-thing fa-window-maximize" onClick={x=>window.electron.remote.getCurrentWindow().maximize()}></a>
        <a className="fa fa-window-thing fa-window-minimize" onClick={x=>window.electron.remote.getCurrentWindow().minimize()}></a>

        <i style={{'float':'right'}} onClick={()=>{this.paneNumber=-1;updateGUI()}} className="tab glyphicon glyphicon-eject"></i>
      </div>
    )
  }
}
