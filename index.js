const recursive =
  f =>
    (
      s => (...args) => f ( s (s) ) (...args)
    )(
      s => (...args) => f ( s (s) ) (...args)
    );

const memoizeInner = (fn, keymaker = JSON.stringify) => {
  const lookup = new Map();

  return (f) => (...args) => {
    const key = keymaker(args);

    return lookup[key] || (lookup[key] = fn(f)(...args));
  };
};

module.exports = { recursive, memoizeInner };
