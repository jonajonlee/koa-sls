import { test } from 'ava';
import objectMap from '../../src/util/objectMap';

test('should return empty object if object is empty', t => {
  const increment = (x: number) => x + 1;
  t.deepEqual(objectMap(increment, {}), {});
});

test('should return the result of the map function for each prop', t => {
  const obj = { a: 1, b: 2 };
  const expected = { a: 2, b: 3 };

  const increment = (x: number) => x + 1;

  t.deepEqual(objectMap(increment, obj), expected);
});
