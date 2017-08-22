import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Ribbon.css'

export default class Ribbon extends Component {

  constructor(a,b,c){
    super(a,b,c)

    Ribbon.spools = [
      (<div>
        <span>File</span>
      </div>),(<div>
        <span>Edit</span>
      </div>),(<div>
        <span>Settings</span>
      </div>),(<div>
        <div className="btn-group">
          <span onClick={x=>window.App.leftBar.toggleVis()} className="btn btn-primary btn-xs">Toggle Left sidebar</span>
          <span onClick={x=>window.App.rightBar.toggleVis()}  className="btn btn-primary btn-xs">Toggle Right sidebar</span>
        </div>
      </div>),
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
