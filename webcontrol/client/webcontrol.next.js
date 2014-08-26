Template.main.matrix = function() {
	return Matrix.findOne('42');
}

Template.main.hexColor = function(c) {
	return rgbToHex(c[0], c[1], c[2]);
}

Template.main.arduino = function() {
	return Arduinos.findOne();
}

Template.main.pixels = function() {
	var pixels = [];

	this.bitmap.forEach(function(r, i) {
		r.split('').forEach(function(val, j) {
			pixels.push({
				row: i,
				column: j,
				x: j*32,
				y: i*32,
				pixel: !!+val
			});
		});
	});
	return pixels;
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
	
	'change input[type=color]' : _.throttle(function(evt) {
		// console.log(evt.currentTarget.value);	
		Matrix.update('42', { $set: 
			{ color: hex2rgb(evt.currentTarget.value) } 
		});	
	},50),

	'click [data-action=clear]' : function() {
		Matrix.update('42', { $set: 
			{ bitmap: _.range(8).map( el => '00000000' ) } 
		});	
	}
}

function hex2rgb(h){return [hexToR(h),hexToG(h),hexToB(h)]; };
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}