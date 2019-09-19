/* global describe, it */

var assert = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('chai').assert : window.assert

var conText = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('../src/con-text') : window.conText

var interpolateProcessor = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('../interpolate-processor') : window.interpolateProcessor

function _fooBarConText () {
  var _TEXT = conText()

  _TEXT.defineFilter('foo', function (input) {
    return 'foo: ' + input
  })
  
  _TEXT.defineFilter('bar', function (input) {
    return 'bar: ' + input
  })

  return _TEXT
}

var fooProcessor = function () {
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
      [`pre_text {{ foobar ? ('foo' + foobar) : 'bar' }} post_text`]: {
        result_1: 'pre_text foofoobar post_text',
      },
      [`pre_text {{ barfoo ? ('foo' + foobar) : 'bar' }} post_text`]: {
        result_1: 'pre_text bar post_text',
      },
      [`pre_text {{ is_submitting ? 'challenges.document_id.cta_verifying' : 'challenges.document_id.cta' }} post_text`]: {
        result_1: 'pre_text challenges.document_id.cta post_text',
      },
      [` challenges.document_id.{{ product_type }}.{{ is_submitting ? 'description_verifying' : 'description' }} `]: {
        result_1: ' challenges.document_id.instalments.description ',
      },
    },
    data = {
      product_type: 'instalments',
      foobar: 'foobar',
      foo: { bar: 'foobar' },
      bar: { foo: 'barfoo' },
    }

describe('interpolate', function () {

  var _TEST = _fooBarConText()

  for( expression in expressions ) {
    it('interpolate(expression, data): ' + expression, function () {

      assert.deepEqual( _TEST.interpolate(expression, data), expressions[expression].result_1 )

    })
  }
  
  for( expression in expressions ) {
    it('interpolate(expression)(data): ' + expression, function () {

      var evalGetter = _TEST.interpolate(expression)

      assert.deepEqual( evalGetter(data), expressions[expression].result_1 )

    })
  }

})
