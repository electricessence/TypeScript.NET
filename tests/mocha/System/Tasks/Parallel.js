"use strict";
var Parallel_1 = require("../../../../dist/commonjs/System/Threading/Tasks/Parallel");
var Stopwatch_1 = require("../../../../dist/commonjs/System/Diagnostics/Stopwatch");
var Promise_1 = require("../../../../dist/commonjs/System/Promises/Promise");
var Procedure_1 = require("../../../../dist/commonjs/System/Collections/Array/Procedure");
var assert = require('assert');
it("should return the expected concatenation", function () {
    function test(x) {
        return "hello: " + x;
    }
    return Parallel_1.default
        .startNew("there", test)
        .then(function (result) { return assert.equal(result, "hello: there"); }, function (error) { return assert.ok(false); });
});
it("should return the expected sum", function () {
    function test(start) {
        var max = 100000000;
        for (var i = start, stop = start + max; i < stop; i++) {
            start += i;
        }
        return start;
    }
    var synchronousResult = 0;
    console.log("\nSynchronous time (ms):", Stopwatch_1.default.measure(function () {
        for (var i = 0; i < 4; i++) {
            synchronousResult += test(i);
        }
    })
        .total.milliseconds);
    var sw = Stopwatch_1.default.startNew();
    return Promise_1.default
        .all(Parallel_1.default.startNew(0, test), Parallel_1.default.startNew(1, test), Parallel_1.default.startNew(2, test), Parallel_1.default.startNew(3, test))
        .then(function (results) { return assert.equal(Procedure_1.sum(results), synchronousResult); }, function (error) { return assert.ok(false); })
        .finallyThis(function () { return console.log("\nParallel time (ms):", sw.elapsedMilliseconds); });
});
//# sourceMappingURL=Parallel.js.map