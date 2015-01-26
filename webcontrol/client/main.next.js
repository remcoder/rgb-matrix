
RegisterUnderscoreHelpers();

UI.registerHelper('formatNumber', function(number, formatting) {
  return numeral(number).format(formatting);
});

UI.registerHelper('arduino', function() {
  return Arduinos.findOne();
});


// setup router
var router = new Grapnel({ pushState : true });
var mainTemplate = new ReactiveVar();

// define routes
router.get('/', function(req){
  router.navigate('/sequencer');
});

router.get('/generator', function(req){
  mainTemplate.set('generator');
  console.log('load live-coding template')
});

router.get('/sequencer', function(req){
  mainTemplate.set('sequencer');
  console.log('load sequencer template')
});

router.get('/console', function(req){
  mainTemplate.set('console');
  console.log('load sequencer template')
});

router.get('/draw', function(req){
  mainTemplate.set('draw');
  console.log('load draw template')
});

router.get('/image', function(req){
  mainTemplate.set('image');
  console.log('load image template')
});

Template.main.helpers({
  mainTemplate : function() {
    return mainTemplate.get();
  }
});


