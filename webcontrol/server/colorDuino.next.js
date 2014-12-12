var serialPort = Meteor.npmRequire('serialport'),
  serial = null,
  _baudrate = 9600,
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
  var arduinoPort = ports.filter(p => p.manufacturer.indexOf('Arduino') > -1)[0];

  if (arduinoPort) {
    var arduino = Arduinos.findOne(arduinoPort.comName);

    if (!arduino) {
      console.log('Arduino detected on port: ', arduinoPort.comName);
      Arduinos.insert({
        _id : arduinoPort.comName,
        port: arduinoPort
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
  console.log("Connecting...")
  status = 'connecting';
  serial = new serialPort.SerialPort(port, {
    baudrate: _baudrate
  });

  var input = "";
  serial.on("error", function(err, res) {
    console.error(err,res);
  });
  serial.on("open", function() {
    console.log('waiting for data');
    status = 'waiting for data';
  });
  serial.on('data', function(data) {
    // console.log('receiving data');
    status = 'receiving data';
    var s = data.toString();

    input += s.split('\n')[0];
    if (s.indexOf('\n') > -1) {
      console.log('> ' + input);
      if (input.indexOf('ready.') > -1)
        onReady();
      input = s.split('\n')[1];
    }
  });
}

function start(opts={}) {
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

    if(bytes)
            console.log('sending:', opcode.toUpperCase(), bytes)
    else
        console.log('sending:', opcode.toUpperCase())


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
