import React, {Component} from 'react';
import './Editor.css'
import Card from './Card.js'
import Circle from './Circle.js'
import Tree from './Tree.js'

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
      newProps.data.length !== this.props.data.length ||
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
    console.log(tree)

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
                  this.props.data[0]=self.textContent
                }, false)
              }
            }}
          />
        </div>
        <Circle key={0} tree={tree} path={1} />
        {child_nodes.map((x,i) => ([
          ((x,i) => {
            if(x instanceof Tree.Node.SectionNode){
              return (
                <Section
                  key={x.key}
                  path={path.concat(...[i+1])}
                  tree={x}
                  />
              )
            } else if (x instanceof Tree.Node.CardNode){
              return (
                <Card
                  key={x.key}
                  tree={x}
                  ref={self=>this.children[i+1]=self}
                  />
              )
            }
          })(x,i)
          ,
          <Circle
            key={"circle"+x.key}
            tree={tree}
            path={path.concat(...[i+2])}
            />
        ]))}
        <div className="terminator"></div>
      </div>
    )
  }
}
