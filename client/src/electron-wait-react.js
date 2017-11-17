const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();
let startedElectron = false;

const launchElectron =()=> {
  if(!startedElectron) {
    console.log('starting electron');
    startedElectron = true;
    const exec = require('child_process').exec;
    var app = exec('npm run electron-dev');
    // var app = spawn('npm', ['run', 'electron']);

    app.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    app.on('exit', function (code) {
      console.log('electron exited with code ' + code.toString());
      process.exit(0)
    });
  }
}

const tryConnection =()=> client.connect({port: port}, () => {
    client.end();
    launchElectron();
  }
);

tryConnection();

var failcount = 0,
    maxfails  = 5;

client.on('error', (error) => {
  if(failcount > maxfails){
    console.log("(Can't tell if system is offline or if react isnt ready).")
    launchElectron()
  } else {
    console.log(`Waiting for react... (${failcount}/${maxfails})`)
    failcount++;
    setTimeout(tryConnection, 1000);
  }
});
