import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Card.css'
import './slideOpen.css'
import RibbonButton from './RibbonButton'
// import Frame from 'react-frame-component'
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
      ] = data.match(/^(?:\((\d+)\w*?\))?(?:<(.+?)>)?(?:\{(.*),(.*)\})?$/gm)

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
    if(this.state.mode === "view"){
      this.state.mode="edit"
      this.dom.children[0].children[2].style.height="2.75em"
      this.cardBodyDom.contentEditable = true;
    } else {
      this.state.mode="view"
      console.log([this.cardBodyDom.children[0]])
      this.dom.children[0].children[2].style.height="0"//the editbar
      this.cardBodyDom.contentEditable = false;
    }
  }

  static clearFormattingKeepHighlight(){
    document.execCommand("bold")
    document.execCommand("underline")
    document.execCommand("italic")
    if(document.queryCommandState("bold")){
      document.execCommand("bold")
    }
    if(document.queryCommandState("underline")){
      document.execCommand("underline")
    }
    if(document.queryCommandState("italic")){
      document.execCommand("italic")
    }
  }

  handleKey(event){
    var {key, ctrlKey} = event
    console.log("a key was pressed",key,event);

    var allowKey = (
      (
        !~["Delete","Backspace"].indexOf(key) //delete, backspace never ok.
      ) && (
        (
          ["Up","Right","Left","Down"]//allow arrow keys
            .map(x=>"Arrow"+x)
            .indexOf(key) !== -1
        ) || (
          ctrlKey && !~"xv".indexOf(key) //ctrl + anything but x
        ) || (
          ~["Home","End","PageUp","PageDown"].indexOf(key)
        )
      )
    )
    if(allowKey){return}

    if(key==="F9" || key === "F10" || key ==="F12"){//Apply stylesd
      Card.clearFormattingKeepHighlight()
      if(key == "F9" || key === "F10"){//Formatters that underline
        document.execCommand("underline")
      }
      if (key === "F10"){//formatters that bold
        document.execCommand("bold")
      }
      return
    } else if (key === "F11") {
      event.preventDefault()
      Card.highlight()
    }

    event.preventDefault()
    if(key === "Enter"){//mark the card
      var prev_mark = this.cardBodyDom.querySelector('.card-marker')
      prev_mark && prev_mark.remove()
      var sel, range;
      sel = window.getSelection();
      range = sel.getRangeAt(0);
      var el = document.createElement("div")
      range.insertNode(el);
      el.classList.add("card-marker")
      el.textContent=""
    }
  }

  static getFormattingFromComputedStyle(dom){
    var sty = window.getComputedStyle(dom);
    return {
      hilight: sty.backgroundColor != "rgba(0, 0, 0, 0)",
      bold: sty.fontWeight == "bold",
      ital: sty.fontStyle == "italic",
      underline: ~sty.textDecoration.indexOf("underline"),
    }
  }

  getFormatting(){
    var root = this.cardBodyDom
    var progress = []


    function traverse(obj) {
      if(obj.childNodes.length){
        obj.childNodes.forEach(traverse)
      } else {
        progress.push({
          length:obj.textContent.length,
          sty: Card.getFormattingFromComputedStyle(obj.parentNode)
        })
      }
    }

    root.childNodes.forEach(traverse)

    console.log(progress)
  }

  constructor(a,b,c){
    super(a,b,c);
    this.state={};
    this.state.mode="view"
    this.hideLinebreaks=false;
    this.state.data = window.App.editor.state.data
    for (var i = 0; i < this.props.path.length; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i]
      this.state.data = this.state.data[index]
    }
    this.tag=this.state.data.title || "(No Title / Tag)"
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
      year = pad(new Date(this.state.data.datePublished).getFullYear()%100,2)
      if (year+"" === "NaN"){
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
    for (var i = 0; i < this.state.data.text.length; i++) {
      str+= this.state.data.text[i]+"¶ \n"
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

  static highlight(){
    if (document.queryCommandValue("backColor") =="rgb(0, 255, 255)"){
      document.execCommand("backColor",true,"rgba(0,0,0,0)")
    } else {
      document.execCommand("backColor",false,"cyan")
    }
  }

  render(){

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
              {this.state.data.author} {this.formattedYear}
            </div>
            <div className="cardButtons btn-group">
              <button className="btn btn-sm btn-primary">Quals</button>
              <button className="btn btn-sm btn-primary">Source</button>
              <button
                onClick={scope => this.toggleMode()}
                className="btn btn-sm btn-primary"
              >
                {this.state.mode==="view"? "Edit":"View"}
              </button>
            </div>
          </div>
          <div className="cardHeadFormatingBar">
            <RibbonButton
              icon="?"
              size="lg"
              onClick={this.getFormatting.bind(this)}
            />
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
                Card.clearFormattingKeepHighlight();
                document.execCommand("underline");
              }}
            />
            <RibbonButton
              title="Emphasis"
              size="lg"
              onClick={scope => {
                Card.clearFormattingKeepHighlight();
                document.execCommand("underline");
                document.execCommand("bold")
              }}
            />
            <RibbonButton
              size="lg"
              icon={<i className="glyphicon glyphicon-text-size"></i>}
            />
            <RibbonButton
              icon={<img style={{filter:"brightness(0)"}} alt="hilite" src="img/hilite.ico"></img>}
              size="lg"
              onClick={scope=>Card.highlight()}
            />
            <RibbonButton
              icon={<i className="glyphicon glyphicon-erase"></i>}
              tooltip="Clear Formatting"
              size="lg"
              onClick={scope => {
                Card.clearFormattingKeepHighlight();
              }}
            />
            <RibbonButton
              icon={<span>¶</span>}
              tooltip="Toggle condensed text mode"
              size="lg"
              onClick={scope => {
                this.togglePilcrows();
              }}
            />
          </div>
        </div>
        <div
          className="cardBody"
          onPaste={x=>x.preventDefault()}
          onCut={x=>x.preventDefault()}
          onDrop={x=>x.preventDefault()}
          contentEditable={true}
          ref={self => this.cardBodyDom = self}
        >
        </div>
      </div>
    )
  }
  componentDidMount(){
    ReactDOM.render(this.textDOM,this.cardBodyDom)
    this.cardBodyDom.addEventListener("keypress",scope=>this.handleKey(scope))
    this.cardBodyDom.addEventListener("keydown",scope=>this.handleKey(scope))
  }
}
