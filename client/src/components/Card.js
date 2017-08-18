import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Card.css'
import './slideOpen.css'

export default class Card extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,

    text: PropTypes.arrayOf(PropTypes.string),

    formatting: PropTypes.object, //formatting example:
    /*
    {
      styles:[
        "b12",//bold,12pt font. font numbers come at end
        "ic12"//italic, cyan highlithing. 12 pt font.
      ]
      text:[
        [10,1], //means chars 0-10 have style 1
        [100,0], //means chars 10-110 have style 0
      ]
    }
    */

    year: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number,
    url: PropTypes.string,
  }

  render(){
    const {
      author,
      year
    } = this.props.data

    setTimeout(() => {
      this.dom.style.maxHeight="100em"
    },10)

    return (
      <div ref={x=>this.dom=x} className="card animate-height">
        <div className="cardHead">
          <div className="cardHeadUpper">
            Tag Placeholder
          </div>
          <div className="cardHeadLower">
            <div className="cardAuthor">
              {author} {year}
            </div>
            <div className="cardButtons btn-group">
              <button className="btn btn-sm btn-primary">Quals</button>
              <button className="btn btn-sm btn-primary">Source</button>
              <button className="btn btn-sm btn-primary">Edit</button>
            </div>
          </div>
        </div>
        <div className="cardBody">
          <div> {/*Paragraph*/}
            <span>123</span>
            <span>456</span>{/*Text things*/}
          </div>
        </div>
      </div>
    )
  }
}
