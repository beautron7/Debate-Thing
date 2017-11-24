import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Tab from './Tab'
import HideForMac from './HideForMac'
import '../web-css/Tabbar.css'

export default class Tabbar extends Component {
  constructor(a,b,c){
    super(a,b,c)

    this.state={maximized:true,paneNumber:0}

    window.electron = window.electron||window.nodeRequire('electron');
    window.electron.ipcRenderer.on('Window-State',(event, message) => {
      console.log(message)
      window.state=message;
      this.setState({maximized:(message === "maximized")})
    })
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
    const tabs = ['File','Editing','Settings','View'].map((x,i)=>(
      <Tab
        active={
          this.state.paneNumber===i
        }
        name={x}
        key={i}
        onClick={()=>{
          window.App.Ribbon.setState({paneNumber:i});
          this.setState({paneNumber:i});
        }}
      />
    ))

    return (
      <tabcontainer className='tab-container'>
        {tabs}
        <HideForMac>
          <icon
            aria-label="close window"
            className="fa fa-times"
            onClick={x=>window.electron.remote.getCurrentWindow().close()}
            />
          <icon
            aria-label="restore-down / maximize window"
            className={"fa fa-window-"+(this.state.maximized?'restore':'maximize')}
            onClick={this.toggleMaximize}
            />
          <icon
            aria-label="minimize window"
            className="fa fa-window-minimize"
            onClick={x=>window.electron.remote.getCurrentWindow().minimize()}
            />
        </HideForMac>
        <tab
          style={{'float':'right'}}
          onClick={x=>{
            this.setState({paneNumber:-1})
            window.App.Ribbon.setState({paneNumber:-1})
          }}
          className="tab glyphicon glyphicon-eject"
          />
      </tabcontainer>
    )
  }
}
