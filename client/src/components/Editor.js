import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Editor.css'
import './scrollbar.css'
import {Tree, SectionNode} from './Tree.js'
import Section from './Section.js'

export default class Editor extends Component {
  static propTypes = {
    shrinkLeftMargin:PropTypes.bool,
    shrinkRightMargin:PropTypes.bool,
  }

  constructor(props){
    super(props);
  if(Editor.instance){
      throw new Error("Editor can only be instanciated onece.")
    } else {
      Editor.instance = this;
      var tree =new Tree("Title")
      tree._root=new SectionNode("Title");
      this.state={data:tree};
    }
  }

  render(){
    return (
      <div id="editor" className="scrollbar">
        <Section
          path={[]}
          tree={this.state.data._root}
        />
      </div>
    )
  }
}
