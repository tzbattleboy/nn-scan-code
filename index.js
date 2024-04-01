window.initSSH = (ip) => {
  console.log('initSSH ', ip);
  let Client = require('electron-ssh2').Client;
  sshConn = new Client();
  sshConn.on('ready', function () {
    sshConn.shell(function (err, stream) {
      sshStream = stream;
      console.log('err', err);
      if (err) throw err;
      stream.on('close', function () {
        sshConn.end();
      }).on('data', function (data) {
        console.log('OUTPUT: ' + data);
      });
    });
  }).connect({
    host: ip,
    port: 22,
    username: 'root',
    password: 'secret'
  });
};
window.sshExec = (args, func) => {
  if (sshConn && sshStream) {
    if (args.command === 'exit\n') {
      console.log('Exit');
      try {
        sshStream.end(args.command);
      } catch (e) {
        console.log('Exit', e);
      }
    } else {
      sshStream.on('data', function (data) {
        if (func) {
          func(data.toString());
        }
      });
      sshStream.write(args.command);
    }
  }
};
