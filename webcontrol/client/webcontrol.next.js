Template.main.matrix = function() {
	return Matrix.findOne('42');
}

Template.main.arduino = function() {
	return Arduinos.findOne();
}

Template.main.rows = function() {
	return this.bitmap.map(function(r, i) { return { row: r, index: i}; });
}

Template.main.columns = function() {
	return this.row.split('').map(function(val, i){ return { pixel: !!+val, index: i }; });	
}

Template.main.events = {
	'click .pixel' : function(evt) {

		var el = evt.currentTarget;
		var row = el.getAttribute('data-row');
		var column = el.getAttribute('data-column');
		var bitmap = Matrix.findOne('42').bitmap.map(function(line) { return line.split(''); } );
		var pixel = !!+bitmap[row][column];
		// console.log('click pixel', row, column, pixel);
		bitmap[row][column] = +!pixel;
		bitmap = bitmap.map(function(line) { return line.join(''); } );		
		Matrix.update('42', { $set: 
			{ bitmap: bitmap } 
		});
		// console.log('bitmap', bitmap);
	},

	'click [data-action=clear]' : function() {
		Matrix.update('42', { $set: 
			{ bitmap: _.range(8).map( el => '00000000' ) } 
		});	
	}
}