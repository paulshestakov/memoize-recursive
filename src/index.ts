// prettier-ignore
export const recursive =
  f =>
    (
      s => (...args) => f ( s (s) ) (...args)
    )(
      s => (...args) => f ( s (s) ) (...args)
    );

export const proxyInner = (proxy) => (fn) => {
  return (f) => (...args) => {
    return fn(f)(...proxy(...args));
  };
};

const defaultResolver = (args) => {
  return args[0];
};

export const memoizeInner = (resolver = defaultResolver) => (fn) => {
  const lookup = new Map();

  return (f) => (...args) => {
    const key = resolver(args);
    const entry = lookup.get(key);

    if (entry) {
      return entry;
    } else {
      const result = fn(f)(...args);
      lookup.set(key, result);
      return result;
    }
  };
};
