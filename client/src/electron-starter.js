const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const colors = require('colors')
const appStorage = require("./Storage.js").default
colors.enabled = true


console.error = function (...args) {
  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] === "string"){
      args[i]=args[i].underline.bold.red
    }
  }
  console.log(...args)
}

let mainWindow
appStorage.init()


function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600, frame: false})

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('maximize', function () {
    mainWindow.webContents.send('Window-State','maximized')
  })
  mainWindow.on('unmaximize', function () {
    mainWindow.webContents.send('Window-State','unmaximized')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
