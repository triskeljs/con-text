/* global describe, it */

var assert = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('assert') : window.assert

var conText = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('../con-text') : window.conText

// var TEXT = conText(),
//     alt_TEXT = conText()

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

function _assertErrorMessage (message, spec_text) {
  return function (err) {
    assert.strictEqual( err.message, message , spec_text || 'err.message')
    return true
  }
}

describe('define/process filters', function () {

  var _TEXT = _fooBarConText()

  it('foo filter', function () {

    assert.strictEqual( _TEXT.processFilter('foo', 'bar'), 'foo: bar' , '')

  })


})

describe('eval filter', function () {

  var _TEXT = _fooBarConText()

  var fooFilter = _TEXT.evalFilter('foo')
  var barFilter = _TEXT.evalFilter('bar')

  it('foo filter', function () {

    assert.strictEqual( fooFilter('bar'), 'foo: bar' , '')

  })

  it('bar filter', function () {

    assert.strictEqual( barFilter('bar'), 'bar: bar' , '')

  })


})

describe('eval filters', function () {

  var _TEXT = _fooBarConText()

  var foobarFilter = _TEXT.evalFilters(['foo', 'bar'])
  var barfooFilter = _TEXT.evalFilters(['bar', 'foo'])

  it('foobar filter', function () {

    assert.strictEqual( foobarFilter('foobar'), 'bar: foo: foobar' , '')

  })

  it('barfoo filter', function () {

    assert.strictEqual( barfooFilter('barfoo'), 'foo: bar: barfoo' , '')

  })


})

describe('contexts are isolated', function () {

  var alt_TEXT = conText()

  it('filter missing: processFilter', function () {

    assert.throws(function () { alt_TEXT.processFilter('foo') }, Error)
    assert.throws(function () { alt_TEXT.processFilter('foo') }, _assertErrorMessage('filter \'foo\' is not defined') )

  })

  it('filter missing: evalFilter', function () {

    assert.throws(function () { alt_TEXT.evalFilter('foo')() }, Error)
    assert.throws(function () { alt_TEXT.evalFilter('foo')() }, _assertErrorMessage('filter \'foo\' is not defined') )

  })

  it('filter missing: evalFilters', function () {

    assert.throws(function () { alt_TEXT.evalFilters(['foo', 'bar'])() }, Error)

    assert.throws(function () { alt_TEXT.evalFilters(['foo', 'bar'])() }, _assertErrorMessage('filter \'foo\' is not defined') )

    assert.throws(function () { alt_TEXT.evalFilters(['bar', 'foo'])() }, _assertErrorMessage('filter \'bar\' is not defined') )

  })

  it('filter missing: eval', function () {

    assert.throws(function () { alt_TEXT.eval('foo | bar')({ foo: 'bar' }) }, Error)
    assert.throws(function () { alt_TEXT.eval('foo | bar')({ foo: 'bar' }) }, _assertErrorMessage('filter \'bar\' is not defined') )

  })

})
