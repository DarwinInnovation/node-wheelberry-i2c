//
// @file template.ts
// @author David Hammond
// @author Richard Miller-Smith
// @date 23 May 2018
//

import { invert_fn } from '../src';

test('invert false', () => {
  let val = invert_fn(false);
  expect(val).toBe(true);
});

test('invert true', () => {
  let val = invert_fn(true);
  expect(val).toBe(false);
});
