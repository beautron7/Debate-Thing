import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Circle.css'
import './slideOpen.css'

export default class Circle extends Component {
  static propTypes = {
    path:PropTypes.arrayOf(PropTypes.number).isRequired
  }

  // constructor(a,b,c){
  //   super(a,b,c)
  // }

  static onDrop(ev,self) {
    var text = ev.dataTransfer.getData("text/plain")
    if (text.slice(0,8) == "cardRef:") {
      ev.preventDefault();
      var insertionPointParent = window.App.editor.data
      var parentReactElement = window.App.editor.primarySection //used to forceUpdate
      for (var i = 0; i < self.props.path.length-1; i++) {//stop before the final point so splicing can occour.
        var index = self.props.path[i]
        parentReactElement = parentReactElement.children[index]
        insertionPointParent = insertionPointParent[index]
      }
      var insertToIndex = self.props.path[self.props.path.length-1]
      var cardInfo = JSON.parse(text.slice(8))
      window.appStorage.getCard(cardInfo.cardID,cardInfo.collectionID).then(function (card) {
        card.tag = card.tag? card.tag:card.title
        insertionPointParent.splice(insertToIndex,0,card)
        parentReactElement.forceUpdate()
      });
    } else if (text.slice(0,8) == "secPath:") {
      console.log("HI");
      var insertionPointParentArray = window.App.editor.data
      for (var i = 0; i < self.props.path.length-1; i++) {//stop before the final point so splicing can occour.
        var destinationIndex = self.props.path[i]
        insertionPointParentArray = insertionPointParentArray[destinationIndex]
      }

      var senderPath=JSON.parse(text.slice(8))
      var sourceSection = window.App.editor.data
      for (var i = 0; i < senderPath.length-1; i++) {
        var originIndex = senderPath[i]
        sourceSection=sourceSection[originIndex]
      }

      insertionPointParentArray.splice(insertToIndex,0,sourceSection[senderPath[senderPath.length-1]])
      sourceSection.splice(senderPath[senderPath.length-1],1)

      window.App.editor.forceUpdate()
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
      alert("You have held click")
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
