import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Circle.css'

export default class Circle extends Component {
  static propTypes = {
    path:PropTypes.arrayOf(PropTypes.number).isRequired
  }

  constructor(a,b,c){
    super(a,b,c)
  }
  static onDrop(ev,self) {
    var cardUrl = ev.dataTransfer.getData("text/plain")
    if (cardUrl.slice(0,8) != "cardRef:") {
      Circle.onDragLeave(ev,self)
      return false
    }

    ev.preventDefault();
    console.log("Droped Circle",cardUrl,"at",self.props.path);
    var insertionPointParent = window.App.editor.data
    var parentReactElement = window.App.editor.primarySection //used to forceUpdate

    for (var i = 0; i < self.props.path.length-1; i++) {//stop before the final point so splicing can occour.
      var index = self.props.path[i]
      parentReactElement = parentReactElement.children[index]
      insertionPointParent = insertionPointParent[index]
    }

    var insertToIndex = self.props.path[self.props.path.length-1]
    insertionPointParent.splice(insertToIndex,0,window.App.getCardDataByUrl(cardUrl))
    parentReactElement.forceUpdate()

    Circle.onDragLeave(ev,self)
  }
  static onDragOver(ev,self) {
    ev.preventDefault();
    // console.log("Over","Circle",ev);
    ev.target.style.width
    ev.dataTransfer.dropEffect = "link"
  }
  static onDragEnter(ev,self) {
    ev.target.style.width="2em"
    ev.target.style.height="2em"
  }
  static onDragLeave(ev,self) {
    ev.target.style.width="1em"
    ev.target.style.height="1em"
  }


  render(){
    const {
      path
    } = this.props

    return (
      <div
        className="circle"
        onDrop={ev=>Circle.onDrop(ev,this)}
        onDragOver={ev=>Circle.onDragOver(ev,this)}
        onDragEnter={ev=>Circle.onDragEnter(ev,this)}
        onDragLeave={ev=>Circle.onDragLeave(ev,this)}
      ></div>
    )
  }
}
