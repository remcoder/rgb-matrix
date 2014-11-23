
Template.setColor.events({
  'change input[type=color]' : _.throttle(function(evt) {
  // console.log(evt.currentTarget.value);
    Matrix.update('42', { $set:
      { color: hex2rgb(evt.currentTarget.value) }
    });
  },50)
});

Template.setColor.helpers({
  hexColor : function(c) {
    return rgbToHex(c[0], c[1], c[2]);
  }
});



function hex2rgb(h){return [hexToR(h),hexToG(h),hexToB(h)]; };
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

