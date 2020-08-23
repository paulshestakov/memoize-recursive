Apply memoization to recursive functions:

Define recursive function in a format:

```
const f1 = (f) => (...args) => {
  // smth
  return f(...someArgs)
}
```

Example:

```
const {memoizeRecursive} = require('memoize-recursive');

// Define a recursive function with recursive function f as abstraction point
const factorial1 = f => x => x <= 1 ? 1 : f(x - 1);

// Create a recursive memoized function
const factorial = memoizeRecursive(factorial1);

// Expect 2 mult calls to happen
factorial(3);

// Expect 1 mult call to happen
factorial(4);
```