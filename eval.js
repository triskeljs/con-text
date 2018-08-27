
function _getSymbol (err) {
  if( /:/.test(err.message) ) return err.message.split(/ *: */).pop().split(/ +/)[0];
  return err.message.split(/ +/)[0];
}

module.exports = function _evalExpression (expression, _scope) {
  if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');

  var execExpression = new Function('scope', 'with(scope) { return (' + expression + '); };');

   function evalGetter (scope) {
    scope = scope || {};
    try {
      return execExpression(scope);
    } catch(err) {
      // console.log('ReferenceError', err, err instanceof ReferenceError);
      if( err instanceof ReferenceError ) {
        scope = Object.create(scope);
        scope[_getSymbol(err)] = null;
        return execExpression(scope);
      }
      return '';
    }
  }

  if( _scope === undefined ) return evalGetter;

  return evalGetter(_scope);
};
