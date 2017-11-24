import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../web-css/Navbar.css'
import RibbonButton from '../web-components/RibbonButton.js'
import {Tree, CardPoint, SectionNode} from '../web-js/Tree'
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
      <div
        className="root"
        >
        <Navbar.Breadcrumb ref={x=>this.Breadcrumb=x}></Navbar.Breadcrumb>
        <Navbar.SectionNav
          node={
            this.state.tree._root
          }
          />
      </div>
    )
  }
}


Navbar.CardNav = class CardNav extends Component {
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

Navbar.SectionNav = class SectionNav extends Component {
  scrollToEditorNode(event){
    var pos = this.props.node.react.dom.scrollIntoView({behavior:"smooth"})
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

Navbar.Breadcrumb = class Breadcrumb extends Component {
  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    var nodes=[]
    if(this.state.activeNode){
      nodes=traverse(this.state.activeNode)
      nodes.splice(0,1)
    }

    return (
      <ol className="breadcrumb">
        <RibbonButton
          tooltip="[~] Click: Send to active speech doc. Alt+Click: Set this doc as active speech doc."
          icon="~"
          />
        <li className="breadcrumb-item">Root</li>
        {nodes.map((x,i)=>(
          <li key={x.key} className="breadcrumb-item">
            {
              <a onClick={x.onClick}>{x.text+"".slice(10)}</a>
            }
          </li>
        ))}
      </ol>
    )

    function traverse(node) {
      var rest = []
      if(node.parent){
        rest = traverse(node.parent)
      }
      return [...rest, {
        text:getNavName(node),
        onClick:node.nav.scrollToEditorNode.bind(node.nav),
        key:node.key,
      }]
    }
  }
}

function getNavName(node){
  if(node instanceof SectionNode){
    return node.data
  } else if (node instanceof CardPoint){
    return "[Card]"
  }
}
