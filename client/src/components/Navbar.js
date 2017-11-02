import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Navbar.css'
import {Tree, CardPoint, SectionNode} from './Tree'
export default class Navbar extends Component {
  constructor(props) {
    super(props)
    Navbar.instance=this;
    this.state={tree:new Tree()}
  }

  render(){
    return (
      <Navbar.Folder node={
        this.state.tree._root
      }/>
    )
  }

  static Endpoint(props){
    return (
      <div
        onClick={x=>this.forceUpdate()}
        className="Endpoint"
        >
        <div className="caret-placeholder"></div>
        <span className="name">
          {props.name}
        </span>
      </div>
    )
  }

  static Folder = class Folder extends Component {
    render(){
      const Endpoint = Navbar.Endpoint;

      // console.log(this.props.node)
      return (
        <div
          onClick={x=>this.forceUpdate()}
          className="Folder"
          >
          <input className="toggle-vis" type="checkbox"/>
          <span className="name">
            {this.props.node.data}
          </span>
          <div className="contents">
            {
              this.props.node.children.map((x,i) => {
                if(x instanceof SectionNode){
                  return <Folder key={x.key} node={x}/>
                } else if (x instanceof CardPoint){
                  return <Endpoint name={x.data.tag}/>
                }
              })
            }
          </div>
        </div>
      )
    }
  }
}
