import React, {Component} from 'react';
import './CardPreview.css';

export default class CardPreview extends Component {
  static TextPane = class TextPane extends Component {
    constructor(props){
      super(props)
      this.state={data:["loading"]}
    }

    unloadText(){
      this.setState({data:["loading"]})
    }

    loadText() {
      window.appStorage.getCard(
        this.props.cardID,
        this.props.collectionID,
        false
      )
        .then(x=> this.setState({data:x.text}))
        .catch(this.setState({}));
    }

    render() {
      this.prom = new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject})

      return <div ref={this.props._ref} className="text-pane">
        <div className="tri"></div>
        <div 
          onMouseEnter={scope => this.loadText()}
          onMouseLeave={scope => this.unloadText()}
          className="fake-body">
          <div className="pre-load">
            Hover here to load text
          </div>
          <div className="post-load">
            {this.state.data.map((x,i)=>(<p key={i}>{x}</p>))}
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