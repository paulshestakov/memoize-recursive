[![npm](https://img.shields.io/npm/v/memoize-recursive)](https://www.npmjs.com/package/memoize-recursive)

# Problem

Given a binary exponentiation function:

```js
const exponent = (x, n) => {
  if (n === 0) {
    return 1;
  }
  if (n % 2 === 1) {
    return x * exponent(x * x, Math.floor(n / 2));
  } else {
    return exponent(x * x, Math.floor(n / 2));
  }
}

exponent(2, 8)
  // 256, three multiplications
exponent(2, 9)
  // 512, four multiplications
```

Consider given standart `memoize` function:

```js
const mExponent = memoize(exponent)

mExponent(2, 8)
  // 256, three multiplications
mExponent(2, 8)
  // 256, returns the memoized result, no multiplications

mExponent(2, 9)
  // 512, four multiplications
```

The problem is that inner recursive call in `exponent` is not memoized

Workaround(hardcoced, not composable):

```js
const mExponent = memoized((x, n) => {
  if (n === 0) {
    return 1;
  }
  if (n % 2 === 1) {
    return x * mExponent(x * x, Math.floor(n / 2));
  } else {
    return mExponent(x * x, Math.floor(n / 2));
  }
});

mExponent(2, 8)
  // 256, three multiplications
mExponent(2, 9)
  // 512, one multiplication
```

# Solution

Define recursive function with abstraction point at f:

```js
const exponent1 = (f) => (x, n) => {
  if (n === 0) {
    return 1;
  }
  if (n % 2 === 1) {
    return x * f(x * x, Math.floor(n / 2));
  } else {
    return f(x * x, Math.floor(n / 2));
  }
}
```

Create recursive function:

```js
const {recursive} = require('memoize-recursive');

const exponent = recursive(exponent1);

exponent(2, 8)
  // 256, three multiplications
exponent(2, 8)
  // 256, three multiplications
```

Create recursive memoized function:

```js
const {recursive, memoizeInner} = require('memoize-recursive');

const mExponent = recursive(memoizeInner(exponent1));

mExponent(2, 8)
  // 256, three multiplications
mExponent(2, 9)
  // 512, one multiplication
```
