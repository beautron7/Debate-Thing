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

  constructor(data){
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

  formatText(action){
    //bold,italic,highlight,underline
    var currentChild;
    var {baseNode, focusNode, baseOffset, focusOffset} = window.getSelection()

    console.log(window.getSelection())

    if(//nothing selected
      [baseNode,focusNode,baseOffset,focusOffset]
        .map(x=>
          x === null ||
          x === undefined ||
          typeof x === "undefined" ||
          typeof x === "null"
        )
        .indexOf(true) !== -1
    ) {return}


    var [baseNodeIndex,focusNodeIndex] = [baseNode,focusNode].map(parent => {//pass thu a child and climb up till you get to the parent
      var child;
      while (parent.constructor !== HTMLDivElement){
        child = parent
        parent = parent.parentNode
      }
      return  Array.prototype.indexOf.call(parent.children, child)
    });

    var selection_is_backwards = baseNodeIndex > focusNodeIndex
    var baseGroup = [baseNode,baseNodeIndex, baseOffset];
    var focusGroup = [focusNode, focusNodeIndex, focusOffset]
    var [
      firstNode, firstNodeIndex,  firstOffset,
      lastNode, lastNodeIndex, lastOffset
    ] =
      selection_is_backwards?
        [
          ...focusGroup,
          ...baseGroup,
        ]:[
          ...baseGroup,
          ...focusGroup,
        ]
    console.log("foobarbbb",lastNode,firstNode)
    //split off last node
    var [firstSpan,lastSpan]=[firstNode.parentNode,lastNode.parentNode]

    lastNode.splitText( lastOffset )
    var postLastSpan = lastSpan.cloneNode(true)
    postLastSpan.childNodes[0].remove()
    postLastSpan = lastSpan.insertAdjacentElement("afterend",postLastSpan)
    lastSpan.childNodes[1].remove()

    firstNode .splitText( firstOffset )
    var preFirstSpan = firstSpan.cloneNode(true)
    preFirstSpan.childNodes[1].remove()
    preFirstSpan = firstSpan.insertAdjacentElement("beforebegin",preFirstSpan)
    firstSpan.childNodes[0].remove()

    //see if anyhting is not (bold/ital), and if everything is bold/ital, then we toggle it instead

    currentChild = FirstSpan
    var text_already___ed = true
    while(currentChild != lastSpan) {
      if(!currentChild.classList.contains(action)){
        text_already___ed = false
        break
      }
      currentChild = currentChild.nextSibling
    }

    // currentChild is now the first non (bold/ital/etc)ed text 
    while(currentChild !== postLastSpan){
      currentChild.classList.add(action)
      currentChild = currentChild.nextSibling
    }

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

    //split off the first node

    // this.generateTextDom()
    //now, we iterate from [lastNodeIndex --> firstNodeIndex and do the style]
    //now, we iterate from [lastNodeIndex+1 -> firstNodeIndex and check for i and i-1 to see if they can be merged]
    //this.forceUpdate()
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
      str+= this.data.text[i]+"¶"
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
              onClick={scope => this.formatText("bold")}
            />
            <RibbonButton
              icon={<i className="fa fa-italic fa-2x"></i>}
              size="lg"
            />
            <RibbonButton
              icon={<i className="fa fa-underline fa-2x"></i>}
              size="lg"
            />
          </div>
        </div>
        <div className="cardBody">
          {this.textDOM}
        </div>
      </div>
    )
  }
}
