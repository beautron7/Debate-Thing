import React, { Component } from 'react';
import Sidebar from './Sidebar'
import Searchbar from './Searchbar'
import CardsFrame from './CardsFrame'
import Editor from './Editor'
import Tabbar from './Tabbar'
import Ribbon from './Ribbon'
import Navbar from './Navbar'
import '../web-css/App.css';

export default class App extends Component {
  constructor(a,b,c){
    if (window.App)
      throw new Error('App may only be instanciated once');
    super(a,b,c);

    window.App = this;
  }

  updateGUI(){
    throw new Error("Hey, Fix ur code")
  }

  render() {
    return (
      <div className="App">
        <Tabbar
          ref={self => this.Tabbar=self}
          />
        <Ribbon
          ref={x=>this.Ribbon=x}
          />
        <div
          className="app-body"
          ref={x=>this.Body=x}
          >
          <Sidebar left
            ref={self => window.App.LeftBar=self}
            >
            <Searchbar
              title="Find Section"
              id="docsearch"
              />
            <Navbar
              ref={self => window.App.CardFrame = self}
              />
          </Sidebar>
          <Sidebar right
            ref={self => window.App.RightBar=self}
            >
            <Searchbar
              title="Search Cards"
              id="cardsSearch"
              />
            <CardsFrame
              ref={self => window.App.CardFrame = self}
              />
          </Sidebar>
          <Editor
            ref={self => window.App.Editor=self}
            />
        </div>
      </div>
    )
  }
}
