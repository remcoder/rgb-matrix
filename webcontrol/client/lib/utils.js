this.RegisterUnderscoreHelpers = function RegisterUnderscoreHelpers() {
  for (var key in _) {
    var prop = _[key];
    if (typeof(prop) == 'function' ) {
      _createUnderscoreHelper(key, prop);
    }
  }
}

// Spacebars always passes an extra argument to the helper, an
// object of type Spacebars.kw.
// To make underscore function work with optional parameters
// that last argument is stripped from the argument list.
function _createUnderscoreHelper(key, fun) {
  UI.registerHelper('_'+key, function() {
  var args = Array.prototype.slice.call(arguments, 0, arguments.length-1);
    return fun.apply(null, args);
  });
}