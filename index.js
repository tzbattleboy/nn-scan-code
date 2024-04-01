// var Client = require('electron-ssh2').Client;
// var conn = new Client();
// conn.on('ready', function() {
//   console.log('Client :: ready');
//   conn.shell(function(err, stream) {
//     if (err) throw err;
//     stream.on('close', function() {
//       console.log('Stream :: close');
//       conn.end();
//     }).on('data', function(data) {
//       console.log('OUTPUT: ' + data);
//     });
//     stream.end('ls -l\nexit\n');
//   });
// }).connect({
//   host: '192.168.100.100',
//   port: 22,
//   username: 'frylock'
// });


const { readFileSync } = require('fs');

const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('uptime', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '192.168.100.100',
  port: 22,
  username: 'frylock',
  privateKey: readFileSync('/path/to/my/key')
});

// example output:
// Client :: ready
// STDOUT:  17:41:15 up 22 days, 18:09,  1 user,  load average: 0.00, 0.01, 0.05
//
// Stream :: exit :: code: 0, signal: undefined
// Stream :: close
