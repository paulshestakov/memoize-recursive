const recursive = (f) =>
  ((s) => (...arg) => f(s(s))(...arg))((s) => (...arg) => f(s(s))(...arg));

const memoize = (fn, keymaker = JSON.stringify) => {
  const lookup = new Map();

  return (f) => (...args) => {
    const key = keymaker(args);

    return lookup[key] || (lookup[key] = fn(f)(...args));
  };
};

const memoizeRecursive = (f) => recursive(memoize(f));

module.exports = { memoizeRecursive };
