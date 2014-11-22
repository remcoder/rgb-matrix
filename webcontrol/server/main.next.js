var self = this;
Meteor.startup(function () {
  console.log('*** RGBMatrix ***');
  Matrix.remove({});
  Matrix.insert({
    _id : '42',
    status : 'disconnected',
    color  : [0,255,0],
    bitmask : ['00011000',
                          '00111100',
                          '01111110',
                          '11011011',
                          '11111111',
                          '00100100',
                          '01011010',
                          '00100100']
  });

  Matrix.find('42').observe({

    changed: function(newDoc, oldDoc) {
      // console.log('observe', newDoc);
      if (newDoc.color != oldDoc.color)
        colorDuino.setColor(newDoc.color[0], newDoc.color[1], newDoc.color[2]); // TODO: ES6 splat

      if (!_.isEqual(newDoc, oldDoc))
        colorDuino.bitmask(newDoc.bitmask);
    }
  })

  colorDuino.start({
    baudrate : 19200,
    onConnect : function() {
      var m = Matrix.findOne('42');
      // console.log(m);
      colorDuino.setColor(m.color[0], m.color[1], m.color[2]); // TODO: ES6 splat
      colorDuino.bitmask(m.bitmask);

      // colorDuino.setColor(0,255,0);
      // colorDuino.bitmask(['00011000',
      //                     '00111100',
      //                     '01111110',
      //                     '11011011',
      //                     '11111111',
      //                     '00100100',
      //                     '01011010',
      //                     '00100100'] );
    }
  });
});


