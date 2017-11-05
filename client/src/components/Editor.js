import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Editor.css'
import './scrollbar.css'
import {Tree, SectionNode} from './Tree.js'
import Section from './Section.js'
import Navbar from './Navbar'

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
      Navbar.instance.setState({tree:tree})
    }
  }

  render(){
    return (
      <div 
        id="editor"
        className="scrollbar"
        ref={self=>{
          this.dom=self;
        }}
        >
        <Section
          path={[]}
          tree={this.state.data._root}
          ref={x=> this.primarySectionDom=x.dom}
        />
      </div>
    )
  }
  componentDidMount(){
    this.dom.onscroll=this.handleScroll.bind(this)
  }

  handleScroll(ev){
    var scrollPos = ev.target.scrollTop;
    this.state.data._root.nav.dom
      .querySelectorAll(".active")
      .forEach(el => el.classList.remove("active"));
    traverse(this.state.data._root)
    
    function traverse(node){
      for (var i = 0; i < node.children.length; i++) {
        var section_dom = node.children[i].react.dom
        var nav_dom = node.children[i].nav.dom

        var dist_to_top = section_dom.offsetTop;
        var height_of_el = section_dom.offsetHeight
        
        if(scrollPos < dist_to_top + height_of_el){
          var has_children = node.children[i].children && node.children[i].children.length
          if(has_children){
            traverse(node.children[i]);
          } else {
            // this.state.visible_section = node
            if(
              Navbar &&
              Navbar.instance &&
              Navbar.instance.Breadcrumb &&
              Navbar.instance.Breadcrumb.state
            )
              Navbar.instance.Breadcrumb.setState({activeNode:node});
          }
          nav_dom.classList.add("active")
          break;
        }
      }
    }
  }
}
