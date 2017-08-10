import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cardStyle from './CardPreview.css.js';


export default class CardPreview extends Component {
  static propTypes = {
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
    } = this.props;

    const keywordNodes = keywords? keywords.map((keyword,index) => <span key={index} className="keyword" style={cardStyle.keyword} draggable="false">{keyword}</span>):null

    return (
      <div style={cardStyle.root} draggable="true">
        <img style={cardStyle.img} src={img} draggable="false" alt="" />
        <div style={cardStyle.author} draggable="false">{author}</div>
        <div style={cardStyle.title} draggable="false">{title}</div>
        <div style={cardStyle.keywordContainer} draggable="false">{keywordNodes}</div>
      </div>
    )
  }
}
