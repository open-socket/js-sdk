import { isString, stringOrUndefined, isObject, objectOrUndefined } from './type-guards';

describe('isString', () => {
  it('should return true for a string', () => {
    expect(isString('hello')).toBe(true);
  });

  it('should return false for a non-string value', () => {
    expect(isString(5)).toBe(false);
    expect(isString(true)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

describe('stringOrUndefined', () => {
  it('should return the string if it is a string', () => {
    expect(stringOrUndefined('hello')).toBe('hello');
  });

  it('should return undefined for a non-string value', () => {
    expect(stringOrUndefined(5)).toBeUndefined();
    expect(stringOrUndefined(true)).toBeUndefined();
    expect(stringOrUndefined({})).toBeUndefined();
    expect(stringOrUndefined(null)).toBeUndefined();
    expect(stringOrUndefined(undefined)).toBeUndefined();
  });
});

describe('isObject', () => {
  it('should return true for an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
  });

  it('should return false for a non-object value', () => {
    expect(isObject(5)).toBe(false);
    expect(isObject('hello')).toBe(false);
    expect(isObject(true)).toBe(false);
    // expect(isObject(null)).toBe(true);
    expect(isObject(undefined)).toBe(false);
  });
});

describe('objectOrUndefined', () => {
  it('should return the object if it is an object', () => {
    const obj = { name: 'John', age: 30 };
    expect(objectOrUndefined(obj)).toBe(obj);
  });

  //   it('should return undefined for a non-object value', () => {
  //     expect(objectOrUndefined(5)).toBeUndefined();
  //     expect(objectOrUndefined('hello')).toBeUndefined();
  //     expect(objectOrUndefined(true)).toBeUndefined();
  //     expect(objectOrUndefined(null)).toBeUndefined();
  //     expect(objectOrUndefined(undefined)).toBeUndefined();
  //   });
});
