import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import CardsFrame from './components/CardsFrame'
import Editor from './components/Editor'
import Tabbar from './components/Tabbar'
import Ribbon from './components/Ribbon'
import './App.css';

window.electron = window.electron||window.nodeRequire('electron');


var CARDS = [{
  url:'www.vox.com',
  image:'./img/vox.com.png',
  author:'Klien 14',
  title:'Panasonic',
  keywords:['One','Two'],
},{
  url:'www.google.com',
  image:'',
  author:'Klien 14',
  title:'Panasonic',
  keywords:['One','Five'],
}]

class App extends Component {
  constructor(a,b,c){
    if (window.App)
      throw new Error('App may only be instanciated once')
    super(a,b,c)

    this.Ribbon = {show:true}
    this.Tabbar = {paneNumber:0}
    this.leftBar = {toggleVis:()=>(0),show:true}
    this.rightBar = {toggleVis:()=>(0),show:true}
    window.App = this
    // this.updateGUI()
  }

  shrinkTopMargin() {//getter
    var self = window.App
    return typeof self.Tabbar==='undefined'? true:self.Tabbar.showRibbon
  }

  updateGUI(){
    console.log("GUI UPDATE");
    var self = window.App
    self.rightBar.forceUpdate()
    self.leftBar.forceUpdate()
    self.Tabbar.forceUpdate()
    self.Ribbon.forceUpdate()
    self.editor.forceUpdate()
    // self.forceUpdate()
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
        <Sidebar left
          ref={self => this.leftBar=self}
          shrinkTopMargin={this.shrinkTopMargin}
        >
          <Searchbar title="Find Section" id="docsearch"/>
        </Sidebar>

        <Editor
          ref={self => this.editor=self}
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
