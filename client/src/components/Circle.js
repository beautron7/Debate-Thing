import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Circle.css'
import './slideOpen.css'
import Section from './Section'

export default class Circle extends Component {
  static propTypes = {
    path:PropTypes.arrayOf(PropTypes.number).isRequired
  }

  constructor(a,b,c){
    super(a,b,c)
    this.domCtxReady=false;
  }

  getDomCtx() {
    this.dataContainer = window.App.editor.state.data
    this.parentReactElement = Section.Root

    for (var i = 0; i < this.props.path.length-1; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i];

      this.parentReactElement = 
      this.parentReactElement .children[index];
      
      this.dataContainer =
      this.dataContainer [index];
    }

    this.insertToIndex = this.props.path[this.props.path.length-1]
    this.domCtxReady=true
  }

  inject(obj){
    this.getDomCtx() //Context needs to be gotten every time you inject because the path to a section is not stait
    this.dataContainer.splice(this.insertToIndex, 0, obj) 
    this.parentReactElement.forceUpdate()      
  }

  onDrop(ev) {
    var text = ev.dataTransfer.getData("text/plain")
    if (text.slice(0,8) === "cardRef:") {
      ev.preventDefault();
      var cardInfo = JSON.parse(text.slice(8))
      window.appStorage.getCard(cardInfo.cardID,cardInfo.collectionID).then(this.inject.bind(this));
    }
    this.shrink(ev.target)
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

  grow(dom){
    dom.style.WebkitTransition=`
      height 0.35s,
      width 0.35s,
      margin-top 0.35s,
      margin-bottom: 0.35s,
    `
    dom.style.width="2em"
    dom.style.height="2em"
    dom.style.marginTop="0.5em"
    dom.style.marginBottom="0.5em"
  }

  shrink(dom){
    dom.style.WebkitTransition=`
      height 0.35s,
      width 0.35s,
      margin-top 0.35s,
      margin-bottom: 0.35s
    `
    dom.style.marginTop="1em"
    dom.style.marginBottom="1em"
    dom.style.width="1em"
    dom.style.height="1em"
  }


  beginClick(){
    var btn = this.dom
    var secs = 1;
    clearTimeout(this.clickID)
    btn.style.WebkitTransition=`
      height ${secs}s,
      width ${secs}s,
      margin-top ${secs}s,
      margin-bottom ${secs}s
    `

    btn.style.width="2em"
    btn.style.height="2em"
    btn.style.marginTop="0.5em"
    btn.style.marginBottom="0.5em"

    this.clickID = setTimeout(()=>{
      this.endClick()
      this.inject(["New Section"])
    },1000)
  }

  endClick(){
    var btn = this.dom
    var secs = 0.35
    btn.style.WebkitTransition=`
      height ${secs}s,
      width ${secs}s,
      margin-top ${secs}s,
      margin-bottom ${secs}s
    `

    btn.style.marginTop="1em"
    btn.style.marginBottom="1em"
    btn.style.width="1em"
    btn.style.height="1em"

    clearTimeout(this.clickID)
  }

  render(){
    return (
      <div
        ref={self => {
          this.dom=self;
          if(self!=null){
            this.endClick()//Fixes a random bug
          }
        }}
        className="circle animate-margin-top"
        onDrop={this.onDrop.bind(this)}
        onDragOver={this.onDragOver.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onMouseDown={this.beginClick.bind(this)}
        onMouseUp={this.endClick.bind(this)}
      >
      </div>
    )
  }
}
