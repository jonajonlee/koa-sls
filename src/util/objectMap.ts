/**
 * Applies a function to each value in a given record and returns
 * a map of the applied value to the associated key
 *
 * e.g.)
 * const obj = { a: 1, b: 2 };
 * const increment = (x) => x + 1;
 *
 * objectMap(increment, obj) // { a: 2, b: 3 }
 */
const objectMap = <T, U>(
  fn: (x: T) => U,
  obj: Record<string, T>
): Record<string, U> =>
  Object.keys(obj).reduce(
    (record, key) => ({
      ...record,
      [key]: fn(obj[key])
    }),
    {}
  );

export default objectMap;
