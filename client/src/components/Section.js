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

  constructor(a,b,c){
    super(a,b,c)
    console.log(a,b,c);
  }

  render(){

    var [first, ...rest] = this.props.data

    var content = [<div key={0}>
      <span
        path={[this.path].concat(0)}
        className="heading">{first}</span>
      <Circle />
    </div>]

    content.push(
      ...rest.map((x,i)=> (
        <div key={(i+1)}>
          {
            Array.isArray(x)?
              <Section
                path={[this.path].concat([i+1])}
                data={x}/>
              :<Card
                path={[this.path].concat([i+1])}
                data={x}
              />
          }
          <Circle
            path={[this.path].concat([i+1])}
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
