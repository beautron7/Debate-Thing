import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import Tab from './Tab'
import './Tabbar.css'

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
      <div className='tab-container'>
        {tabs}
        <i aria-label="close window" className="fa fa-window-thing fa-window-close"    onClick={x=>window.electron.remote.getCurrentWindow().close()}></i>
        <i aria-label="restore-down / maximize window" className={"fa fa-window-thing fa-window-"+(this.state.maximized?'restore':'maximize')} onClick={this.toggleMaximize}></i>
        <i aria-label="minimize window" className="fa fa-window-thing fa-window-minimize" onClick={x=>window.electron.remote.getCurrentWindow().minimize()}></i>

        <i
          style={{'float':'right'}}
          onClick={
            ()=>{
              this.setState({paneNumber:-1})
              window.App.Ribbon.setState({paneNumber:-1})
            }
          }
          className="tab glyphicon glyphicon-eject"
          >
        </i>
      </div>
    )
  }
}
