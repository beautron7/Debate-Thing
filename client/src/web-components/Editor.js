import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../web-css/Editor.css'
import '../web-css/scrollbar.css'
import {Tree, SectionNode} from '../web-js/Tree.js'
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
      tree._root.isRoot=true;
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
    traverse(this.state.data._root,false)

    function traverse(node,dom_is_clean){
      for (var i = 0; i < node.children.length; i++) {
        var current_child_node          = node.children[i],
            section_dom                 = current_child_node.react.dom,
            nav_dom                     = current_child_node.nav.dom,
            top_to_top_vertical_offset  = section_dom.offsetTop,
            height_of_el                = section_dom.offsetHeight;

        if(scrollPos < top_to_top_vertical_offset + height_of_el){//OK LETS MARK IT AS ACTIVE!
          if(dom_is_clean){//aka is the current node clear of descendants that have.active
            nav_dom.classList.add("active")
          } else {
            if(!nav_dom.classList.contains("active") && !node.children.isRoot){//if the current node isn't active, a sibling may be, so we need to "clean" the dom of all active siblings.
              dom_is_clean=true;
              node.nav.dom
                .querySelectorAll(".active")
                .forEach(el => el.classList.remove("active"));
              nav_dom.classList.add("active")
            }
          }

          var has_children                   = current_child_node.children && current_child_node.children.length,
              is_first_child                 = i==0,
              is_partially_offscreen         = scrollPos > top_to_top_vertical_offset + 10;

          if(has_children && is_partially_offscreen){//Do we need to check children for activity?
            traverse(current_child_node,dom_is_clean);
          } else {
            nav_dom
              .querySelectorAll(".active")
              .forEach(el => el.classList.remove("active"))
            Navbar.instance.Breadcrumb.setState({activeNode:current_child_node});
          }
          break;
        }
      }
    }
  }
}
