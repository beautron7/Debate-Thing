import React, {Component} from 'react';
import './Card.css'
import './slideOpen.css'
import TinyMCE from 'react-tinymce'
import TinyMCEinit from './TinyMCEinit'
import RibbonButton from './RibbonButton'
import Frame from 'react-frame-component'
//moved stuff to paragraph component

class Style {
  toJSON(){
    return ""
      + this.fontSize || ""
      + this.textSettings || ""
      + this.backgroundColor || this.textColor?
        ("{"
          + (this.backgroundColor || "")
          + (",")
          + (this.textColor || "") +
        "}"):""
  }

  toStyleObj(){
    return false //to be implemented
  }

  constructor(data){
    if (typeof data === "string"){
      var [
        fontSize,
        textSettings,
        backgroundColor,
        textColor,
      ] = data.match(/^(?:\((\d+)\w*?\))?(?:\<(.+?)\>)?(?:\{(.*),(.*)\})?$/gm)

      this.fontSize = fontSize;
      this.textSettings = textSettings;
      this.backgroundColor = backgroundColor;
      this.textColor = textColor;
    } else {
      //now we make it from a style object
    }
  }
}

export default class Card extends Component {
  toggleMode(){
    if(this.mode == "view"){
      this.mode="edit"
      this.dom.children[0].children[2].style.height="2.75em"
      this.cardBodyDom.contentEditable = true;
      this.cardBodyDom.addEventListener("keypress",this.handleKey)
      this.forceUpdate()
    } else {
      this.mode="view"
      this.dom.children[0].children[2].style.height="0"
      this.cardBodyDom.contentEditable = false;
      this.cardBodyDom.removeEventListener("keypress",this.handleKey)
      this.forceUpdate()
    }
  }

  handleKey(event){
    console.log("a key was pressed",event.key);
  }

  constructor(a,b,c){
    super(a,b,c);
    this.mode="view"
    this.hideLinebreaks=false;

    this.data = window.App.editor.data
    for (var i = 0; i < this.props.path.length; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i]
      this.data = this.data[index]
    }
    this.tag=this.data.title
    this.condensed = false

    this.generateTextDom()
  }

  togglePilcrows(){
    this.condensed = !this.condensed
    this.cardBodyDom.style.whiteSpace = this.condensed? "normal":"pre-wrap"
  }

  get formattedYear(){
    var year = "[No Date]"
    try { //date
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
      year = pad(new Date(this.data.datePublished).getFullYear()%100,2)
      if (year == "NaN"){
        throw new Error()
      }
    } catch (e) {
      year = "[No Date]"
    }
    return year
  }

  animate_open(){
    setTimeout(() => {//Animation
      if(this.dom !== null)
      this.dom.style.maxHeight="1000em" //well, 100em sounds large but not for debate standards.
    })
  }

  generateTextDom(){
    var str = ""
    for (var i = 0; i < this.data.text.length; i++) {
      str+= this.data.text[i]+"¶ \n"
    }
    this.textDOM = <span>{str}</span>
  }

  tagListener(x){
    if (x !== null && x !== undefined){
      x.textContent=this.tag
      x.addEventListener("input",()=>{
        this.tag=x.textContent
      }, false)
    }
  }

  render(){
    var editBar;

    this.animate_open()

    return(
      <div draggable="false" ref={x=>this.dom=x} className="card animate-max-height">
        <div className="cardHead">
          <div
            ref={scope => this.tagListener(scope)}
            contentEditable="plaintext-only" className="cardHeadUpper">
          </div>
          <div className="cardHeadLower">
            <div className="cardAuthor">
              {this.data.author} {this.formattedYear}
            </div>
            <div className="cardButtons btn-group">
              <button className="btn btn-sm btn-primary">Quals</button>
              <button className="btn btn-sm btn-primary">Source</button>
              <button
                onClick={scope => this.toggleMode()}
                className="btn btn-sm btn-primary"
              >
                {this.mode=="view"? "Edit":"View"}
              </button>
            </div>
          </div>
          <div className="cardHeadFormatingBar">
            <RibbonButton
              icon={<i className="fa fa-bold fa-2x" />}
              size="lg"
              onClick={scope => document.execCommand("bold")}
            />
            <RibbonButton
              icon={<i className="fa fa-italic fa-2x"></i>}
              size="lg"
              onClick={scope => document.execCommand("italic")}
            />
            <RibbonButton
              icon={<i className="fa fa-underline fa-2x"></i>}
              size="lg"
              onClick={scope => {
                document.execCommand("underline")
              }}
            />
            <RibbonButton
              title="Underline"
              size="lg"
              onClick={scope => {
                document.execCommand("removeFormat");
                document.execCommand("underline")
              }}
            />
            <RibbonButton
              title="Emphasis"
              size="lg"
              onClick={scope => {
                document.execCommand("removeFormat");
                document.execCommand("underline");
                document.execCommand("bold")
              }}
            />
            <RibbonButton
              title="Highlight"
              size="lg"
              onClick={scope => {
                var {toString,baseOffset,focusOffset} = document.getSelection()
                var selID = window.hash([toString,baseOffset,focusOffset]);
                if(selID == this.selID){
                  document.execCommand("hiliteColor",true,"white")
                  this.selID=""
                  return
                }
                document.execCommand("hiliteColor",false,"cyan")

                toString=null;
                baseOffset=null;
                focusOffset=null;
                var {toString,baseOffset,focusOffset} = document.getSelection()
                selID = window.hash([toString,baseOffset,focusOffset]);
                this.selID=selID
              }}
            />
            <RibbonButton
              title="Clear Formatting"
              size="lg"
              onClick={scope => {
                document.execCommand("removeFormat");
              }}
            />
            <RibbonButton
              icon="¶"
              size="lg"
              onClick={scope => {
                this.togglePilcrows();
              }}
            />
          </div>
        </div>
        <div className="cardBody" contentEditable={true} ref={self => this.cardBodyDom = self}>
          {this.textDOM}
        </div>
      </div>
    )
  }
}
