import R from "ramda";
import { recursive, memoizeInner, proxyInner } from "./index";

const id = (...x) => {
  return x;
};

describe("calculating factorial", () => {
  let proxy = jest.fn().mockImplementation(id);
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
    factorial = R.compose(
      recursive,
      memoizeInner(),
      proxyInner(proxy)
    )(factorial1);
  });

  beforeEach(() => {
    multCount = 0;
    proxy.mockClear();
  });

  it("should perform 3 multiplications", () => {
    factorial(3);
    expect(proxy).toHaveBeenCalledTimes(3);
  });

  it("should use 3 memoized multiplications and perform 1 more call", () => {
    factorial(4);
    expect(proxy).toHaveBeenCalledTimes(1);
  });
});

describe("calculating exponent", () => {
  let proxy = jest.fn().mockImplementation(id);
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
    exponent = R.compose(
      recursive,
      memoizeInner(JSON.stringify),
      proxyInner(proxy)
    )(exponent1);
  });

  beforeEach(() => {
    multCount = 0;
    proxy.mockClear();
  });

  it("should perform 4 multiplications", () => {
    exponent(2, 8);
    expect(proxy).toHaveBeenCalledTimes(4);
  });

  it("should use 4 memoized steps and 1 more initial call", () => {
    exponent(2, 9);
    expect(proxy).toHaveBeenCalledTimes(1);
  });
});

describe("traversing a tree", () => {
  it("should memoize traversing a tree", () => {
    const tree = {
      label: "A",
      children: [
        {
          label: "B",
          children: [
            {
              label: "C",
              children: [
                {
                  label: "Magic",
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const magicNode = tree.children[0].children[0].children[0];

    const findNodeWithMagicLabel1 = (f) => (tree) => {
      if (tree.label === "Magic") {
        return tree;
      }
      for (let i = 0; i < tree.children.length; i++) {
        const child = tree.children[i];
        const targetNode = f(child);

        if (targetNode) {
          return targetNode;
        }
      }
    };

    const proxy = jest.fn().mockImplementation(id);
    const findNodeWithMagicLabel = R.compose(
      recursive,
      memoizeInner(),
      proxyInner(proxy)
    )(findNodeWithMagicLabel1);

    expect(findNodeWithMagicLabel(tree)).toEqual(magicNode);
    expect(proxy).toBeCalledTimes(4);

    proxy.mockClear();

    const newTree = {
      label: "New A",
      children: [tree],
    };

    expect(findNodeWithMagicLabel(newTree)).toEqual(magicNode);
    expect(proxy).toBeCalledTimes(1);
  });
});
