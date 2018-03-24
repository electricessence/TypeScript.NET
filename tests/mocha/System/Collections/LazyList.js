"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
///<reference types="node"/>
var assert = require("assert");
require("mocha");
var Linq_1 = require("../../../../dist/umd/Exceptions/Linq");
var LazyList_1 = require("../../../../dist/umd/Collections/LazyList");
var LENGTH = 10;
describe('.get(i)', function () {
    var source = new LazyList_1.default(Linq_1.default.range(0, LENGTH));
    it("should reject negative indexes", function () {
        assert.throws(function () { return source.get(0.5); });
    });
    it("should reject non-integers", function () {
        assert.throws(function () { return source.get(0.5); });
    });
    it("should be able to access all entries", function () {
        for (var i = 0; i < LENGTH; i++) {
            assert.equal(i, source.get(i));
        }
    });
    it("should reject out of bounds indexes", function () {
        assert.throws(function () { return source.get(10); });
    });
});
describe('.count', function () {
    it("should match enumerable count", function () {
        var source1 = new LazyList_1.default(Linq_1.default.range(0, LENGTH));
        var source2 = new LazyList_1.default(Linq_1.default.range(0, LENGTH));
        assert.equal(source1.count, source2.linq.count());
    });
    it("should match enumerable count with same (1)", function () {
        var source = new LazyList_1.default(Linq_1.default.range(0, LENGTH));
        assert.equal(source.count, source.linq.count());
    });
    it("should match enumerable count with same (2)", function () {
        var source = new LazyList_1.default(Linq_1.default.range(0, LENGTH));
        assert.equal(source.linq.count(), source.count);
    });
});
//# sourceMappingURL=LazyList.js.map