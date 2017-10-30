import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Editor.css'
import './scrollbar.css'
import Section from './Section.js'


class Tree {
  static Node = class Node {
    constructor(data,parent){
      this.data = data;
      this.key = window.qi;
      this.parent = parent;
      this.children = [];
    }

    appendChild(data,index){
      console.log(this)
      // index |= this.children.length
      this.children.splice(
        index,
        0,
        new Node(
          data,
          this
        )
      );
    }
  }

  constructor(data){
    var node = new Tree.Node(data);
    this._root = node;
  }
}

class CardNode extends Tree.Node {
  constructor(data){
    super(data);
    delete this.children;
  }
};

class SectionNode extends Tree.Node {};

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
      window.App.editor=this;
      this.state={data:new Tree("Title")};
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
