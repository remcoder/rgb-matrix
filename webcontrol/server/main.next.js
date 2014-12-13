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
        colorDuino.sendCommand('col', newDoc.color);

      if (!_.isEqual(newDoc, oldDoc))
        colorDuino.sendCommand('msk', newDoc.bitmask.map( (bits) => parseInt(bits,2) ));
    }
  });

  Sequences.remove({});
  Sequences.insert({
    title : 'Cylon scanner',
    patterns : [{
      steps: [
        {
          time: 0,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,7,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,0,8] }
          ]
        },
        {
          time: 100,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,0,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,1,8] }
          ]
        },
        {
          time: 200,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,1,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,2,8] }
          ]
        },
        {
          time: 300,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,2,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,3,8] }
          ]
        },
        {
          time: 400,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,3,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,4,8] }
          ]
        },
        {
          time: 500,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,4,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,5,8] }
          ]
        },
        {
          time: 600,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,5,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,6,8] }
          ]
        },
        {
          time: 700,
          opcodes : [
            { opcode: 'col', data: [0,0,0] },
            { opcode: 'hli', data: [0,6,8] },
            { opcode: 'col', data: [0,255,0] },
            { opcode: 'hli', data: [0,7,8] }
          ]
        }
      ]
    }]
  });

  colorDuino.start({
    baudrate : 19200,
    onConnect : function() {
      var seq = Sequences.findOne();
      Sequencer.play(seq);
    }
  });
});


