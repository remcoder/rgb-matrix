
var _currentSequence = null, _stepIndex = 0;

Meteor.startup(function(){
  CurrentSequence.remove({});
  CurrentSequence.insert({
    _id : '42',
    step : 0
  });
});

function play(sequence) {
  _currentSequence = sequence;
  _stepIndex = 0;
  playStep();
}

function playStep() {
  var steps = _currentSequence.patterns[0].steps;
  var step = steps[_stepIndex];
  
  // schedule next step
  // this must be done before processing instructions
  // because processing instructions may take a substantial amount of time
  var next = steps[_stepIndex+1];
  if (next)
    Meteor.setTimeout(playStep, next.time - step.time);
  else
  {
    _stepIndex = 0;
    Meteor.setTimeout(playStep, 100);
  }

  // process instructions in current step
  step.opcodes.forEach(function(opcode) {
    colorDuino.sendCommand(opcode.opcode, opcode.data);
  });
  
  if(next) _stepIndex++;

  CurrentSequence.update('42', {
    $set : {
      step : _stepIndex 
    }
  })
}

this.Sequencer = {
  play: play
};
