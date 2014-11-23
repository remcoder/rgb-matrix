
Template.bitmask.helpers({
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
      { bitmask: _.range(8).map( el => '00000000' ) }
    });
  }
});
