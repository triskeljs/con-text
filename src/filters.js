
export function pipeToFilter (filter_definitions, filter_name, input, data) {
  if( !arguments.length ) throw new Error('missing filter_definitions')

  if( arguments.length === 1 ) return function _pipeToFilter (_filter_name, _input, _data) { // currying
    return pipeToFilter(filter_definitions, _filter_name, _input, _data)
  }

  if( !filter_definitions[filter_name] ) throw new Error('filter \'' + filter_name + '\' is not defined')

  return filter_definitions[filter_name](input, data)
}
