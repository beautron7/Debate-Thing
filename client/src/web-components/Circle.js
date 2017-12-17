import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import '../web-css/Circle.css'
// import '../web-css/slideOpen.css'
import Section from './Section'
import {CardPoint, SectionNode} from '../web-js/Tree'
const Aux =p=>p.children;

export default class Circle extends Component {

  constructor(props){
    super(props)
    this.domCtxReady=false;
  }

  getDomCtx() {
    this.dataContainer = this.props.tree;
    this.parentReactElement = this.dataContainer.react;
    this.corresponding_nav_pane = this.dataContainer.nav;
  }

  inject(obj){
    this.getDomCtx() //Context needs to be gotten every time you inject because the path to a section is not stait
    this.dataContainer.addChildNode(obj,this.props.path)
    this.parentReactElement.forceUpdate()
    this.corresponding_nav_pane.forceUpdate()
  }

  onDrop(ev) {
    var text = ev.dataTransfer.getData("text/plain")
    if (text.slice(0,8) === "cardRef:") {
      ev.preventDefault();
      var cardInfo = JSON.parse(text.slice(8))
      window.appStorage
        .getCard(
            cardInfo.cardID,
            cardInfo.collectionID
        )
        .then(data=>{
          this.inject(new CardPoint(data))
        });
    }
    this.shrink();
  }

  onDragOver(ev) {
    ev.preventDefault();
  }

  onDragEnter(ev) {
    this.grow(ev.target)
  }

  onDragLeave(ev) {
    this.shrink(ev.target)
  }

  grow(){
    this.dom.classList.remove("slow")
    this.dom.classList.add("large")
  }

  shrink(){
    this.dom.classList.remove("slow")
    this.dom.classList.remove("large")
  }


  beginClick(){
    clearTimeout(this.clickID)
    this.dom.classList.add("slow")
    this.dom.classList.add("large")

    this.clickID = setTimeout(()=>{
      this.endClick()
      this.inject(new SectionNode("New Section"))
    },1000)
  }

  endClick(){
    this.dom.classList.remove("slow")
    this.dom.classList.remove("large")
    clearTimeout(this.clickID)
  }

  render(){
    return (<Aux>

      <circle
        key={0}
        ref={self => {
          this.dom=self;
          // if(self!=null){
          //   // this.endClick()//Fixes a random bug
          // }
        }}
        className="circle animate-margin-top"
        onDrop={this.onDrop.bind(this)}
        onDragOver={this.onDragOver.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onMouseDown={this.beginClick.bind(this)}
        onMouseUp={this.endClick.bind(this)}
      >
      </circle>
    </Aux>)
  }
}
