'use strict;'

/*
  
  generate dynamic patterns

*/
Session.setDefault('drawCode', null);

Template.generator.helpers({

});

Template.generator.events({
  'keyup .generator .draw.code' : function(evt) {
    console.log('generate pattern');
    console.log($(evt.currentTarget).val());
    Session.set('drawCode', $(evt.currentTarget).val() );
  }
});

Template.generator.rendered = function () {

  // render the dynamic pattern whenever the code changes
  this.autorun(function() {
    render(Session.get('drawCode'));
  });


  Session.set('drawCode', this.$('.code').val() );
}

// function _init() {

// }

var _state = null, 
  _canvas = null,
  _ctx = null,
  _compiledDraw = null;

function _draw(body, time) {
  if (!_compiledDraw)
    _compiledDraw = new Function('canvas','ctx','state',body);


  console.log('drawing frame',_state);
  _compiledDraw(_canvas, _ctx, _state);
  var imgSrc = _canvas.toDataURL();
  var imageData = _ctx.getImageData(0,0,8,8);
  var step = {
    time: time,
    opcodes: [_imageDataToBitmap(imageData.data)],
    _image : imgSrc
  };

  CurrentPattern.update('42', {
    $push : {
      steps: step
    }
  })
}

function _imageDataToBitmap(data) {
  console.log(data.length)
  var bitmap = [];
  for (var p = 0 ; p<256 ; p+=4) {
    bitmap.push(data[p]);
    bitmap.push(data[p+1]);
    bitmap.push(data[p+2]);
  }
  return { opcode: 'bmp', data: bitmap };
}

function render(drawcode) {
  _compiledDraw = null;
  _state = {};
  _canvas = document.createElement('canvas');
  _canvas.width = _canvas.height = 8;
  _ctx = _canvas.getContext('2d');
  CurrentPattern.update('42', { $set: { steps : [] }});
  // _init(canvas, ctx, state);

  for (var i=0 ; i<4 ; i++) 
    _draw(drawcode, i*200);
  
  //console.log(frames)
  // pattern.steps = frames;
}
