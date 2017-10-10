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
              var data = window.App.editor.data;
              for (var i = 0; i < this.props.path.length; i++) {//stop before the final point so splicing can occour.
                var index = this.props.path[i]
                data = data[index]
              }
              data[0]=self.textContent
            }, false)
          }
        }}
      >
      </span></div>,
      <Circle key={0} path={path.concat(1)} />
    ]

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
              />
          }
          <Circle
            path={path.concat(...[i+2])}
          />
        </div>
      ))
    )

    return (
      <div draggable="false" className="section" onDragStart={_onDragStart}>
        {content}
        <div className="terminator" ></div>
      </div>
    )
  }
}
