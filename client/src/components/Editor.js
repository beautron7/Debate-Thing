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

  constructor(a,b,c){
    super(a,b,c)
    this.data = [
      "1AC Space",
      {
        title:"Grab'em",
        author:"Trump",
        text:"Grab'em by the pussy.",
      },
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
    ]
  }
function
  render(){
    var style={
      top: window.App.Ribbon.show? '7.8em':'1.8em',
      left: window.App.leftBar.show? '23%':'0',
      right: window.App.rightBar.show? '23%':'0',
      bottom: '0em',
    }
    return (
      <div id="editor" className="scrollbar" style={style}>
        <Section path ={[Infinity]} data={this.data}/>
      </div>
    )
  }
}
