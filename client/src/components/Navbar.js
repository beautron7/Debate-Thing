import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Navbar.css'
import {Tree, CardPoint, SectionNode} from './Tree'
const Aux =(props)=>props.children;

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    Navbar.instance=this;
    this.state=
      window.App.Editor?
        {tree:window.App.Editor.state.data}:
        {tree:new Tree()}
  }

  render(){
    return (
      <Aux>
        {/* <Navbar.Breadcrumb
          ref={x=>this.Breadcrumb=x}
        /> */}
        <Navbar.SectionNav node={
          this.state.tree._root
        }/>
      </Aux>
    )
  }

  static CardNav = class CardNav extends Component {
    constructor(props){
      super(props)
    }

    scrollToEditorNode(event){
      var pos = this.props.node.react.dom.scrollIntoView(true)
      if(event && event.stopPropagation) {
        event.stopPropagation()
      }
    }

    render(){
      var props = this.props;
      props.node.nav=this;
      return (
        <div
          className="nav-item-box"
          onClick={this.scrollToEditorNode.bind(this)}
          ref={self=>this.dom=self}
          >
          <div
            className="nav-item nav-card"
            >
            <i className="square fa fa-file-text-o"></i>
            <span className="name">
              {props.name}
            </span>
          </div>
        </div>
      )
    }
  }

  static SectionNav = class SectionNav extends Component {
    scrollToEditorNode(event){
      var pos = this.props.node.react.dom.scrollIntoView(true)
      if(event && event.stopPropagation) {
        event.stopPropagation()
      }
    }

    render(){
      const CardNav = Navbar.CardNav;
      this.props.node.nav = this;
      return (
        <div
          className="nav-item-box"
          onClick={this.scrollToEditorNode.bind(this)}
          ref={self=>this.dom=self}          
          >
          <div
            onClick={this.scrollToEditorNode.bind(this)}
            className="nav-item children"
            >
            
            <input onClick={ev=>{ev.stopPropagation()}} className="toggle-vis square" type="checkbox"/>
            <span className="name">
              {this.props.node.data}
            </span>
            <div className="slide-down-name">
              
            </div>
            <div className="contents">
              {
                this.props.node.children.map((x,i) => {
                  if(x instanceof SectionNode){
                    return <SectionNav key={x.key} node={x}/>
                  } else if (x instanceof CardPoint){
                    return <CardNav    key={x.key} node={x} name={x.data.tag}/>
                  }
                })
              }
            </div>
          </div>
        </div>        
      )
    }
  }

  static Breadcrumb = class Breadcrumb extends Component {
    constructor(props){
      super(props)
      this.state={}
    }
    
    render(){
      var nodes = [];
      
      this.state.activeNode && traverse(this.state.activeNode)

      return (
        <ol className="breadcrumb">
          {nodes.map((x,i)=>(
            <li key={x.key} className="breadcrumb-item">
              {
                x.href && <a onClick={x.onClick}>{x.name}</a>
              }
            </li>
          ))}
        </ol>
      )

      function traverse(node) {
        nodes.push({
          text:node.nav.props.name,
          onClick:node.nav.scrollToEditorNode(),
          key:node.key,
        })
        if(node.parent){
          traverse(node.parent)
        }
      }
    }
  }
}
