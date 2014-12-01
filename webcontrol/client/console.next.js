Template.console.events({

  'submit form' : function(e) {
    e.preventDefault();
    var $input = $('[name=command]');
    var command = $input.val();
    // TODO test with egexp
    command = command.trim();
    command = command.replace(/\s{2,}/g, ' ');
    var parts = command.split(' ');
    var opcode = parts[0];
    var operand = parts[1];
    if (operand) {
      operand = operand.replace(/\s/g, '');
      var bytes = operand.split(',').map((byte)=> parseInt(byte, 10));
    }
    if (!Opcode.exists(opcode))
      throw new Error('Illigal opcode: ' + opcode);

    console.log('$ ', opcode, bytes);
    Meteor.call('sendCommand', opcode, bytes);
    $input.val('');
  }
});
