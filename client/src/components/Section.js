import React, {Component} from 'react';
import './Editor.css'
import Card from './Card.js'
import Circle from './Circle.js'
import PropTypes from 'prop-types'

export default class Section extends Component {
  static propTypes ={
    data: PropTypes.array.isRequired,
    path: PropTypes.arrayOf(PropTypes.number)
  }
  // createSubSection(after){
  //   this.data.splice(after+1,0,["Sub Section"])
  //   this.forceUpdate()
  // }

  // constructor(a,b,c){
  //   super(a,b,c)
  //   console.log(a,b,c);
  // }

  render(){
    const {
      path,
      data,
    }=this.props

    var _onDragStart=(ev)=> {
      this.enableCircles=false
      this.forceUpdate()
      // ev.prevenev.dataTransfer.dropEffect = "move"tDefault()
      ev.dataTransfer.setData(
        "text/plain",
        "secPath:"+JSON.stringify(this.props.path)
      )
      console.log(
        "DragStart",
        "Section",
        JSON.stringify(this.props.path),
      );
    }
    // this.keyvals = this.keyvals? this.keyvals:[0,1]


    var [first, ...rest] = data
    this.children = []

    var content = [<div key={0}>
      <span
        className="heading"
        contentEditable="true"
        ref={self=>{
          // for path
          this.children.push(self)
          // if (self !== null && self !== undefined){
          //   self.textContent=
          //   self.addEventListener("input",()=>{
          //     this.tag=self.textContent
          //   }, false)
          // }
        }}
      >
        {first}
      </span>
      <Circle path={path.concat(1)} />
    </div>]

    content.push(
      ...rest.map((x,i)=> (
        <div key={x.key?x.key:(()=>{x.key=Math.random(); return x.key})()}>
          {
            Array.isArray(x)?
              <Section
                path={path.concat(...[i+1])}
                ref={self=>this.children[i+1]=self}
                data={x}/>
              :<Card
                path={path.concat(...[i+1])}
                ref={self=>this.children[i+1]=self}
                data={x}
              />
          }
          <Circle
            path={path.concat(...[i+2])}
          />
        <div className="terminator" ></div>
        </div>
      ))
    )

    return (
      <div draggable="false" className="section" onDragStart={_onDragStart}>
        {content}
      </div>
    )
  }
}
