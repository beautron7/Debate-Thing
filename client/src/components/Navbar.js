import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Navbar.css'
import {Tree} from './Tree'
export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state={tree:new Tree()}
  }

  render(){
    return (
      <Navbar.Folder tree={
        this.state.tree._root
      }/>
    )
  }

  static Folder = class Folder extends Component {
    render(){
      return (
        <div className="Folder">
          <span className="name">
            <div className="checkbox-toggle">
              <input className="toggle-vis" type="checkbox"/>
            </div>
            Folder
          </span>
          <div className="contents">
            {this.props.tree.children.map((x,i) => (
              <Folder tree={x}/>
            ))}
          </div>
        </div>
      )
    }
  }
}
