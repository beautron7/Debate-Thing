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

  componentDidMount(){
    this.getDomCtx();
  }

  getDomCtx() {
    this.dataContainer = window.App.editor.state.data
    this.parentReactElement = Section.primarySection //used to forceUpdate
    //BUG: ^^^
    ///The code is breaking here because Section.primarySection isntisn't actually a react component, and so it doesdoesn't have a forceUPDATE method
    for (var i = 0; i < this.props.path.length-1; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i];
      this.parentReactElement = this.parentReactElement.children[index]
      this.dataContainer = this.dataContainer[index]
    }
    this.insertToIndex = this.props.path[this.props.path.length-1]
    this.domCtxReady=true
    return true
  }


  static onDrop(ev,self) {
    console.assert(self.domCtxReady)
    var text = ev.dataTransfer.getData("text/plain")
    if (text.slice(0,8) === "cardRef:") {
      ev.preventDefault();
      var cardInfo = JSON.parse(text.slice(8))
      window.appStorage.getCard(cardInfo.cardID,cardInfo.collectionID).then((card) => {
        self.dataContainer.splice(self.insertToIndex,0,card)
        // self.parentReactElement.forceUpdate()
      });
    }
    Circle.shrink(ev.target)
  }

  static onDragOver(ev,self) {
    ev.preventDefault();
  }

  static onDragEnter(ev,self) {
    Circle.grow(ev.target)
  }

  static onDragLeave(ev,self) {
    Circle.shrink(ev.target)
  }

  static grow(dom){
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

  static shrink(dom){
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


  static beginClick(self){
    var btn = self.dom
    var secs = 1;
    clearTimeout(self.clickID)
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

    self.clickID = setTimeout(()=>{
      Circle.endClick(self)
      self.dataContainer.splice(self.insertToIndex,0,["New Section"])
      self.parentReactElement.forceUpdate()
    },1000)
  }

  static endClick(self){
    var btn = self.dom
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

    clearTimeout(self.clickID)
  }

  render(){
    return (
      <div
        ref={self => {
          this.dom=self;
          if(self!=null){
            Circle.endClick(this)//Fixes a random bug
          }
        }}
        className="circle animate-margin-top"
        onDrop={ev=>Circle.onDrop(ev,this)}
        onDragOver={ev=>Circle.onDragOver(ev,this)}
        onDragEnter={ev=>Circle.onDragEnter(ev,this)}
        onDragLeave={ev=>Circle.onDragLeave(ev,this)}
        onMouseDown={ev=>Circle.beginClick(this)}
        onMouseUp={ev=>Circle.endClick(this)}
      >
      </div>
    )
  }
}
