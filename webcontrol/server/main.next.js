var self = this;
Meteor.startup(function () {
	console.log('*** RGBMatrix ***');
	Matrix.remove({});
	Matrix.insert({
		_id : '42',
		status : 'disconnected',
		bitmap : [ '00000000',
               '00000000',
               '00000000',
               '00000000',
               '00000000',
               '00000000',
               '00000000',
               '00000000']
	});

	Matrix.find('42').observe({

		changed: function(newDoc) {
			console.log('observe');
			send(newDoc.bitmap);
		}
	})

  Arduinos.remove({});
  self.serialPort = Meteor.require('serialport');
  Meteor.setInterval(detectArduino, 1000);  
});	


