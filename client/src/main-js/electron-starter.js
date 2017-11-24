require('dotenv').config();
const electron                       = require('electron')
const {app, BrowserWindow}           = electron
const path                           = require('path')
const url                            = require('url')
const oldStorage                     = require("./Storage.js").default; oldStorage.init();
const newStorage                     = require("./StorageMain.js")
const MainIpc                        = new (require("./MainIpc.js").default)();
require("./EHC").run();

MainIpc.register("usrSettings",new newStorage.ConfigFile({
  path:"./cfg/usrSettings.json",
  writeInterval: 1000,
  construct_sync: true,
}))

const windows = []
const mac = process.platform === "darwin"
const startUrl =  process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true
});

function createAnEditorWindow () {
  const theWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: mac //show window border frame only on OSX
  })

  windows.push(theWindow)

  theWindow.loadURL(startUrl);

  theWindow.on('closed', function () {
    windows.remove(theWindow)
    delete theWindow;
  })

  if(!mac){
    theWindow.on('maximize', function () {
      theWindow.webContents.send('Window-State','maximized')
    })

    theWindow.on('unmaximize', function () {
      theWindow.webContents.send('Window-State','unmaximized')
    })
  }
}

app.on('ready', createAnEditorWindow)

app.on('window-all-closed', function () {
  app.quit()
    //Yeah, OSX normally keeps an app open when you close all of the windows,
    //but I havent found anyone who finds that usefull.
})

app.on('activate', function () {
  if (windows.length === 0) {
    createAnEditorWindow()
  }
})
