# @trisquel/con-text

[![ᴋɪʟᴛ ᴊs](https://jesus.germade.es/assets/images/badge-kiltjs.svg)](https://github.com/kiltjs)
[![npm](https://img.shields.io/npm/v/@trisquel/con-text.svg?maxAge=3600)](https://www.npmjs.com/package/@trisquel/con-text)
[![Build Status](https://travis-ci.org/kiltjs/trisquel-con-text.svg?branch=master)](https://travis-ci.org/kiltjs/trisquel-con-text)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

``` sh
npm install -D @trisquel/con-text
```

## Examples

``` js
import createConText from '@trisquel/con-text';

var TEXT = createConText();
```

### Evaluating expressions

``` js

TEXT.eval(' foo ? foo : 'bar' ', { foo: 'foobar' });
// results: 'foobar'

TEXT.eval(' foo ? foo : 'bar' ', { foo: false });
// results: 'bar'

```

### Using Filters

``` js

TEXT.defineFilter('amount', function (amount) {
  return parseInt(amount) + ',' + amount%100;
});

TEXT.eval(' price | amount ', { price: 12345 });
// results: '123,45'

//---

TEXT.defineFilter('title', function (input_text) {
  return 'title: ' + input_text;
});

TEXT.eval(' foo | title ', { foo: 'bar' });
// results: 'title: bar'

TEXT.eval(' foo | title ', { foo: 'foobar' });
// results: 'title: foobar'

```

### Interpolating text

TEXT.defineFilter('amount', function (amount) {
  return parseInt(amount) + ',' + amount%100;
});

``` js

TEXT.interpolate('current price: {{ price | amount }}€', { price: 12345 });
// results: 'current price: 123,45€'

```