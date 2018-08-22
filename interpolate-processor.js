
module.exports = function (expressionProcessor) {
  return function interpolateText (text) {
    var texts = text.split(/{{.*?}}/),
        expressions = ( text.match(/{{.*?}}/g) ||[] ).map(function (expression) {
          return expressionProcessor( expression.replace(/^{{|}}$/g, '') );
        });

    return function (scope) {
      return texts.reduce(function (result, text, i) {
        return result + text + ( expressions[i] ? expressions[i](scope) : '' );
      }, '');
    };
  };
};
