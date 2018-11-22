/* global describe, it */

var assert = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('assert') : window.assert

var conText = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('../con-text') : window.conText

var TEXT = conText()

var interpolateProcessor = require('../interpolate-processor'),
    fooProcessor = function () {
      return function (data) {
        return 'foo: ' + data.foo
      }
    },
    interpolateFoo = interpolateProcessor(fooProcessor)

describe('interpolate foo', function () {

  it('foo: bar', function () {

    assert.strictEqual( interpolateFoo('pre_text {{ foo }} post_text', { foo: 'bar' }), 'pre_text foo: bar post_text' )

  })

})

TEXT.defineFilter('foo', function (input) {
  return 'foo: ' + input
})

TEXT.defineFilter('bar', function (input) {
  return 'bar: ' + input
})

var expression,
    expressions = {
      'pre_text {{ foo.bar | foo }} post_text': {
        result_1: 'pre_text foo: foobar post_text',
      },
      'pre_text {{ foo.bar | bar }} post_text': {
        result_1: 'pre_text bar: foobar post_text',
      },
      'pre_text {{ bar.foo | foo }} post_text': {
        result_1: 'pre_text foo: barfoo post_text',
      },
      'pre_text {{ bar.foo | bar }} post_text': {
        result_1: 'pre_text bar: barfoo post_text',
      },
    },
    data = {
      foo: { bar: 'foobar' },
      bar: { foo: 'barfoo' },
    }

describe('interpolate', function () {

    for( expression in expressions ) {
      it('interpolate(expression, data): ' + expression, function () {

        assert.deepEqual( TEXT.interpolate(expression, data), expressions[expression].result_1 )

      })
    }
    
    for( expression in expressions ) {
      it('interpolate(expression)(data): ' + expression, function () {

        var evalGetter = TEXT.interpolate(expression)

        assert.deepEqual( evalGetter(data), expressions[expression].result_1 )

      })
    }

})
