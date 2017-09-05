const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const exec = require('child_process').exec;
            var app = exec('npm run electron');
            // var app = spawn('npm', ['run', 'electron']);

            app.stdout.on('data', function (data) {
              console.log(data.toString());
            });

            app.on('exit', function (code) {
              console.log('electron exited with code ' + code.toString());
            });
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});
