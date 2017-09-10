import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Card.css'
import './slideOpen.css'
import TinyMCE from 'react-tinymce'

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
    } else {
      this.mode="view"
    }
  }

  constructor(a,b,c){
    super(a,b,c);
    this.tag=this.props.data.title
    this.text = this.props.data.text
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
        <TinyMCE
          content={this.text}
          config={{
            selector: ".tinymce",
            plugins: [
              'textcolor colorpicker',
            ],
            menu: {},
            toolbar1: 'undo redo | fontsizeselect | bold italic underline |  forecolor backcolor | removeformat',
            image_advtab: true,
            branding:false,
            height: 10,
            elementpath:false,
          }}
        >
        </TinyMCE>
      </div>
    )
  }
}
