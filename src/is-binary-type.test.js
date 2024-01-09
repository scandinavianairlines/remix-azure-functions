import { describe, expect, test } from 'vitest';

import { isBinaryType } from './is-binary-type.js';

describe('The isBinaryType function', () => {
  test('should return `true` when given content-type is binary', () => {
    expect(isBinaryType('application/zip')).toBeTruthy();
  });
  test('should return `false` when given content-type is binary', () => {
    expect(isBinaryType('application/something')).toBeFalsy();
  });
});
