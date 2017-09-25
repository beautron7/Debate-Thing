import React, {Component} from 'react';
import './Card.css'
import './slideOpen.css'
import TinyMCE from 'react-tinymce'
import TinyMCEinit from './TinyMCEinit'
import RibbonButton from './RibbonButton'
import Frame from 'react-frame-component'
//moved stuff to paragraph component

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
    const {baseNode, focusNode, baseOffset, focusOffset} = window.getSelection()
    if (baseNode === focusNode){
      console.log("The selection is a single element, so the program will subdivide the")
      //var start = min(baseOffset,focusNode)
      //var end = max(baseOffset,focusNode)
      //take the tet from 0 to start
      //take the text from start to end and postpend it with the class
      //take the text from start to end and postpone it with the same class as the begiing
    } else {
      console.log("The selection spans multiple elements, so the program will split each half")
      if(baseNode.parentNode !== focusNode.parentNode){return false}

      var [baseNodeIndex,focusNodeIndex] = [baseNode,focusNode].map(child =>
        Array.prototype.indexOf.call(baseNode.parentNode.children, child)
      );

      var selection_is_backwards = baseNodeIndex < focusNodeIndex
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
      //now, postpend a new span to the firstNode,
      //split the text at the firstIndex,
      //style the second span,
      //run through the spans in between and merge when applicable,
      //prepend a new span to the lastnode and do the styles
    }
    console.log(window.getSelection());
  }

  constructor(a,b,c){
    super(a,b,c);
    this.mode="view"

    this.data = window.App.editor.data
    for (var i = 0; i < this.props.path.length; i++) {//stop before the final point so splicing can occour.
      var index = this.props.path[i]
      this.data = this.data[index]
    }
    this.tag=this.data.title
  }

  render(){
    var year
    var {
      author,
      datePublished,
      tag
    } = this.data


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
      this.dom.style.maxHeight="1000em" //well, 100em sounds large but not for debate standards.
    })

    var editBar = 3.141
    this.textDOM = this.data.text.map((x,i)=>(<p key={i/*Ok because paragraph order is constant*/}>{x}</p>))

    return(
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
              <button onClick={scope => this.toggleMode()} className="btn btn-sm btn-primary">{this.mode=="view"? "Edit":"View"}</button>
            </div>
          </div>
          <div className="cardHeadFormatingBar">
            <RibbonButton
              icon={<i className="fa fa-bold fa-2x" />}
              size="lg"
              onClick={this.formatText}
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
