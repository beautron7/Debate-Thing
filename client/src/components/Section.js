import React, {Component} from 'react';
import './Editor.css'
import Card from './Card.js'
import Circle from './Circle.js'
import PropTypes from 'prop-types'

export default class Section extends Component {
  // static propTypes ={
  //   data: PropTypes.array.isRequired,
  //   path: PropTypes.arrayOf(PropTypes.number)
  // }
  // createSubSection(after){
  //   this.data.splice(after+1,0,["Sub Section"])
  //   this.forceUpdate()
  // }

  constructor(props){
    super(props);
    if(props.path.length == 0){
      Section.Root=this
    }
  }
  
  shouldComponentUpdate(newProps){
    console.log("AHAHHHAHA")
    if(
      newProps.data.length !== this.props.data.length ||
      this.props.path+"" !== newProps.path+""
      //^ place a section at the start of the doc. now add a card before it. needs to update.
    ){
      return true;
    }
    return false;
  }

  render(){
    const {
      path,
      data,
    }=this.props

    var _onDragStart=(ev)=> {
      this.enableCircles=false
      // this.forceUpdate()
      // ev.prevenev.dataTransfer.dropEffect = "move"tDefault()
      ev.dataTransfer.setData(
        "text/plain",
        "secPath:"+JSON.stringify(this.props.path)
      )
    }
    // this.keyvals = this.keyvals? this.keyvals:[0,1]

    var [first, ...rest] = data
    this.children = []

    var content = [
      <div key={-1}><span
        className="heading"
        contentEditable="plaintext-only"
        ref={self=>{
          // for path
          this.children.push(self)
          if (self !== null && self !== undefined){
            self.textContent = first
            self.addEventListener("input",()=>{
              this.props.data[0]=self.textContent
            }, false)
          }
        }}
      >
      </span></div>,  
      <Circle key={0} path={path.concat(1)} />,
    ];

    rest.forEach((x,i)=> {
      x.key = x.key || Math.random();

      if(Array.isArray(x)){
        content.push(
          <Section
            key={x.key}
            path={path.concat(...[i+1])}
            ref={self=>this.children[i+1]=self}
            data={x}
          />
        )
      } else {
        content.push(          
          <Card
            key={x.key}
            path={path.concat(...[i+1])}
            ref={self=>this.children[i+1]=self}
          />
        )
      }

      content.push(
        <Circle
          key={"circle"+x.key}
          path={path.concat(...[i+2])}
        />
      )
    })

    return (
      <div draggable="false" className="section" onDragStart={_onDragStart}>
        {content}
        <div className="terminator" ></div>
      </div>
    )
  }
}
