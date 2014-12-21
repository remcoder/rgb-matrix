var serialPort = Meteor.npmRequire('serialport'),
  serial = null,
  _baudrate = 19200,
  onConnect = null,
  status = 'unintialized';

var onReady = Meteor.bindEnvironment(function() {
  status = 'ready';
  if (onConnect)
    onConnect();
});

function onListDevices (err, ports) {
  if (err) {
    console.error(err);
    return;
  }

  // TODO: handle multiple Arduinos connected simultaneously
  var arduinoPort = ports.filter(function(p) {
    return p.manufacturer.indexOf('Arduino') > -1;
  })[0];

  if (arduinoPort) {
    var arduino = Arduinos.findOne(arduinoPort.comName);

    if (!arduino) {
      console.log('Arduino detected on port: ', arduinoPort.comName);
      Arduinos.insert({
        _id : arduinoPort.comName,
        port: arduinoPort,
        baudrate : _baudrate
      });

      connect(arduinoPort.comName);
    }
  }
  else {
    if (Arduinos.find({}).count() > 0) {
      console.log('Arduino disconnected');
      Arduinos.remove({});
    }
  }
}

function detectArduino() {
  serialPort.list(Meteor.bindEnvironment(onListDevices));
}

function connect(port) {
  console.log("Connecting @ " + _baudrate + 'bps')
  status = 'connecting';
  serial = new serialPort.SerialPort(port, {
    baudrate: _baudrate,
    parser: serialPort.parsers.readline('\n')
  });

  serial.on("error", function(err, res) {
    status = 'ERROR: ' + err;
    console.error(err,res);
  });
  serial.on("open", function() {
    status = 'waiting for data';
  });
  serial.on('data', function(data) {
    // console.log('receiving data');
    status = 'receiving data';

    console.log('> '+ data);
    if (data.indexOf('ready.') > -1)
      onReady();
  });
}

function start(opts) {
  opts = opts || {};
  status = 'scanning for devices'
  if (opts.baudrate)
    _baudrate = opts.baudrate;
  Arduinos.remove({});
  Meteor.setInterval(detectArduino, 1000);

  if (opts.onConnect) {
    if (typeof opts.onConnect != 'function')
      throw new Error('onConnect should be a function');
    onConnect = opts.onConnect;
  }
}

function sendCommand(opcode, bytes) {
  if (! opcode)
    throw new Error('missing opcode');

  if ( !Opcode.exists(opcode) )
    throw new Error('illegal opcode');

  // TODO: check # of bytes

  // if(bytes)
  //         console.log('sending:', opcode.toUpperCase(), bytes)
  // else
  //     console.log('sending:', opcode.toUpperCase())


  bytes = bytes ? bytes.slice() : [];
  bytes.unshift(Opcodes[opcode.toLowerCase()]);
  serial.write(new Buffer(bytes));
}

/*

EXPORTS

*/

this.colorDuino = {
  start : start,
  sendCommand : sendCommand
};

Meteor.methods(this.colorDuino);
