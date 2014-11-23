var self = this;
Meteor.startup(function () {
  console.log('*** RGBMatrix ***');

  Matrix.upsert('42', {
    $set : {
      color  : [0,255,0],
      bitmask : [ '00011000',
                  '00111100',
                  '01111110',
                  '11011011',
                  '11111111',
                  '00100100',
                  '01011010',
                  '00100100']
    }
  });

  Matrix.find('42').observe({

    changed: function(newDoc, oldDoc) {
      // console.log('observe', newDoc);
      if (newDoc.color != oldDoc.color)
        colorDuino.setColor(...newDoc.color);

      if (!_.isEqual(newDoc, oldDoc))
        colorDuino.bitmask(newDoc.bitmask);
    }
  })

  colorDuino.start({
    baudrate : 19200,
    onConnect : function() {
      var m = Matrix.findOne('42');
      // console.log(m);
      colorDuino.setColor(...m.color);
      colorDuino.bitmask(m.bitmask);
    }
  });
});


