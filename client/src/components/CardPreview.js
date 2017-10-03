import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './CardPreview.css';

export default class CardPreview extends Component {
  static propTypes = {
    url:PropTypes.string.isRequired,
    img: PropTypes.string,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  render(){
    const {
      img,
      author,
      title,
      keywords,
      // url,
    } = this.props;

    const keywordNodes = keywords? keywords.map(
      (keyword,index) =>
        <span
          key={index}
          className="keyword"
          draggable="false"
        >
          {keyword}
        </span>
      ):null

    var onDragStart=(ev)=> {
      ev.dataTransfer.setData(
        "text/plain",
        "cardRef:"+JSON.stringify({
          cardID: this.props.ID,
          collectionID: this.props.collectionID,
        })
      )
    }

    return (
      <div className="card-preview" draggable="true" onDragStart={onDragStart}>
        <img src={img} draggable="false" alt="" />
        <div className="author" draggable="false"><span>{author}</span></div>
        <div className="title" draggable="false"><span>{title}</span></div>
        <div className="keywordContainer" draggable="false">{keywordNodes}</div>
      </div>
    )
  }
}
