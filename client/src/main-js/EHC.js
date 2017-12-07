//ELECTRON HELPER CODE FILE
//This file defines self-described functions that would make the main.js file
//too long.
//None of these things should be critical to understangin the app

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

  //Array.findIndex polyfill
    if (!Array.prototype.findIndex) {
      Object.defineProperty(Array.prototype, 'findIndex', {
        value: function(predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0;

          // 3. If IsCallable(predicate) is false, throw a TypeError exception.
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }

          // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
          var thisArg = arguments[1];

          // 5. Let k be 0.
          var k = 0;

          // 6. Repeat, while k < len
          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return k.
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
              return k;
            }
            // e. Increase k by 1.
            k++;
          }

          // 7. Return -1.
          return -1;
        }
      });
    }
}
