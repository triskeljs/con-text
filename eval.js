
module.exports = function _evalExpression (expression) {
  if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');
  
  var execExpression = new Function('scope', 'with(scope) { return (' + expression + '); };');
  return function (scope) {
    scope = scope || {};
    try {
      return execExpression(scope);
    } catch(err) {
      // console.log('ReferenceError', err, err instanceof ReferenceError);
      if( err instanceof ReferenceError ) {
        scope = Object.create(scope);
        scope[err.message.substr(0, err.message.length - 15) ] = null;
        return execExpression(scope);
      }
      return '';
    }
  };
};
