

import assert from 'assert'

import { pipeToFilter } from './filters'

/** define-property */
describe(__filename.split('/').pop(), function () {
// --------------------------------------

describe('pipeToFilter', function () {

  it('throws', function () {
    assert.throws( () => pipeToFilter(), Error )
    assert.throws( () => pipeToFilter(), /missing filter_definitions/ )
  })

  it('currying', function () {
    assert.strictEqual( typeof pipeToFilter({}), 'function' )
  })

  var filter_definitions = {
    uppercase: (text) => text.toUpperCase(),
    replaceFoo: (text, data) => text.replace(/foo/g, data),
    dropEven: (list) => list.filter( (num) => num%2 )
  }

  function _runTestCase (input, filter_name, data, result) {
    it(`'${ input }' | ${ filter_name }`, function () {
      assert.deepStrictEqual(
        pipeToFilter(filter_definitions, filter_name, input, data),
        result,
        'direct'
      )
      assert.deepStrictEqual(
        pipeToFilter(filter_definitions)(filter_name, input, data),
        result,
        'currying'
      )
    })
  }
  
  [

    [` foo `, 'uppercase', null, ` FOO `],
    [` foo `, 'replaceFoo', `bar`, ' bar '],

    [ [1,2,3,4,5,6], 'dropEven', null, [1,3,5] ],

  ].forEach( (test_case) => _runTestCase.apply(null, test_case) )

})

/** */
})
/** */
