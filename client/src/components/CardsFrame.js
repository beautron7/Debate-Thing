import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CardPreview from './CardPreview'
import './scrollbar.css'
import './CardsFrame.css'

export default class CardsFrame extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(CardPreview.propTypes)).isRequired
  }

  render(){
    const {
      data
    }=this.props

    const cardCollection = data.map((card, index) =>
      (<CardPreview
        key={index}
        img={card.image}
        title={card.title}
        author={card.author}
        keywords={card.keywords}
        url={card.url}
      />)
    )
    return (
      <div className="cards-frame scrollbar">{cardCollection}</div>
    )
  }
}
