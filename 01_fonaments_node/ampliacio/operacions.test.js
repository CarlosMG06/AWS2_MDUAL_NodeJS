const test = require("node:test");
const assert = require("node:assert");
const op = require("./operacions.js");

test("suma", () => { 
    assert.strictEqual(op.suma(36, 42), 78);
});
test("resta", () => {
    assert.strictEqual(op.resta(57, 38), 19);
});
test("multiplica", () => {
    assert.strictEqual(op.multiplica(14, 7), 98);
});
test("divideix", () => {
    assert.strictEqual(op.divideix(99,22), 4.5);
});
test("divideixPerZeroError", () => {
    assert.throws(() => op.divideix(6,0), /dividir per zero/i);
});
