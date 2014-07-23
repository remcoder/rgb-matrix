Meteor.startup(function () {
	console.log('*** WebControl ***');
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

	Matrix.find({}).observe({

		changed: function(newDoc) {
			console.log('observe');
			send(newDoc.bitmap);
		}
	})

});	