import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import CardsFrame from './components/CardsFrame'

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
  render() {
    return (
      <div className="App">
        {/*<Ribbon>
          <Tabs />
          <CommandBar />
        </Ribbon>*/}
        <Sidebar left>
          <Searchbar title="Find Section" id="docsearch"/>
          {/*<NavFrame />*/}
        </Sidebar>


        <Sidebar right>
          <Searchbar title="Search Cards" id="cardsSearch"/>
          <CardsFrame data={CARDS} />
        </Sidebar>
      </div>
    );
  }
}

export default App;
