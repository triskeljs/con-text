
import { evalExpression } from './eval'
import { interpolateProcessor } from './interpolate-processor'

module.exports = conText

function conText (_TEXT) {
  var filter_definitions = {}

  _TEXT = _TEXT || {}

  function _defineFilter (name, filterFn) {
    filter_definitions[name] = filterFn
  }

  function _processFilter (name, input, scope) {
    if( !filter_definitions[name] ) throw new Error('filter \'' + name + '\' is not defined')

    return filter_definitions[name](input, scope)
  }

  function _evalFilter (filter_key) {
    filter_key = filter_key.trim()

    if( !/:/.test(filter_key) ) {
      return function (input) {
        return _processFilter( filter_key, input )
      }
    }

    filter_key = filter_key.split(/:(.+)/)
    return (function (filter_name, getData ) {
      return function (input, scope) {
        return _processFilter( filter_name, input, getData(scope || {}) )
      }
    })( filter_key[0], evalExpression(filter_key[1]) )
  }

  function _evalFilters (filters_list) {
    var filters_funcs = filters_list.map(_evalFilter)

    if( !filters_list.length ) return function (result) { return result }

    return function (result, scope) {
      scope = scope || {}
      for( var i = 0, n = filters_funcs.length ; i < n ; i++ ) {
        result = filters_funcs[i](result, scope)
      }

      return result
    }
  }

  function _parseExpression ( expression ) {
    var filters_list = expression.split(' | ')

    expression = filters_list.shift()

    return {
      expression: expression,
      has_filters: filters_list.length > 0,
      processFilters: _evalFilters(filters_list),
    }
  }

  function _evalExpression (expression, _scope, _filters_scope) {
    var parsed = _parseExpression(expression),
        getValue = evalExpression( parsed.expression ),
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

  _TEXT.interpolate = interpolateProcessor(_evalExpression)

  _TEXT.eval = _evalExpression
  _TEXT.parseExpression = _parseExpression

  _TEXT.defineFilter = _defineFilter
  _TEXT.processFilter = _processFilter

  _TEXT.evalFilter = _evalFilter
  _TEXT.evalFilters = _evalFilters

  _TEXT.createConText = conText

  return _TEXT
}
