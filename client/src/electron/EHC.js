const app = require("electron").app
module.exports.run=()=>{
  //This code forces the app to only have one isntance
    var shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
      createAnEditorWindow()
    });

    if (shouldQuit) {
      app.quit();
    }


  //This makes console.error show text in red
    const colors = require('colors'); colors.enabled = true;
    console.error = function (...args) {
      for (var i = 0; i < args.length; i++) {
        if (typeof args[i] === "string"){
          args[i]=args[i].underline.bold.red
        }
      }
      console.log(...args)
    }


  //This is some logic code used in window management
    Array.prototype.remove = function(i) {
      if (typeof i === "number"){
        this.splice(index,1)
      } else {
        this.splice(this.indexOf(i),1)
      }
      return this;
    }
}
