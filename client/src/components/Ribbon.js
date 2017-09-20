import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Ribbon.css'
import RibbonButton from './RibbonButton.js'

export default class Ribbon extends Component {

  constructor(a,b,c){
    super(a,b,c)

    Ribbon.spools = [
      <div>
          <div className="section">
            <RibbonButton
              title="Open"
              icon={<i className="glyphicon glyphicon-open-file"></i>}
              size="md"
            />
            <RibbonButton
              title="Save"
              icon={<i className="glyphicon glyphicon-save-file"></i>}
              size="md"
            />
            <RibbonButton
              title="4"
              icon={<i className="glyphicon glyphicon-save-file"></i>}
              size="md"
            />
          <div className="terminator"></div></div>
      </div>,
      <div>
        <span>Edit</span>
      </div>,
      <div>
        <span>Settings</span>
      </div>,
      <div>

          <RibbonButton
            onClick={x=>window.App.leftBar.toggleVis()}
            title="Nav"
          />
        <RibbonButton
            onClick={x=>window.App.rightBar.toggleVis()}
            title="Research"
          />
      </div>,
    ]
  }

  get show(){
    if (typeof window.App.Tabbar === "undefined" || window.App.Tabbar === null)
      return true
    return  window.App.Tabbar.paneNumber !== -1
  }

  render(){
    return this.show? (
      <div className='ribbon'>
        {Ribbon.spools[window.App.Tabbar.paneNumber]}
      </div>
    ):null
  }
}
