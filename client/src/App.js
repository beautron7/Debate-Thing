import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import CardsFrame from './components/CardsFrame'
import Editor from './components/Editor'
import Tabbar from './components/Tabbar'
import Ribbon from './components/Ribbon'
import './App.css';

export default class App extends Component {
  constructor(a,b,c){
    if (window.App)
      throw new Error('App may only be instanciated once');
    super(a,b,c);

    this.Ribbon = {show:true};
    this.Tabbar = {paneNumber:0};
    this.leftBar = {toggleVis:()=>(0),show:true};
    this.rightBar = {toggleVis:()=>(0),show:true};
    this.cardFrame= {};
  
    window.App = this;
  }

  updateGUI(){
    console.log("GUI UPDATE IS DEPRICATED");
    var self = window.App
    self.rightBar.forceUpdate()
    self.leftBar.forceUpdate()
    self.Tabbar.forceUpdate()
    self.Ribbon.forceUpdate()
    self.editor.forceUpdate()
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
          ref={x=>this.dom=x}
          >
          <Sidebar left
            ref={self => window.App.leftBar=self}
            /* shrinkTopMargin={window.App.shrinkTopMargin} */
            >
            <Searchbar
              title="Find Section"
              id="docsearch"
              />
          </Sidebar>
          <Sidebar right
            ref={self => window.App.rightBar=self}
            /* shrinkTopMargin={window.App.shrinkTopMargin} */
            >
            <Searchbar
              title="Search Cards"
              id="cardsSearch"
              />
            <CardsFrame
              ref={self => window.App.cardFrame = self}
              />
          </Sidebar>
          <Editor
            ref={self => window.App.editor=self}
            />
        </div>
      </div>
    )
  }
}
