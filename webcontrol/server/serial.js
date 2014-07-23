var SerialPort,
	serial = null,
	port = '/dev/tty.usbmodemfa131';

send = function (bitmap) {
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
	    SerialPort = Meteor.require('serialport').SerialPort;
	      
	    console.log("Connecting...");
	    serial = new SerialPort(port, {
	      baudrate: 9600
	    });

	    serial.on("open", Meteor.bindEnvironment(onOpen));
	}
});

