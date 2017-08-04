import React, { Component } from 'react';
import Sidebar from './components/Sidebar'
import './App.css';
const ELECTRON = window.require('electron');


class App extends Component {
  render() {
    return (
      <div className="App">
        <Ribbon>
          <Tabs />
          <CommandBar />
        </Ribbon>

        <Sidebar float="left">
          <Searchbar id="docsearch"/>
          <NavFrame />
        </Sidebar>

        <Editor />

        <Sidebar float="right">
          <Searchbar id="docsearch"/>
          <CardsFrame />
        </Sidebar>
      </div>
    );
  }
}

export default App;
