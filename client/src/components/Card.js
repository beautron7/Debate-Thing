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
      // cardHeadFormatingBar
      this.forceUpdate()
    } else {
      this.mode="view"
      this.dom.children[0].children[2].style.height="0"
      this.forceUpdate()
    }
  }

  formatText(style,altStyle){
    if(this.blocking){return}
    this.blocking=true
    var
      postLastSpan,
      preFirstSpan;

    var {baseNode, focusNode, baseOffset, focusOffset} = window.getSelection()
    //SUBROUTINE: CHECK IF SELECTION IS VALID
      if(~[baseNode, focusNode, baseOffset, focusOffset].map(isNull).indexOf(true)) {
        console.log("Cant select because null")
        return false
      }

      if(~[baseNode,focusNode].map((x) => {
        while(x = x.parentElement){
          if(x==this.cardBodyDom){
            return true
          }
        }
        return false
      }).indexOf(false)){
        console.log("Cant select because one of the selections is outside of the card")
        return false
      }

      //if selectionend is at begining, move back 1 node
    //END SUBROUTINE

    //SUBROUTINE ADD ANCHOR_START AND ANCHOR_END
      var headAnchor = document.createElement("label");
      var tailAnchor = document.createElement("label");
      this.cardBodyDom.insertAdjacentElement('afterbegin', headAnchor);
      this.cardBodyDom.insertAdjacentElement('beforeend', tailAnchor);
    //end SUBROUTINE

    //SUBROUTINE CORRECT DOM ERRORS
      var [baseSpan,focusSpan]=[baseNode,focusNode].map((x) => {
        if(x.constructor == Text){
          return x.parentNode;
        } else {
          return x;
        }
      });
      [baseNode,focusNode] = [baseSpan,focusSpan].map(x => {
        return x.childNodes[0]
      })
      var [baseNodeIndex,focusNodeIndex] = [baseNode,focusNode].map(getIndex);


    //END SUBROUTINE

    //SUBROUTINE ASSIGN FIRST AND LAST NODE VALUES
      var selection_is_backwards = (baseNodeIndex == focusNodeIndex)?
        focusOffset < baseOffset:
        focusNodeIndex < baseNodeIndex
      var baseGroup =  [baseNode,  baseNodeIndex,  baseOffset,  baseSpan];
      var focusGroup = [focusNode, focusNodeIndex, focusOffset, focusSpan];
      var [
        firstNode, firstNodeIndex,  firstOffset, firstSpan,
        lastNode, lastNodeIndex, lastOffset, lastSpan
      ] =
        selection_is_backwards?
          [
            ...focusGroup,
            ...baseGroup,
          ]:[
            ...baseGroup,
            ...focusGroup,
          ];
    //END SUBROUTINE

    //SUBROUTINE SPLIT LAST AND FIRST TEXT
      lastNode.splitText( lastOffset );
      postLastSpan = lastSpan.cloneNode(true);
      postLastSpan.childNodes[0].remove();
      postLastSpan = lastSpan.insertAdjacentElement("afterend",postLastSpan);
      lastSpan.childNodes[1].remove();

      firstNode .splitText( firstOffset );
      preFirstSpan = firstSpan.cloneNode(true);
      preFirstSpan.childNodes[1].remove();
      preFirstSpan = firstSpan.insertAdjacentElement("beforebegin",preFirstSpan);
      firstSpan.childNodes[0].remove();
    //END SUBROUITNE

    //SUBROUTINE CHECK FOR FIRST NON-FORMATTED DOM ELEMENT
      var currentChild = firstSpan
      var text_already_formated = true

      while(currentChild != lastSpan) {
        if(!styleEqual(currentChild.style,style)){
          text_already_formated=false
          break
        }
        currentChild = currentChild.nextSibling
      }
    //END SUBROUTINE

    //SUBROUTINE FORMAT TEXT
      if(text_already_formated && altStyle !== false) {
        currentChild = firstSpan
        while(currentChild != postLastSpan){
          for (var prop in style) {
            currentChild.style[prop]=altStyle[prop]
          }
          currentChild = currentChild.nextSibling
        }
      } else {
        while(currentChild !== postLastSpan){
          for (var prop in style) {
            currentChild.style[prop]=style[prop]
          }
          currentChild = currentChild.nextSibling
        }
      }
    //END SUBROUTINE

    //SUBROUTINE MERGE SIMILAR TEXT
      currentChild = preFirstSpan
      while(currentChild !== postLastSpan) {
        if(currentChild.classList == currentChild.nextSibling.classList){
          //take the
          currentChild.appendChild(currentChild.nextSibling.childNodes[0])
          currentChild.normalize()
          var breakafterthis = currentChild.nextSibling == postLastSpan
          currentChild.nextSibling.remove()
          if (breakafterthis){break}
        }
        currentChild = currentChild.nextSibling
      }
    //END SUBROUTINE

    //SUBROUTINE CLEANING UP EMPTY ELEMENTS
      [firstSpan,firstNode,lastSpan,lastNode,preFirstSpan,postLastSpan].forEach(x=>
        x.textContent.length || x.remove()
      )
      this.blocking = false;
      headAnchor.remove()
      tailAnchor.remove()
    //END SUBROUTINE

    function isNull(x){
      return (
        x === null ||
        x === undefined ||
        typeof x === "undefined" ||
        typeof x === "null"
      )
    }

    function styleEqual(style1,style2) {
      var styles = [
        "fontSize",
        "backgroundColor",
        "fontWeight",
        "fontStyle",
        "textDecoration",
        "textTransform"
      ]
      var result = styles.map(x=>{
        console.log(style1);
        return style1[x]==style2[x]
      });
      var index =result.indexOf(false);
      console.log(result,style1[index]==style2[index],result[index])
      return  !~index
    }

    function getIndex(el){
      var parent = el
      var child;
      while (parent.constructor !== HTMLDivElement){
        child = parent
        parent = parent.parentNode
      }
      return  Array.prototype.indexOf.call(parent.children, child)
    }
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

    this.generateTextDom()
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
      str+= this.data.text[i]+"¶\n"
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
              onClick={scope => this.formatText({fontWeight:"bold"},{fontWeight:"normal"})}
            />
            <RibbonButton
              icon={<i className="fa fa-italic fa-2x"></i>}
              size="lg"
              onClick={scope => this.formatText({fontStyle:"italic"},{fontStyle:"normal"})}
            />
            <RibbonButton
              title="Emphasis"
              size="lg"
              onClick={scope => this.formatText({
                fontWeight:"bold",
                fontStyle:"normal",
                textDecoration:"underline",
              },false)}
            />
            <RibbonButton
              icon={<i className="fa fa-underline fa-2x"></i>}
              size="lg"
              onClick={scope => this.formatText({
                textDecoration:"underline",
                fontWeight:"normal",
                fontStyle:"normal",
              },false)}
            />
            <RibbonButton
              title="Clear Formatting"
              size="lg"
              onClick={scope => this.formatText({
                textDecoration:"normal",
                fontWeight:"normal",
                fontStyle:"normal",
              },false)}
            />
          </div>
        </div>
        <div className="cardBody" ref={self => this.cardBodyDom = self}>
          {this.textDOM}
        </div>
      </div>
    )
  }
}
