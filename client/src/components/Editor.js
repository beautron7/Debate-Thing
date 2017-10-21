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
    console.log("Handing out keys to all the children");
    array.key=array.key? array.key:Math.random()
    if (Array.isArray(array)){
      for(var i = 1; i < array.length; i++){
        Editor.traverse(array[i])
      }
    }
  }
  constructor(a,b,c){
    super(a,b,c)
    this.state={data:["Title"]};
  }

  render(){
    //DEBUG fn


    Editor.traverse(this.state.data)
    //END DEBUG FN
    // var style={
    //   top: window.App.Ribbon.show? '7.8em':'1.8em',
    //   left: window.App.leftBar.show? '23%':'0',
    //   right: window.App.rightBar.show? '23%':'0',
    //   bottom: '0em',
    // }
    return (
      <div id="editor" className="scrollbar">
        <Section
          ref={self=>this.primarySection=self}
          path={[]}
          data={this.state.data}
        />
      </div>
    )
  }
}
