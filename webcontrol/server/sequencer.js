
var _currentPattern = null, 
  _stepIndex = 0,
  _stepTimer = null;


function _playStep() {
  var steps = _currentPattern.steps;
  var step = steps[_stepIndex];
  
  // schedule next step
  // this must be done before processing instructions
  // because processing instructions may take a substantial amount of time
  var next = steps[_stepIndex+1];
  if (next)
    _stepTimer = Meteor.setTimeout(_playStep, next.time - step.time);
  else
  {
    _stepIndex = 0;
    _stepTimer = Meteor.setTimeout(_playStep, 200);
  }

  // process instructions in current step
  step.opcodes.forEach(function(opcode) {
    colorDuino.sendCommand(opcode.opcode, opcode.data);
  });
  
  if(next) _stepIndex++;

  CurrentPattern.update('42', {
    $set : {
      step : _stepIndex 
    }
  });
}

function play(pattern) {
  _currentPattern = pattern;
  _stepIndex = 0;
  _playStep();
}

function resume() {
  // just play the next scheduled step w/o changing any state
  _playStep();
}

function pause() {
  // just interrupt playing w/o changing any state
  Meteor.clearTimeout(_stepTimer);
}

function stop() {

}

this.Sequencer = {
  play   : play,
  pause  : pause,
  resume : resume,
  stop   : stop
};

Meteor.methods({
  SequencerPlay   : play,
  SequencerPause  : pause,
  SequencerResume : resume,
  SequencerStop   : stop
});
