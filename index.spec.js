const { memoizeRecursive } = require("./index");

describe("should use memoized results across calls", () => {
  let factorial;
  let multCount;

  beforeAll(() => {
    const factorial1 = (f) => (x) => {
      if (x <= 1) {
        return 1;
      } else {
        multCount += 1;
        return x * f(x - 1);
      }
    };

    factorial = memoizeRecursive(factorial1);
  });

  beforeEach(() => {
    multCount = 0;
  });

  it("should perform 2 multiplications initially", () => {
    factorial(3);
    expect(multCount).toEqual(2);
  });

  it("should use 2 memoized and perform 1 more multiplication", () => {
    factorial(4);
    expect(multCount).toEqual(1);
  });
});

describe("should use memoized results across calls", () => {
  let exponent;
  let multCount;

  beforeAll(() => {
    const exponent1 = (f) => (x, n) => {
      if (n === 0) {
        return 1;
      } else if (n === 1) {
        return x;
      } else if (n % 2 === 1) {
        multCount += 1;
        return x * f(x * x, Math.floor(n / 2));
      } else {
        multCount += 1;
        return f(x * x, n / 2);
      }
    };

    exponent = memoizeRecursive(exponent1);
  });

  beforeEach(() => {
    multCount = 0;
  });

  it("should perform 3 multiplications initially", () => {
    exponent(2, 8);
    expect(multCount).toEqual(3);
  });

  it("should use 3 memoized and perform 1 more multiplication", () => {
    exponent(2, 9);
    expect(multCount).toEqual(1);
  });
});
