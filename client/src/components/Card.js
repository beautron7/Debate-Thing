import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Card.css'
import './slideOpen.css'
import TinyMCE from 'react-tinymce'
import TinyMCEinit from './TinyMCEinit'

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
    this.text = this.props.data.text
    var tmp_str = ""
    for (var i = 0; i < this.text.length; i++) {
      tmp_str+=this.text[i]+"<br>"
    }
    this.text=tmp_str
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
          {
            this.mode === "edit"?
            (
              <form ref={x=>this.MCEform=x}>
                <TinyMCE
                  name="cardTextEdit"
                  content={this.text}
                  config={TinyMCEinit}
                  onChange={e=>{
                    this.text=e.target.getContent()
                  }}
                >
                </TinyMCE>
                <button
                  type="submit"
                >
                  Submit
                </button>
              </form>
            ):(
              <div
                dangerouslySetInnerHTML={{__html:this.text/*May lead to xss*/}}
                style={{fontSize:"12"}}
              >
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
