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


  colorDuino.start({
    baudrate : 38400,
    onConnect : function() {}
  });

  CurrentPattern.remove({});
  CurrentPattern.insert({
    _id : '42',
    step : 0
  });
  // CurrentPattern.find('42').observe({
  //   added: function(pattern) {
  //     console.log('added')
  //     Sequencer.play(pattern);
  //   },
  //   changed: function(pattern) {
  //     console.log('changed')
  //     Sequencer.play(pattern);
  //   }
  // });

  
  Patterns.remove({});
  Patterns.insert({
    title : 'Cylon scanner',
  
    steps: [
      {
        time: 0,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [7,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [0,0,8] }
        ]
      },
      {
        time: 100,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [0,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [1,0,8] }
        ]
      },
      {
        time: 200,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [1,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [2,0,8] }
        ]
      },
      {
        time: 300,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [2,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [3,0,8] }
        ]
      },
      {
        time: 400,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [3,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [4,0,8] }
        ]
      },
      {
        time: 500,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [4,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [5,0,8] }
        ]
      },
      {
        time: 600,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [5,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [6,0,8] }
        ]
      },
      {
        time: 700,
        opcodes : [
          { opcode: 'col', data: [0,0,0] },
          { opcode: 'vli', data: [6,0,8] },
          { opcode: 'col', data: [255,0,0] },
          { opcode: 'vli', data: [7,0,8] }
        ]
      }
    ]
  });
  


});


