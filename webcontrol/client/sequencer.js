Template.sequencer.helpers({
  currentPattern : function() {
    var pattern = CurrentPattern.findOne();
    if (!pattern) return;
    pattern.steps[pattern.step].current = true;
    return pattern;
  }
});

Template.sequencer.events({
  'click .sequencer [data-action=play]' : function() {
    console.log('play')
    Meteor.call('SequencerPlay', CurrentPattern.findOne('42'), function(err,res) {
      if (err) throw new Error(err);
    });
  },
  'click .sequencer [data-action=pause]' : function() {
    Meteor.call('SequencerPause', function(err,res) {
      if (err) throw new Error(err);
    });
  },

  'click .sequencer [data-action=resume]' : function() {
    Meteor.call('SequencerResume', function(err,res) {
      if (err) throw new Error(err);
    });
  }
});

