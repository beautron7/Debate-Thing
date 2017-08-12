import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import CardsFrame from './components/CardsFrame'
import Editor from './components/Editor'
import Tabbar from './components/Tabbar'

import './App.css';
const ELECTRON = window.nodeRequire('electron');

var CARDS = [{
  image:'./img/vox.com.png',
  author:'Klien 14',
  title:'Panasonic',
  keywords:['One','Two'],
},{
  image:'',
  author:'Klien 14',
  title:'Panasonic',
  keywords:['One','Five'],
}]



class App extends Component {
  constructor(){
    if (App.instance)
      throw new Error('App may only be instanciated once')
    super(arguments)
    this.showNav=true
    this.showCard=true

    App.instance = this
  }

  shrinkTopMargin() {
    var self = this? this:App.instance;
    return typeof self.Tabbar==='undefined'? true:self.Tabbar.showRibbon
  }

  shrinkRightMargin() {
    var self = this? this:App.instance;
  }

  updateGUI(){
    var self = this? this:App.instance
    self.rightBar.forceUpdate()
    self.leftBar.forceUpdate()
    self.Tabbar.forceUpdate()
    // self.forceUpdate()
  }

  render() {
    return (
      <div className="App">
        <Tabbar
          ref={self => this.Tabbar=self}
          updateGUI={this.updateGUI}
          
        />
        <Sidebar left
          ref={self => this.leftBar=self}
          shrinkTopMargin={App.instance.shrinkTopMargin}
        >
          <Searchbar title="Find Section" onChange={console.log} id="docsearch"/>
          {/*<NavFrame />*/}
        </Sidebar>

        <Editor
          shrinkTopMargin={this.shrinkTopMargin}
        />

        <Sidebar right
          ref={self => this.rightBar=self}
          shrinkTopMargin={this.shrinkTopMargin}
        >
          <Searchbar title="Search Cards" id="cardsSearch"/>
          <CardsFrame data={CARDS} />
        </Sidebar>
      </div>
    );
  }
}

export default App;
