var self = this;
Meteor.startup(function () {
	console.log('*** RGBMatrix ***');
	Matrix.remove({});
	Matrix.insert({
		_id : '42',
		status : 'disconnected',
        color  : [0,255,0],
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
			// console.log('observe', newDoc);
		  send(newDoc);
		}
	})

  Arduinos.remove({});
  Meteor.setInterval(detectArduino, 1000);
});


