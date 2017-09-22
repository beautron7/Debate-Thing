import React, { Component } from 'react';
import Hash from 'object-hash'
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import CardsFrame from './components/CardsFrame'
import Editor from './components/Editor'
import Tabbar from './components/Tabbar'
import Ribbon from './components/Ribbon'
import cache from './cache'
import './App.css';

window.appStorage = cache
window.hash = Hash
window.electron = window.electron||window.nodeRequire('electron');

// var CARDS = [{
//   url:'www.vox.com',
//   image:'./img/vox.com.png',
//   author:'Klien 14',
//   title:'Panasonic',
//   keywords:['One','Two'],
// },{
//   url:'www.google.com',
//   image:'',
//   author:'Klien 14',
//   title:'Panasonic',
//   keywords:['One','Five'],
// }]



class App extends Component {
  constructor(a,b,c){
    if (window.App)
      throw new Error('App may only be instanciated once')
    super(a,b,c)

    this.Ribbon = {show:true}
    this.Tabbar = {paneNumber:0}
    this.leftBar = {toggleVis:()=>(0),show:true}
    this.rightBar = {toggleVis:()=>(0),show:true}
    this.cardFrame= {}

    window.App = this
    // this.updateGUI()
  }

  shrinkTopMargin() {//getter
    var self = window.App
    return typeof self.Tabbar==='undefined'? true:self.Tabbar.showRibbon
  }

  updateGUI(){
    console.log("GUI UPDATE IS DEPRICATED");
    var self = window.App
    self.rightBar.forceUpdate()
    self.leftBar.forceUpdate()
    self.Tabbar.forceUpdate()
    self.Ribbon.forceUpdate()
    self.editor.forceUpdate()
    self.Body.updateHeight()
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
        <App.Body
          ref={x=>this.Body=x}
        />
      </div>
    );
  }
}

App.Body = class Body extends Component {
  updateHeight(){
    this.dom.style.top= window.App.Ribbon.show? "7.8em":'1.8em'
  }

  render() {
    var appBodyStyle={
      top: window.App.Ribbon.show? '7.8em':'1.8em',
      bottom: '0em',
    }

    return (
      <div
        className="app-body"
        style={appBodyStyle}
        ref={x=>this.dom=x}
      >
        <Sidebar left
          ref={self => window.App.leftBar=self}
          shrinkTopMargin={window.App.shrinkTopMargin}
        >
          <Searchbar
            title="Find Section"
            id="docsearch"
          />
        </Sidebar>

        <Editor
          ref={self => window.App.editor=self}
        />

        <Sidebar right
          ref={self => window.App.rightBar=self}
          shrinkTopMargin={window.App.shrinkTopMargin}
        >
          <Searchbar title="Search Cards" id="cardsSearch"/>
          <CardsFrame
            ref={self => window.App.cardFrame = self}
          />
        </Sidebar>
      </div>
    )
  }
}

export default App;
