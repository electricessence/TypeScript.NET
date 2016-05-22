(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Promises/Promise", "../../../../source/System/Collections/Array/Utility", "../../../../source/System/Diagnostics/Stopwatch"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("../../../../source/System/Promises/Promise");
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
        it("should compute correct result without blowing stack (Synchronous) (lambda only)", function () {
            var sw = Stopwatch_1.default.startNew();
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; });
            }, Promise_1.Promise.resolve(0))
                .then(function (value) {
                sw.stop();
                assert.equal(value, answer);
            });
        });
        it("should compute correct result without blowing stack (Deferred) (lambda only)", function () {
            var sw = Stopwatch_1.default.startNew();
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; }).defer();
            }, Promise_1.Promise.resolve(0).defer())
                .then(function (value) {
                sw.stop();
                assert.equal(value, answer);
            });
        });
        it("should be deferring fulfillment", function () {
            return array
                .reduce(function (promise, nextVal) {
                var wasRun = false;
                var r = promise.defer().then(function (currentVal) {
                    wasRun = true;
                    return currentVal + nextVal;
                });
                assert.ok(!wasRun, "The promise should have deferred until after closure completed.");
                return r;
            }, Promise_1.Promise.resolve(0));
        });
    });
    describe("Resolution and Rejection", function () {
        it("should result in a fulfilled promise when given a value", function () {
            var f = Promise_1.Promise.resolve(5);
            assert.equal(f.result, 5);
            assert.equal(f.isResolved, true);
            assert.equal(f.isFulfilled, true);
            assert.equal(f.isRejected, false);
        });
        it("should result in a rejected promise when requesting rejected", function () {
            var f = Promise_1.Promise.reject("err");
            assert.equal(f.error, "err");
            assert.equal(f.isResolved, true);
            assert.equal(f.isFulfilled, false);
            assert.equal(f.isRejected, true);
        });
        it("resolves multiple observers", function (done) {
            var nextTurn = false;
            var resolution = "Taram pam param!";
            var pending = Promise_1.Promise.pending();
            var deferred = pending.defer();
            var count = 10;
            var i = 0;
            function resolve(value) {
                i++;
                assert.equal(value, resolution);
                assert.equal(nextTurn, true);
                if (i === count) {
                    done();
                }
            }
            while (++i <= count) {
                deferred.then(resolve);
            }
            pending.resolve(resolution);
            i = 0;
            nextTurn = true;
        });
        it("observers called even after throw (synchronous)", function () {
            var threw = false;
            var pending = Promise_1.Promise.pending();
            pending.then(function () {
                threw = true;
                throw new Error(REASON);
            });
            pending.then(function (value) { return assert.equal(value, 10); }, function () { return assert.equal("not", "here"); });
            pending.resolve(10);
            return pending;
        });
        it("observers called even after throw (asynchronous)", function () {
            var threw = false;
            var pending = Promise_1.Promise.pending();
            var deferred = pending.defer();
            deferred.then(function () {
                threw = true;
                throw new Error(REASON);
            });
            deferred.then(function (value) { return assert.equal(value, 10); }, function () { return assert.equal("not", "here"); });
            pending.resolve(10);
            return deferred;
        });
        it("follows expected promise behavior flow", function () {
            var BREAK = "break";
            Promise_1.Promise
                .resolve(true)
                .then(function (v) {
                assert.ok(v);
                return v;
            }, function (e) {
                assert.ok(false);
                return e;
            })
                .then(function (v) {
                assert.ok(v);
                return v;
            })
                .then(function (v) {
                assert.ok(v);
                return false;
            })
                .then(function (v) {
                assert.ok(!v);
                return true;
            })
                .then(function (v) {
                assert.ok(v);
                throw BREAK;
            })
                .then(function (v) {
                assert.ok(false);
                return v;
            }, function (e) {
                assert.equal(e, BREAK);
                return BREAK;
            })
                .then(function (v) {
                assert.equal(v, BREAK);
                return BREAK;
            }, function (e) {
                assert.equal(e, BREAK);
                return BREAK;
            })
                .then(function () {
                assert.ok(true);
                throw BREAK;
            })
                .catch(function (e) {
                return true;
            })
                .then(function (v) {
                assert.ok(v);
            });
        });
    });
});

//# sourceMappingURL=Promise.js.map
