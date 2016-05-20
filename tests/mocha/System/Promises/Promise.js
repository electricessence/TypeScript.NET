(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Promises/Promise", "../../../../source/System/Collections/Array/Utility"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("../../../../source/System/Promises/Promise");
    var AU = require("../../../../source/System/Collections/Array/Utility");
    var assert = require('../../../../node_modules/assert/assert');
    var REASON = "this is not an error, but it might show up in the console";
    var calledAsFunctionThis = (function () { return this; }());
    afterEach(function () {
    });
    describe("computing sum of integers using promises", function () {
        var count = 1000;
        var array = AU.range(1, count);
        var pZero = Promise_1.Promise.fulfilled(0);
        it("should compute correct result without blowing stack (lambda only)", function () {
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; });
            }, pZero)
                .then(function (value) {
                return assert.equal(value, count * (count + 1) / 2);
            });
        });
        it("should compute correct result without blowing stack", function () {
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return Promise_1.Promise.fulfilled(currentVal + nextVal); });
            }, pZero)
                .then(function (value) {
                return assert.equal(value, count * (count + 1) / 2);
            });
        });
    });
    describe("Q function", function () {
        it("should result in a fulfilled promise when given a value", function () {
            var f = Promise_1.Promise.fulfilled(5);
            assert.equal(f.result, 5);
            assert.equal(f.isResolved, true);
            assert.equal(f.isFulfilled, true);
            assert.equal(f.isRejected, false);
        });
        it("should result in a rejected promise when requesting rejected", function () {
            var f = Promise_1.Promise.rejected("err");
            assert.equal(f.error, "err");
            assert.equal(f.isResolved, true);
            assert.equal(f.isFulfilled, false);
            assert.equal(f.isRejected, true);
        });
    });
});

//# sourceMappingURL=Promise.js.map
