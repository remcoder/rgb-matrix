var serialPort = Meteor.require('serialport'),
  serial = null;

this.send = function (bitmap) {
  console.log('sending', bitmap)
  var bytes = bitmap.map(function(binaryString) {
    return parseInt(binaryString,2);
  });
  bytes.push(0x0a);
  return serial.write(new Buffer(bytes));
};

function onOpen () {
  // console.log('open');

  // give Arduino some time to send a greeting
  Meteor.setTimeout(function() {
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
  }, 2000);

  var input = "";
  serial.on('data', function(data) {
    input += data.toString().split('\n')[0];
    if (data.toString().indexOf('\n') > -1) {
      console.log(':' + input);
      input = data.toString().split('\n')[1];
    }
  });
}

Meteor.methods({
	'connect' : function() {
	    

	    console.log("Connecting...");
	    serial = new SerialPort(port, {
	      baudrate: 115200
	    });

	    serial.on("open", Meteor.bindEnvironment(onOpen));
	}
});

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
    baudrate: 9600
  });

  serial.on("open", Meteor.bindEnvironment(onOpen));
  serial.on("error", function(err, res) {
    console.error(err,res);
  });
}