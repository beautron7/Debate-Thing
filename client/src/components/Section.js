import React, {Component} from 'react';
import './Editor.css'
import Card from './Card.js'
import Circle from './Circle.js'
import {CardPoint,SectionNode} from './Tree.js'
const Aux =p=> p.children;


export default class Section extends Component {

  constructor(props){
    super(props);
    if(props.path.length === 0){
      Section.Root=this
    }
  }
  
  shouldComponentUpdate(newProps){
    console.log("AHAHHHAHA")
    return (
      newProps.tree.children.length !== this.props.tree.children.length ||
      this.props.path+"" !== newProps.path+""
    )
  }

  onDragStart(ev){
    ev.dataTransfer.setData(
      "text/plain",
      "secPath:"+JSON.stringify(this.props.path)
    )
  }

  render(){
    const {
      path,
      tree,
    }=this.props
    this.children = [];
    
    tree.react = this;

    var title = tree.data
    var child_nodes = tree.children;

    return (
      <div draggable="false" className="section" onDragStart={this.onDragStart.bind(this)}>
        <div key={-1}>
          <span
            className="heading"
            contentEditable="plaintext-only"
            ref={self=>{
              this.children.push(self)
              if (self !== null && self !== undefined){
                self.textContent = title
                self.addEventListener("input",()=>{
                  tree.data=self.textContent
                }, false)
              }
            }}
          />
        </div>
        <Circle key={0} tree={tree} path={0} />
        {child_nodes.map((x,i) => (
          <Aux key={x.key}>
            {
              ((x,i) => {
                if(x instanceof SectionNode){
                  return (
                    <Section
                      path={i+1}
                      tree={x}
                      />
                  )
                } else if (x instanceof CardPoint){
                  return (
                    <Card
                      tree={x}
                      />
                  )
                }
              })(x,i)
            }
            <Circle
              tree={tree}
              path={i+1}
              />
          </Aux>
        ))}
        <div className="terminator"></div>
      </div>
    )
  }
}
