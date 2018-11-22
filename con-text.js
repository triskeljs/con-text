
var _evalExpression = require('./eval')
var interpolateProcessor = require('./interpolate-processor')

module.exports = textContext

function textContext (context) {
  var filter_definitions = {}

  context = context || {}

  function defineFilter (name, filterFn) {
    filter_definitions[name] = filterFn
  }

  function processFilter (name, input, scope) {
    if( !filter_definitions[name] ) throw new Error('filter \'' + name + '\' is not defined')

    return filter_definitions[name](input, scope)
  }

  function evalFilter (filter_key) {
    filter_key = filter_key.trim()

    if( !/:/.test(filter_key) ) {
      return function (input) {
        return processFilter( filter_key, input )
      }
    }

    filter_key = filter_key.split(/:(.+)/)
    return (function (filter_name, getData ) {
      return function (input, scope) {
        return processFilter( filter_name, input, getData(scope || {}) )
      }
    })( filter_key[0], _evalExpression(filter_key[1]) )
  }

  function evalFilters (filters_list) {
    var filters_funcs = filters_list.map(evalFilter)

    if( !filters_list.length ) return function (result) { return result }

    return function (result, scope) {
      scope = scope || {}
      for( var i = 0, n = filters_funcs.length ; i < n ; i++ ) {
        result = filters_funcs[i](result, scope)
      }

      return result
    }
  }

  function parseExpression ( expression ) {
    var filters_list = expression.split(' | ')

    expression = filters_list.shift()

    return {
      expression: expression,
      has_filters: filters_list.length > 0,
      processFilters: evalFilters(filters_list),
    }
  }

  function evalExpression (expression, _scope, _filters_scope) {
    var parsed = parseExpression(expression),
        getValue = _evalExpression( parsed.expression ),
        processFilters = parsed.processFilters

    if( _scope === undefined ) {
      if( !parsed.has_filters ) return getValue

      return function (scope, filters_scope) {
        scope = scope || {}
        try{
          return processFilters( getValue(scope), filters_scope || scope )
        } catch(err) {
          console.error('error in expression: \'' + expression + '\''); // eslint-disable-line
          throw err
        }
      }
    }

    return processFilters( getValue(_scope), _filters_scope || _scope )
  }

  context.interpolate = interpolateProcessor(evalExpression)

  context.eval = evalExpression
  context.parseExpression = parseExpression

  context.defineFilter = defineFilter
  context.processFilter = processFilter

  context.evalFilter = evalFilter
  context.evalFilters = evalFilters

  context.createConText = textContext

  return context
}
