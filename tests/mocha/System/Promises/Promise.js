(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Promises/Promise", "../../../../source/System/Promises/Simple", "../../../../source/System/Collections/Array/Utility", "../../../../source/System/Diagnostics/Stopwatch"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("../../../../source/System/Promises/Promise");
    var SimplePromise = require("../../../../source/System/Promises/Simple");
    var AU = require("../../../../source/System/Collections/Array/Utility");
    var Stopwatch_1 = require("../../../../source/System/Diagnostics/Stopwatch");
    var assert = require('../../../../node_modules/assert/assert');
    var REASON = "this is not an error, but it might show up in the console";
    var calledAsFunctionThis = (function () { return this; }());
    afterEach(function () {
    });
    describe("computing sum of integers using promises", function () {
        var count = 10000;
        var array = AU.range(1, count);
        var swA = Stopwatch_1.default.startNew();
        var answer = array.reduce(function (currentVal, nextVal) { return currentVal + nextVal; }, 0);
        swA.stop();
        it("should compute correct result without blowing stack (lambda only)", function () {
            var sw = Stopwatch_1.default.startNew();
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; });
            }, SimplePromise.fulfilled(0))
                .then(function (value) {
                sw.stop();
                console.log("");
                console.log("Synchronous Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
                assert.equal(value, answer);
            });
        });
        it("should compute correct result without blowing stack (lambda only)", function () {
            var sw = Stopwatch_1.default.startNew();
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; });
            }, Promise_1.Promise.fulfilled(0))
                .then(function (value) {
                sw.stop();
                console.log("");
                console.log("Async Promise Compute Milliseconds: ", sw.elapsedMilliseconds);
                console.log("Non-Promise Benchmark Milliseconds: ", swA.elapsedMilliseconds);
                assert.equal(value, answer);
            });
        });
        it("should be deferring fulfillment", function () {
            return array
                .reduce(function (promise, nextVal) {
                var wasRun = false;
                var r = promise.then(function (currentVal) {
                    wasRun = true;
                    return currentVal + nextVal;
                });
                assert.ok(!wasRun, "The promise should have deferred until after closure completed.");
                return r;
            }, Promise_1.Promise.fulfilled(0));
        });
        it("should compute correct result without blowing stack", function () {
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return Promise_1.Promise.fulfilled(currentVal + nextVal); });
            }, Promise_1.Promise.fulfilled(0))
                .then(function (value) {
                return assert.equal(value, answer);
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