import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Modal from './components/Modal'

ReactDOM.render(
  <Modal.Dropdown
    items={["Item 1","Item 2","Item 3"]}
  >
    Hello!  
  </Modal.Dropdown>
,
document.getElementsByClassName('viewport')[0]);

registerServiceWorker();
