//Odds and ends
Array.prototype.remove = function(i) {
  if (typeof i === "number"){
    this.splice(index,1)
  } else {
    this.splice(this.indexOf(i),1)
  }
  return this;
}

console.error = function (...args) {
  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] === "string"){
      args[i]=args[i].underline.bold.red
    }
  }
  console.log(...args)
}
//End odds and ends

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const colors = require('colors')
const appStorage = require("./Storage.js").default
colors.enabled = true
appStorage.init()

const windows = []

function createAnImporterWindow(){
  const theWindow = new BrowserWindow({width: 800, height: 600, frame: true})
  windows.push(theWindow)

  const startUrl = process.env.ELECTRON_START_URL+'/DBimporter.index.html' || url.format({
    pathname: path.join(__dirname, '/../build/DBimporter.index.html'),
    protocol: 'file:',
    slashes: true
  });

  theWindow.loadURL(startUrl);

  theWindow.on('closed', function () {
    windows.remove(theWindow)
    delete theWindow
  })

  theWindow.on('maximize', function () {
    theWindow.webContents.send('Window-State','maximized')
  })

  theWindow.on('unmaximize', function () {
    theWindow.webContents.send('Window-State','unmaximized')
  })
}

function createAnEditorWindow () {
  createAnImporterWindow()
  const theWindow = new BrowserWindow({width: 800, height: 600, frame: false})
  windows.push(theWindow)

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  theWindow.loadURL(startUrl);

  theWindow.on('closed', function () {
    windows.remove(theWindow)
    delete theWindow
  })

  theWindow.on('maximize', function () {
    theWindow.webContents.send('Window-State','maximized')
  })

  theWindow.on('unmaximize', function () {
    theWindow.webContents.send('Window-State','unmaximized')
  })
}

app.on('ready', createAnEditorWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (windows.length === 0) {
    createAnEditorWindow()
  }
})
