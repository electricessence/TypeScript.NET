(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../source/System/Promises/Promise", "../../../../source/System/Collections/Array/Utility", "../../../../source/System/Diagnostics/Stopwatch", "../../../../source/System/Threading/defer"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Promise_1 = require("../../../../source/System/Promises/Promise");
    var AU = require("../../../../source/System/Collections/Array/Utility");
    var Stopwatch_1 = require("../../../../source/System/Diagnostics/Stopwatch");
    var defer_1 = require("../../../../source/System/Threading/defer");
    var assert = require('../../../../node_modules/assert/assert');
    var REASON = "this is not an error, but it might show up in the console";
    var calledAsFunctionThis = (function () { return this; }());
    afterEach(function () {
    });
    describe("computing sum of integers using promises", function () {
        var count = 1000;
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
        it("should compute correct result without blowing stack (All Deferred) (lambda only)", function () {
            var sw = Stopwatch_1.default.startNew();
            return array
                .reduce(function (promise, nextVal) {
                return promise.then(function (currentVal) { return currentVal + nextVal; }).deferAll();
            }, Promise_1.Promise.resolve(0).deferAll())
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
            assert.equal(f.isSettled, true);
            assert.equal(f.isFulfilled, true);
            assert.equal(f.isRejected, false);
        });
        it("should result in a rejected promise when requesting rejected", function () {
            var f = Promise_1.Promise.reject("err");
            assert.equal(f.error, "err");
            assert.equal(f.isSettled, true);
            assert.equal(f.isFulfilled, false);
            assert.equal(f.isRejected, true);
        });
        it("resolves multiple observers", function (done) {
            var nextTurn = false;
            var resolution = "Ta-ram pam param!";
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
        var BREAK = "break", NO = "NO!";
        function testPromiseFlow(p) {
            return p
                .then(null)
                .then(function (v) {
                assert.ok(v);
                return v;
            }, function () {
                assert.ok(false);
                return true;
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
            }, function (e) {
                assert.ok(false);
                return NO;
            })
                .then(null, null)
                .defer()
                .then(function (v) {
                assert.ok(false);
                return NO;
            }, function (e) {
                assert.equal(e, BREAK);
                return BREAK;
            })
                .then(function (v) {
                assert.equal(v, BREAK);
                return true;
            }, function (e) {
                assert.ok(false);
                return false;
            })
                .then(function (v) {
                assert.ok(v);
                throw BREAK;
            })
                .catch(function (e) {
                assert.equal(e, BREAK);
                return true;
            })
                .then(function (v) {
                assert.ok(v);
                return 10;
            })
                .delay()
                .then(function (v) {
                assert.equal(v, 10);
            });
        }
        it("should follow expected promise behavior flow for a resolved promise", function () {
            return testPromiseFlow(Promise_1.Promise.resolve(true));
        });
        it("should follow expected promise behavior flow for a rejected promise", function () {
            return testPromiseFlow(Promise_1.Promise
                .reject(BREAK)
                .catch(function (v) {
                assert.equal(v, BREAK);
                return true;
            }));
        });
        it("should follow expected promise behavior flow for a pending then resolved promise", function () {
            var p = Promise_1.Promise.pending();
            assert.ok(p.isPending);
            p.resolve(true);
            return testPromiseFlow(p);
        });
        it("should be able to use a lazy resolved", function () {
            var p = Promise_1.Promise.lazy.resolve(function () { return true; });
            assert.ok(p.isFulfilled);
            return testPromiseFlow(p);
        });
        it("should be able to use a then-able", function () {
            var p = Promise_1.Promise.createFrom(function (r) {
                r(true);
                return Promise_1.Promise.resolve(true);
            });
            return testPromiseFlow(p);
        });
        it("should be able to use a synchronous resolver", function () {
            var p = Promise_1.Promise.pending(function (resolve) {
                resolve(true);
            });
            assert.ok(p.isFulfilled);
            return testPromiseFlow(p);
        });
        it("should be able to use a synchronous rejection", function () {
            var p = Promise_1.Promise.pending(function (resolve, reject) {
                reject(true);
            });
            assert.ok(p.isRejected);
            return testPromiseFlow(p.catch(function () { return true; }));
        });
        it("should be able to use an async resolver", function () {
            var p = Promise_1.Promise.pending(function (resolve) {
                defer_1.defer(function () { return resolve(true); });
            });
            assert.ok(p.isPending);
            return testPromiseFlow(p);
        });
        it("should be able to use lazy pending", function () {
            var p = Promise_1.Promise.lazy.pending(function (resolve) {
                defer_1.defer(function () { return resolve(true); });
            });
            assert.ok(p.isPending);
            return testPromiseFlow(p);
        });
        it("should be able to use promise as a resolution", function () {
            var s = Promise_1.Promise.pending();
            var p = Promise_1.Promise.pending(function (resolve) {
                defer_1.defer(function () { return resolve(s); });
            });
            assert.ok(s.isPending);
            assert.ok(p.isPending);
            s.resolve(true);
            return testPromiseFlow(p);
        });
        it("should be able to resolve all", function () {
            return Promise_1.Promise.all(Promise_1.Promise.resolve(3).defer(), Promise_1.Promise.resolve(2).defer(), Promise_1.Promise.resolve(1).defer()).then(function (r) {
                assert.equal(r[0], 3);
                assert.equal(r[1], 2);
                assert.equal(r[2], 1);
            });
        });
        it("should resolve as rejected", function () {
            return Promise_1.Promise.all(Promise_1.Promise.resolve(3).defer(), Promise_1.Promise.resolve(2).defer(), Promise_1.Promise.resolve(1).defer(), Promise_1.Promise.reject(-1).defer()).then(function () {
                assert.ok(false);
            }, function (e) {
                assert.equal(e, -1);
            });
        });
        it("should be resolve the first to win the race", function () {
            return Promise_1.Promise.race(Promise_1.Promise.reject(4).delay(), Promise_1.Promise.resolve(3).delay(), Promise_1.Promise.resolve(2).defer(), Promise_1.Promise.resolve(1)).then(function (r) {
                assert.equal(r, 1);
            });
        });
        it("should be resolve the rejection", function () {
            return Promise_1.Promise.race(Promise_1.Promise.resolve(3).delay(), Promise_1.Promise.resolve(2).defer(), Promise_1.Promise.reject(1)).then(function () {
                assert.ok(false);
            }, function (e) {
                assert.equal(e, 1);
            });
        });
    });
});

//# sourceMappingURL=Promise.js.map
