/* global describe, it */

var assert = typeof exports === 'object' && typeof module !== 'undefined' ?
    require('chai').assert : window.assert

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
    assert.throws(function () { alt_TEXT.processFilter('foo') }, Error, 'filter \'foo\' is not defined' )

  })

  it('filter missing: evalFilter', function () {

    assert.throws(function () { alt_TEXT.evalFilter('foo')() }, Error)
    assert.throws(function () { alt_TEXT.evalFilter('foo')() }, Error, 'filter \'foo\' is not defined' )

  })

  it('filter missing: evalFilters', function () {

    assert.throws(function () { alt_TEXT.evalFilters(['foo', 'bar'])() }, Error)

    assert.throws(function () { alt_TEXT.evalFilters(['foo', 'bar'])() }, Error, 'filter \'foo\' is not defined' )

    assert.throws(function () { alt_TEXT.evalFilters(['bar', 'foo'])() }, Error, 'filter \'bar\' is not defined' )

  })

  it('filter missing: eval', function () {

    assert.throws(function () { alt_TEXT.eval('foo | bar')({ foo: 'bar' }) }, Error)
    assert.throws(function () { alt_TEXT.eval('foo | bar')({ foo: 'bar' }) }, Error, 'filter \'bar\' is not defined' )

  })

})
