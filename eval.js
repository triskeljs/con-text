
// https://stackoverflow.com/questions/1661197/what-characters-are-valid-for-javascript-variable-names/9337047#9337047

var ecma_keywords = {};

'break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,new,return,super,switch,this,throw,try,typeof,var,void,while,with,yield'.split(',').forEach(function (key) {
  ecma_keywords[key] = true;
});

var match_var = /\.?[a-zA-Z_$][0-9a-zA-Z_$]+/g;

function _evalExpression (expression) {
  var matches = [],
      valid_keys = Object.create(ecma_keywords);

  if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');

  ( expression
      .replace(/'[^']'/g, '\'\'')
      .replace(/"[^"]"/g, '""')
      .match(match_var) || []
  ).forEach(function (key) {
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
