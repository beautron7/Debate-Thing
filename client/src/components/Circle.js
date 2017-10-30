import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import './Circle.css'
import './slideOpen.css'
import Section from './Section'
import Tree from './Tree'

export default class Circle extends Component {

  constructor(props){
    super(props)
    this.domCtxReady=false;
  }

  getDomCtx() {
    var data = window.App.editor.state.data._root
    this.parentReactElement = Section.Root
    this.dataContainer = data;
    for (var i = 0; i < this.props.path.length-1; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i];

      this.parentReactElement= 
      this.parentReactElement.children[index];
      
      this.dataContainer=
      this.dataContainer.children[index];
    }

    this.insertToIndex = this.props.path[this.props.path.length-1]
    this.domCtxReady=true
  }

  inject(obj){
    this.getDomCtx() //Context needs to be gotten every time you inject because the path to a section is not stait
    this.dataContainer.addNode(obj,this.insertToIndex-1) 
    this.parentReactElement.forceUpdate()      
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
          this.inject(new Tree.Node.CardNode(data))
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
      this.inject(new Tree.Node.SectionNode("New Section"))
    },1000)
  }

  endClick(){
    this.dom.classList.remove("slow")
    this.dom.classList.remove("large")
    clearTimeout(this.clickID)
  }

  render(){
    return ([
      <div key={-1} className="terminator"/>,
      <div
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
      </div>,
      <div key={1} className="terminator"/>      
    ])
  }
}
