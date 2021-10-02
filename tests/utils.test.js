const Utils = require('../api/infrastructure/utils');

test('Invalid url should fail validation', () => {
    expect(Utils.isValidURL('test')).toBe(false);
});

test('Invalid url should fail validation 2', () => {
    expect(Utils.isValidURL('test.com')).toBe(false);
});

test('Valid url should pass validation', () => {
    expect(Utils.isValidURL('http://localhost:3000')).toBe(true);
});