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

    // this.keyvals = this.keyvals? this.keyvals:[0,1]


    var [first, ...rest] = data
    this.children = []

    var content = [<div key={0}>
      <span className="heading" ref={self=>this.children.push(self)}>{first}</span>
      <Circle path={path.concat(1)} />
    </div>]

    content.push(
      ...rest.map((x,i)=> (
        <div key={x.key}>
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
        </div>
      ))
    )

    return (
      <div className="section">
        {content}
      </div>
    )
  }
}
