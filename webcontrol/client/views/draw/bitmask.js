
Template.bitmask.helpers({
  matrix : function() {
    return Matrix.findOne();
  },

  pixels : function() {
    var pixels = [];

    
    this.bitmask.forEach(function(r, i) {
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
  },

  columns : function() {
    return this.row.split('').map(function(val, i){ return { pixel: !!+val, index: i }; });
  }
});

Template.bitmask.events({
  'click .pixel' : function(evt) {

  var el = evt.currentTarget;
  var row = el.getAttribute('data-row');
  var column = el.getAttribute('data-column');
  var bitmask = Matrix.findOne('42').bitmask.map(function(line) { return line.split(''); } );
  var pixel = !!+bitmask[row][column];
  // console.log('click pixel', row, column, pixel);
  bitmask[row][column] = +!pixel;
  bitmask = bitmask.map(function(line) { return line.join(''); } );
  Matrix.update('42', { $set:
    { bitmask: bitmask }
  });
  // console.log('bitmask', bitmask);
  },

  'click [data-action=clear]' : function() {
    Matrix.update('42', { $set:
      { bitmask: _.range(8).map( function(el) { return '00000000';} ) }
    });
  }
});


Template.bitmask.events({
  'change input[type=color]' : _.throttle(function(evt) {
  // console.log(evt.currentTarget.value);
    Matrix.update('42', { $set:
      { color: hex2rgb(evt.currentTarget.value) }
    });
  },50)
});

Template.bitmask.helpers({
  hexColor : function(c) {
    return rgbToHex(c[0], c[1], c[2]);
  }
});



function hex2rgb(h){return [hexToR(h),hexToG(h),hexToB(h)]; };
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

