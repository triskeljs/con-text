/* global describe, it */

var conText = require('../con-text'),
    TEXT = conText(),
    assert = require('assert');

TEXT.defineFilter('foo', function (input) {
  return 'foo: ' + input;
});

TEXT.defineFilter('bar', function (input) {
  return 'bar: ' + input;
});

describe('eval 1 filter', function () {

  var expressions = {
        ' foo.bar | foo ': {
          result_1: 'foo: foobar',
        },
        ' foo.bar | bar ': {
          result_1: 'bar: foobar',
        },
        ' bar.foo | foo ': {
          result_1: 'foo: barfoo',
        },
        ' bar.foo | bar ': {
          result_1: 'bar: barfoo',
        },
      },
      data = {
        foo: { bar: 'foobar' },
        bar: { foo: 'barfoo' },
      };

  for( var expression in expressions ) {
    it(expression, function () {

      var evalGetter = TEXT.eval(expression);

      assert.deepEqual( evalGetter(data), expressions[expression].result_1 );

    });
  }

});

describe('eval 2 filters', function () {

  var expressions = {
        ' foo.bar | foo | foo': {
          result_1: 'foo: foo: foobar',
        },
        ' foo.bar | foo | bar ': {
          result_1: 'bar: foo: foobar',
        },
        ' foo.bar | bar | foo ': {
          result_1: 'foo: bar: foobar',
        },
        ' foo.bar | bar | bar ': {
          result_1: 'bar: bar: foobar',
        },
        ' bar.foo | foo | foo': {
          result_1: 'foo: foo: barfoo',
        },
        ' bar.foo | foo | bar ': {
          result_1: 'bar: foo: barfoo',
        },
        ' bar.foo | bar | foo ': {
          result_1: 'foo: bar: barfoo',
        },
        ' bar.foo | bar | bar ': {
          result_1: 'bar: bar: barfoo',
        },
      },
      data = {
        foo: { bar: 'foobar' },
        bar: { foo: 'barfoo' },
      };

  for( var expression in expressions ) {
    it(expression, function () {

      var evalGetter = TEXT.eval(expression);

      assert.deepEqual( evalGetter(data), expressions[expression].result_1 );

    });
  }

});

TEXT.defineFilter('fooFirstName', function (input, user) {
  return input + ': ' + user.first_name;
});

TEXT.defineFilter('fooLastName', function (input, user) {
  return input + ': ' + user.last_name;
});

TEXT.defineFilter('fooFullName', function (input, user) {
  return input + ': ' + user.first_name + ' ' + user.last_name;
});

describe('eval 1 filter with scope', function () {

  var expressions = {
        ' foo.bar | fooFirstName: user ': {
          result_1: 'foobar: John',
        },
        ' foo.bar | fooLastName: user ': {
          result_1: 'foobar: Smith',
        },
        ' foo.bar | fooFullName: user ': {
          result_1: 'foobar: John Smith',
        },
      },
      data = {
        foo: { bar: 'foobar' },
        bar: { foo: 'barfoo' },
      },
      user = {
        first_name: 'John',
        last_name: 'Smith',
      };

  for( var expression in expressions ) {
    it(expression, function () {

      var evalGetter = TEXT.eval(expression);

      assert.deepEqual( evalGetter(data, { user: user }), expressions[expression].result_1 );

    });
  }

});

describe('eval 2 filters with scope', function () {

  var expressions = {
        ' foo.bar | fooFirstName:{ first_name: first_name } | fooLastName:{ last_name: last_name } ': {
          result_1: 'foobar: John: Smith',
        },
        ' foo.bar | fooLastName:{ last_name: last_name } | fooFirstName:{ first_name: first_name } ': {
          result_1: 'foobar: Smith: John',
        },
      },
      data = {
        foo: { bar: 'foobar' },
        bar: { foo: 'barfoo' },
      },
      user = {
        first_name: 'John',
        last_name: 'Smith',
      };

  for( var expression in expressions ) {
    it(expression, function () {

      var evalGetter = TEXT.eval(expression);

      assert.deepEqual( evalGetter(data, user), expressions[expression].result_1 );

    });
  }

});
