/* global describe, it */

var assert = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('chai').assert : window.assert

var evalExpression = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('../eval') : window.evalExpression

describe('eval no filters', function () {

  var getFooBar = evalExpression('foo.bar')

  it('get foobar', function () {

    assert.deepEqual( getFooBar({ foo: { bar: 'foobar' } }), 'foobar' )

  })

  it('get €', function () {

    assert.strictEqual( evalExpression(' symbol || \'€\' ')(), '€' )

  })

  it('get d undefined', function () {

    assert.strictEqual( evalExpression(' d ')(), undefined )

  })

  it('get d', function () {

    assert.strictEqual( evalExpression(' d ')({ d: 'foo' }), 'foo' )

  })

})

describe('eval errors', function () {

  it('throws Error', function () {

    assert.throws(function() { evalExpression(15) }, Error, null, 'Number')
    assert.throws(function() { evalExpression([]) }, Error, null, 'Array')
    assert.throws(function() { evalExpression(null) }, Error, null, 'null')

  })

  it('throws TypeError', function () {

    assert.throws(function() { evalExpression(15) }, TypeError, null, 'Number')
    assert.throws(function() { evalExpression([]) }, TypeError, null, 'Array')
    assert.throws(function() { evalExpression(null) }, TypeError, null, 'null')

  })

  it('err.message', function () {

    assert.throws(function() { evalExpression(15) }, /expression should be a String/, null, 'Number')
    assert.throws(function() { evalExpression([]) }, /expression should be a String/, null, 'Array')
    assert.throws(function() { evalExpression(null) }, /expression should be a String/, null, 'null')

  })

})

describe('globals triggering errors', function () {

  it('no globals', function () {

    var processExpression = evalExpression(' parseInt(\'32.5\') ', undefined)

    assert.throws(function() { processExpression({}) }, TypeError)

    assert.strictEqual( processExpression({ parseInt: parseInt }), 32 )

  })

  it('using globals', function () {

    var processExpression = evalExpression(' parseInt(\'32.5\') ', undefined, { globals: ['parseInt'] })

    assert.strictEqual( processExpression({}), 32 )

  })

})
