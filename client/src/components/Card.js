import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Card.css'
import './slideOpen.css'
import TinyMCE from 'react-tinymce'
import TinyMCEinit from './TinyMCEinit'

//moved stuff to paragraph component

export default class Card extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    text: PropTypes.arrayOf(PropTypes.string),
  }

  toggleMode(){
    if(this.mode == "view"){
      this.mode="edit"
      this.forceUpdate()
    } else {
      var tmp = this.MCEform["cardTextEdit"].value;
      this.mode="view"
      this.forceUpdate()
    }
  }

  constructor(a,b,c){
    super(a,b,c);
    this.tag=this.props.data.title
    this.CTT = new CardTextTracker(this.props.data.text);
    this.mode="view"
  }

  render(){
    var self = this
    var year
    var {
      author,
      datePublished,
      tag
    } = this.props.data


    author = author? author:"(No author)"//Author
    try { //date
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
      year = pad(new Date(datePublished).getFullYear()%100,2)
      if (year == "NaN"){
        throw new Error()
      }
    } catch (e) {
      year = "[No Date]"
    }

    setTimeout(() => {//Animation
      if(this.dom !== null)
      this.dom.style.maxHeight="100em"
    })

    return (
      <div draggable="false" ref={x=>this.dom=x} className="card animate-max-height">
        <div className="cardHead">
          <div
            ref={
              (x)=> {
                if (x !== null && x !== undefined){
                  x.textContent=this.tag
                  x.addEventListener("input",()=>{
                    this.tag=x.textContent
                  }, false)
                }
              }
            }
            contentEditable="plaintext-only" className="cardHeadUpper">
          </div>
          <div className="cardHeadLower">
            <div className="cardAuthor">
              {author} {year}
            </div>
            <div className="cardButtons btn-group">
              <button className="btn btn-sm btn-primary">Quals</button>
              <button className="btn btn-sm btn-primary">Source</button>
              <button onClick={scope => this.toggleMode()} className="btn btn-sm btn-primary">Edit</button>
            </div>
          </div>
        </div>
        <div className="cardBody">
          {this.textDOM}
        </div>
      </div>
    )
  }
}
