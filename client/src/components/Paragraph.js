import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Paragraph.css'

export default class Paragraph extends Component {
  static propTypes = {
    text:PropTypes.string.isRequired,
  }

  constructor(a,b,c){
    super(a,b,c)
    this.text = this.props.text
    this.dom = -1;
    this.spans = []
  }

  autoMergeSpans(){
    /** @method autoMergeSpans
     *  Iterates through this.spans and automatically merges adjacent spans with similar formatting.
     */
  }

  recomputeStyleNumbers(){
    /** @method recomputeStyleNumbers
    * iterates through this.spans
    */
  }

  render(){
    return (
      <div>
        {
          new Proxy(this.spans,{get:(spans,i)=>(spans[i].dom)})
        }
      </div>
    )
  }
}


class Paragraph{
  constructor(txt){
    this.text = txt;
    this.dom =
  }

  constructor(arr_of_strings){
    //window.getSelection()
    //                     .anchornode //the starting node
    //                     .anchoroffset // the distance from the start of the element
    //                     .focusnode   // the ending node
    //                     .focusoffset // the ending foffset from left
    // see
    //"https://stackoverflow.com/questions/27241281/what-is-anchornode-basenode-extentnode-and-focusnode-in-the-object-returned"
    //for more
    this.paragraphs = []

    this.text = arr_of_strings//Array of strings
    this.spans=[]//2d array because one paragraph has multiple spans
    this.paragraphs=[]// 1d array of react elements (divs) containing spans

    this.convertedStyles=[""]//css thigns, temporary fiat

    for (var i = 0; i < this.text.length; i++) {//go thru an array of strings
      this.spans[i]=[];//2d array, first key is the paragraphs, 2nd is the individual spans
      this.spans[i][0]={};
      this.spans[i][0].text = this.text[i];//the text of a span
      this.spans[i][0].style = 0;//integer refering to styleID

      for (var j = 0; j < this.spans.length; j++) {
        this.spans[i][j]=(
          <span
            style={this.convertedStyles[this.spans[i][j].style]}
            class={"cardInstance-"+this.props.data.key+"-"+j}
          >
          </span>
        )
      }

      this.paragraphs[i]=(
        <p
          key={this.props.data.key}
        >{
          {this.DOMSCHEME[i]}
        }</p>
      )
    }
  }
}
