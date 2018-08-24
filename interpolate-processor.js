
module.exports = function (expressionProcessor) {
  return function interpolateText (text, _scope) {
    var texts = text.split(/{{.*?}}/),
        expressions = ( text.match(/{{.*?}}/g) ||[] ).map(function (expression) {
          return expressionProcessor( expression.replace(/^{{|}}$/g, '') );
        });

    function getResult (scope) {
      return texts.reduce(function (result, text, i) {
        return result + text + ( expressions[i] ? expressions[i](scope) : '' );
      }, '');
    }

    if( _scope === undefined ) return getResult;

    return getResult(_scope);

  };
};
