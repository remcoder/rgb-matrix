var serialPort = Meteor.require('serialport'),
  serial = null;

this.send = function (bitmap) {
  if (!serial) return;
  // console.log('sending', bitmap) 
  var bytes = bitmap.map(function(binaryString) {
    return parseInt(binaryString,2);
  });
  bytes.push(0x0a);
  return serial.write(new Buffer(bytes));
};

var onReady = Meteor.bindEnvironment(function() {
      console.log('init matrix')
      Matrix.update('42', { $set: 
        { status: 'connected',
          bitmap : [ '00011000',
                     '00111100',
                     '01111110',
                     '11011011',
                     '11111111',
                     '00100100',
                     '01011010',
                     '00100100'] } 
      });
  });

function onOpen () {
  var input = "";
  serial.on('data', function(data) {
    // console.log(data.toString());
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

function onListDevices (err, ports) {
  if (err) {
    console.error(err);
    return;
  }

  // console.log(ports);
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

this.detectArduino = function detectArduino() {
  serialPort.list(Meteor.bindEnvironment(onListDevices));
}

function connect(port) {
  console.log("Connecting...");
  serial = new serialPort.SerialPort(port, {
    baudrate: 19200
  });

  serial.on("open", Meteor.bindEnvironment(onOpen));
  serial.on("error", function(err, res) {
    console.error(err,res);
  });
}
