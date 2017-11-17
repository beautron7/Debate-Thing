const electron                       = require('electron')
const {app, BrowserWindow}           = electron
const path                           = require('path')
const url                            = require('url')
const colors                         = require('colors'); colors.enabled = true;
const oldStorage                     = require("./Storage.js").default; oldStorage.init();
const newStorage                     = require("./StorageMain.js")
const MainIpc                        = new (require("./ipc/MainIpc.js").default)();

//Odds and ends
  // Array.prototype.remove = function(i) {
  //   if (typeof i === "number"){
  //     this.splice(index,1)
  //   } else {
  //     this.splice(this.indexOf(i),1)
  //   }
  //   return this;
  // }

  console.error = function (...args) {
    for (var i = 0; i < args.length; i++) {
      if (typeof args[i] === "string"){
        args[i]=args[i].underline.bold.red
      }
    }
    console.log(...args)
  }
//End odds and ends



MainIpc.register("usrSettings",new newStorage.ConfigFile({
  path:"./cfg/usrSettings.json",
  writeInterval: 1000,
  construct_sync: true,
}))

const windows = []
const mac = process.platform === "darwin"

var shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  createAnEditorWindow()
});

if (shouldQuit) {
  app.quit();
}

function createAnEditorWindow () {
  const theWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: mac
  })
  windows.push(theWindow)

  const startUrl =  process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  // react devtools:
  // BrowserWindow.addDevToolsExtension(
  //   'C:\\Users\\Beautron7\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\2.5.2_0'
  // );

  theWindow.loadURL(startUrl);

  theWindow.on('closed', function () {
    windows.remove(theWindow)
    delete theWindow
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
    app.quit() //Yeah, OSX normally keeps it open, but I havent found anyone who finds that usefu
})

app.on('activate', function () {
  if (windows.length === 0) {
    createAnEditorWindow()
  }
})
