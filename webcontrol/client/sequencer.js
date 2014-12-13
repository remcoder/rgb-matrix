Template.sequencer.helpers({
  currentSequence : function() {
    var seq = Sequences.findOne();

    var step = seq.patterns[0].steps[CurrentSequence.findOne().step]
    if (step) step.current = true;
    return seq;
  }
});
