
// https://stackoverflow.com/questions/1661197/what-characters-are-valid-for-javascript-variable-names/9337047#9337047

var ecma_keywords = {}

'null,true,false,undefined,arguments,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,finally,for,function,if,import,in,instanceof,new,return,super,switch,this,throw,try,typeof,var,void,while,with,yield'.split(',').forEach(function (key) {
  ecma_keywords[key] = true
})

var match_var = /\.?[a-zA-Z_$][0-9a-zA-Z_$]*( *:)?/g

function _evalExpression (expression, options) {
  var matches = [],
      used_vars = Object.create(ecma_keywords)

  options = options || {}
  if( options.globals ) options.globals.forEach(function (key) {
    used_vars[key] = true
  })

  if( typeof expression !== 'string' ) throw new TypeError('expression should be a String');

  ( expression
      .replace(/''|'(.*?[^\\])'/g, '\'\'')
      .replace(/""|"(.*?[^\\])"/g, '""')
      .match(match_var) || []
  ).forEach(function (key) {
    if( key[0] === '.' || /:$/.test(key) || used_vars[key] ) return

    used_vars[key] = true

    matches.push(key)
  })

  used_vars = null

  var runExpression = Function.apply(null, matches.concat('return (' + expression + ');') )

  return function (scope) {
    if( !scope ) scope = {}

    return runExpression.apply(null, matches.map(function (key) { return scope[key] }) )
  }
}

module.exports = function (expression, scope, options) {
  if( scope === undefined ) return _evalExpression(expression, options)

  return _evalExpression(expression, options)(scope)
}
