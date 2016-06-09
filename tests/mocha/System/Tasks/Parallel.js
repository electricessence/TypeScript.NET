"use strict";
var Parallel_1 = require("../../../../dist/commonjs/System/Threading/Tasks/Parallel");
var Stopwatch_1 = require("../../../../dist/commonjs/System/Diagnostics/Stopwatch");
var assert = require('assert');
it("should return the expected concatenation", function () {
    return Parallel_1.default
        .startNew("there", function (x) { return "hello: " + x; })
        .then(function (result) { return assert.equal(result, "hello: there"); }, function (error) { return assert.ok(false); });
});
function test(start) {
    var max = 30000000;
    for (var i = start, stop = start + max; i < stop; i++) {
        start += i;
    }
    return start;
}
var synchronousResult = 0;
var data = [];
it("should work synchronously", function () {
    console.log("\nSynchronous time (ms):", Stopwatch_1.default.measure(function () {
        for (var i = 0; i < 20; i++) {
            data.push(i);
            synchronousResult += test(i);
        }
    })
        .total.milliseconds);
});
function setup(maxCon) {
    it("should return the expected sum (concurrency " + maxCon + ")", function () {
        var sw = Stopwatch_1.default.startNew();
        return Parallel_1.default
            .maxConcurrency(maxCon)
            .map(data, test)
            .reduce(function (p, c) { return p + c; }, 0)
            .then(function (result) { return assert.equal(result, synchronousResult); }, function (error) { return assert.ok(false); })
            .finallyThis(function () { return console.log("\n(" + maxCon + ") Parallel time (ms):", sw.elapsedMilliseconds); });
    });
}
setup(2);
setup(3);
//# sourceMappingURL=Parallel.js.map