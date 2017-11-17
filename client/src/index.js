import React from 'react';
import ReactDOM from 'react-dom';
import Hash from 'object-hash'
import Cache from './cache'
import './index.css';
import './css/shadows.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import App from './App';
import Modal from './components/Modal'
import registerServiceWorker from './registerServiceWorker';
import IPC from './ipc/RenderIpc.js';
window.IPC = IPC;
window.appStorage = Cache
window.hash = Hash
window.modal=Modal
window.electron = window.electron||window.nodeRequire('electron');

Object.defineProperty(window,"qi",{
  get:()=>(window.hash([new Date(),Math.random()]))
})

ReactDOM.render(
  <App />
  ,document.getElementsByClassName('viewport')[0]
);

window.nodeRequire("electron").remote.getCurrentWindow().maximize()
registerServiceWorker();
