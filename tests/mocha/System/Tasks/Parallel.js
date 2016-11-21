"use strict";
var assert = require("assert");
var Stopwatch_1 = require("../../../../source/System/Diagnostics/Stopwatch");
var Parallel_1 = require("../../../../source/System/Threading/Tasks/Parallel");
it("should return the expected concatenation", function () {
    return Parallel_1.Parallel
        .startNew("there", function (x) { return "hello: " + x; })
        .then(function (result) { return assert.equal(result, "hello: there"); }, function (error) { return assert.ok(false); });
});
function test(start) {
    var max = 3000000;
    for (var i = start, stop = start + max; i < stop; i++) {
        start += i;
    }
    return start;
}
var synchronousResult = 0;
var data = [];
it("should work synchronously", function () {
    // console.log("\nSynchronous time (ms):",
    Stopwatch_1.default.measure(function () {
        for (var i = 0; i < 20; i++) {
            data.push(i);
            synchronousResult += test(i);
        }
    });
});
function setupMap(maxCon) {
    it("should return the expected mapped sum (concurrency " + maxCon + ")", function () {
        //this.timeout(3000);
        // var sw = Stopwatch.startNew();
        return Parallel_1.Parallel
            .maxConcurrency(maxCon)
            .map(data, test)
            .thenThis(function (result) { return assert.ok(true); }, function (error) { return assert.ok(false, "mapping failed!"); })
            .reduce(function (p, c) { return p + c; }, 0)
            .then(function (result) { return assert.equal(result, synchronousResult); }, function (error) { return assert.ok(false, error); });
    });
}
function setupPipe(maxCon) {
    it("should return the expected sum (concurrency " + maxCon + ")", function () {
        //this.timeout(3000);
        // var sw = Stopwatch.startNew();
        return Parallel_1.Parallel
            .maxConcurrency(maxCon)
            .pipe(data, test)
            .reduce(function (p, c) { return p + c; }, 0)
            .then(function (result) { return assert.equal(result, synchronousResult); }, function (error) { return assert.ok(false, error); });
    });
}
setupPipe(1);
setupPipe(2);
// setupPipe(3);
// setup(15);
// setup(10);
//setup(7);
setupMap(1);
setupMap(2);
// setupMap(3); 
//# sourceMappingURL=Parallel.js.map