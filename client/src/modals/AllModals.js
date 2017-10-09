var modals = ["newCard"]
var modules = [];
for (var i = 0; i < modals.length; i++) {
  modules[modals[i]] = require("./"+modals[i]).default
}

export default modules
