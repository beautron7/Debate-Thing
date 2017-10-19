import React, {Component} from 'react';
// import PropTypes from 'prop-types';

import CardPreview from './CardPreview'
import './scrollbar.css'
import './CardsFrame.css'
import Async from './Async.js'

export default class CardsFrame extends Component {
  constructor(a,b,c){
    super(a,b,c)
    this.data = []
    window.appStorage.getRecentCards(10).then((cardRefs)=>{
      this.updateData(cardRefs,0)
    })
  }

  updateData(simpleData,delay){
    delay = delay | 500
    /* Delay is here to stop queries from being fired on every single word.
     * if updateData is called less than (delay) secs milliseconds after
     * a previous updateData call, then the old updateData call is canceled.
     */
    clearTimeout(this.dataPID);
    this.dataPID = setTimeout(()=>{
      this.data = []
      for (var i = 0; i < simpleData.length; i++) {
        if(simpleData[i].ID){
          this.data[i] = window.appStorage.getCard(
            simpleData[i].ID,
            simpleData[i].collectionID,
            true //Just metadata
          );
        }
      }
      this.forceUpdate();
      
    },delay)
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

    function authorString(card){
      return (
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

    const cardCollection = data.map((promised_card, index) =>
      (
        <Async
          key={"Async"+index}
          promise={promised_card}
          resolved={card=>(
            <CardPreview
              collectionID={card.collectionID}
              ID={card.ID}
              key={card.ID}
              img={card.image}
              title={card.title || "(No title)"}
              author={authorString(card)}
              keywords={card.keywords}
              url={card.url}
            />
          )}
          rejected={(data)=><div>ERROR: {data}</div>}
        >
          <CardPreview key={"Placeholder"+index} placeholder/>
        </Async>
      )
    );

    return (
      <div className="cards-frame scrollbar">{cardCollection}</div>
    )
  }
}
