import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Editor.css'
import './scrollbar.css'
import Section from './Section.js'

export default class Editor extends Component {
  static propTypes = {
    shrinkLeftMargin:PropTypes.bool,
    shrinkRightMargin:PropTypes.bool,
  }
  static traverse(array) {
    array.key=array.key? array.key:Math.random()
    if (Array.isArray(array)){
      for(var i = 1; i < array.length; i++){
        Editor.traverse(array[i])
      }
    }
  }
  constructor(a,b,c){
    super(a,b,c)
    this.data = [
      "1AC Space",
      // {
      //   title:"Grab'em",
      //   author:"Trump",
      //   text:"Grab'em.",
      // },
      [
        "Contention 1",
        {
          title:"Fraking",
          author:"Rajan",
          text:"yolo",
        },
        {
          title:"Fraking",
          author:"Rajan",
          text:"yolo",
        },
      ],
      [
        "Contention 2",
        {
          title:"What Nuclear War?",
          author:"Jackson",
          text:"hi",
        },
        {
          title:"No",
          author:"Yes",
          text:"meh",
        },
      ],
    ]
  }

  render(){
    //DEBUG fn


    Editor.traverse(this.data)
    //END DEBUG FN
    var style={
      top: window.App.Ribbon.show? '7.8em':'1.8em',
      left: window.App.leftBar.show? '23%':'0',
      right: window.App.rightBar.show? '23%':'0',
      bottom: '0em',
    }
    return (
      <div id="editor" className="scrollbar" style={style}>
        <Section
          ref={self=>this.primarySection=self}
          path={[]}
          data={this.data}
        />
      </div>
    )
  }
}
