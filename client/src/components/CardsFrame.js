import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import CardPreview from './CardPreview'
import './scrollbar.css'
import './CardsFrame.css'

export default class CardsFrame extends Component {
  constructor(a,b,c){
    super(a,b,c)
    this.data = []
    window.appStorage.getRecentCards(10).then((simpleData)=>{
      this.newData(simpleData,0)
    })
  }

  newData(simpleData,delay){
    console.log(simpleData)
    delay = delay | 0
    /* Delay is here to stop queries from being fired on every single word.
     * if newData is called less than (delay) secs milliseconds after
     * a previous newData call, then the old newData call is canceled.
     */
    clearTimeout(this.dataPID);
    this.dataPID = setTimeout(()=>{
      var promises = []
      for (var i = 0; i < simpleData.length; i++) {
        if(simpleData[i].ID){
          promises[i] = window.appStorage.getCard(
            simpleData[i].ID,
            simpleData[i].collectionID,
            true //Just metadata
          );
        }
      }
      Promise.all(promises)
        .then((cards)=>{
          console.log(cards)
          this.data=cards
          this.forceUpdate()
        },delay)
    })
  }

  render(){
    var data = this.data

    if(data.length === 0){
      return (
        <div>Loading...</div>
      )
    }

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    const cardCollection = data.map((card, index) =>
      (<CardPreview
        ID={card.ID}
        key={card.ID}
        img={card.image}
        title={card.title || "(No title)"}
        author={
          (
            card.author ||
            "(No author)"
          ) + " " + pad (
            (
              (new Date(card.datePublished))
                .getFullYear() % 100
            ),
            2
          )
        }
        keywords={card.keywords}
        url={card.url}
      />)
    );

    return (
      <div className="cards-frame scrollbar">{cardCollection}</div>
    )
  }
}
