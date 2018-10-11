
function _evalExpression (expression) {
  var matches = [],
      valid_keys = {};

  if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');

  (expression.replace(/'[^']'|"[^"]/g, '').match(/\.?[a-zA-Z]\w+/g) ||[]).forEach(function (key) {
    if( key[0] === '.' || valid_keys[key] ) return;

    valid_keys[key] = true;

    matches.push(key);
  });

  valid_keys = null;

  var runExpression = Function.apply(null, matches.concat('return (' + expression + ');') );

  return function (scope) {
    if( !scope ) scope = {};

    return runExpression.apply(null, matches.map(function (key) { return scope[key]; }) );
  };
}

module.exports = function (expression, scope) {
  if( scope === undefined ) return _evalExpression(expression);

  return _evalExpression(expression)(scope);
};

// function _getSymbol (err) {
//   if( /:/.test(err.message) ) return err.message.split(/ *: */).pop().split(/ +/)[0];
//   return (err.message.split(/ +/)[0] || '').replace(/^'|'$/g, '');
// }
//
// module.exports = function _evalExpression (expression, _scope) {
//   if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');
//
//   var execExpression = new Function('scope', 'with(scope) { return (' + expression + '); };');
//
//    function evalGetter (scope) {
//     scope = scope || {};
//     try {
//       return execExpression(scope);
//     } catch(err) {
//       // console.log('ReferenceError', err, err instanceof ReferenceError);
//       if( err instanceof ReferenceError ) {
//         scope = Object.create(scope);
//         scope[_getSymbol(err)] = null;
//         return execExpression(scope);
//       }
//       return '';
//     }
//   }
//
//   if( _scope === undefined ) return evalGetter;
//
//   return evalGetter(_scope);
// };
