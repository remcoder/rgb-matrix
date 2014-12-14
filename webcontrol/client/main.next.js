
RegisterUnderscoreHelpers();

UI.registerHelper('formatNumber', function(number, formatting) {
  return numeral(number).format(formatting);
});
