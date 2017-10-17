import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './CardPreview.css';
import Async from './Async'

export default class CardPreview extends Component {
  static propTypes = {
    url:PropTypes.string.isRequired,
    img: PropTypes.string,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  static TextPane = class TextPane extends Component {
    loadText() {
      window.appStorage.getCard(this.props.cardID,this.props.collectionID,false).then(this.resolve).catch(this.reject)
    }

    render() {
      this.prom = new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject})

      return <div ref={this.props._ref} className="text-pane">
        <div className="tri"></div>
        <div onMouseOver={scope => this.loadText()} className="fake-body">
          <div className="pre-load">
            Hover here to load text
          </div>
          <div className="post-load">
            <Async
              promise={this.prom}
              success={(data)=><div>{data.text.map(x=><p>{x}</p>)}</div>}
            >
              <div>Loading...</div>
            </Async> 
          </div>
        </div>
      </div>
    }
  }

  onDragStart(ev) {
    ev.dataTransfer.setData(
      "text/plain",
      "cardRef:" + JSON.stringify({
        cardID: this.props.ID,
        collectionID: this.props.collectionID,
      })
    )
  }

  render(){
    const keywordNodes = this.props.keywords ? this.props.keywords.map(
      (keyword,index) =>
        <span
          key={index}
          className="keyword"
          draggable="false"
        >
          {keyword}
        </span>
      ):null

    return (
      <div 
        className="card-preview"
        onDragStart={event => this.onDragStart(event)} 
        draggable="true"
        ref={x=>this.dom=x}
      >
        <img src={this.props.img} draggable="false" alt="" />
        <div className="author" draggable="false"><span>{this.props.author}</span></div>
        <div className="title" draggable="false"><span>{this.props.title}</span></div>
        <div className="keywordContainer" draggable="false">{keywordNodes}</div>
        <CardPreview.TextPane
          _ref={x=>this.txtPN=x}
          collectionID={this.props.collectionID}
          cardID={this.props.ID}
        />
      </div>
    )
  }
}

CardPreview.placeholer = <CardPreview/>