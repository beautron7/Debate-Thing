import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab'
import Ribbon from './Ribbon'

import './Tabbar.css'

export default class Tabbar extends Component {
  static propTypes = {
    updateGUI: PropTypes.func.isRequired,
  }

  constructor(){
    super(arguments)
    this.currentTab=1
  }

  get showRibbon(){
    return this.currentTab !== -1
  }

  render(){
    const {
      updateGUI,
    } = this.props

    const tabs = ['File','Edit','Settings','View'].map((x,i)=>(
      <Tab
        active={this.currentTab===i}
        name={x}
        key={i}
        onClick={()=>{
          this.currentTab=i
          updateGUI()
        }}
      />
    ))

    return (
      <div>
        <div className='tab-container'>
          {tabs}
          <i style={{'float':'right'}} onClick={()=>{this.currentTab=-1;updateGUI()}} className="tab glyphicon glyphicon-eject"></i>
        </div>
        <div>
          <Ribbon show={this.showRibbon} paneNumber={this.currentTab}/>
        </div>
      </div>
    )
  }
}
