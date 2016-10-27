"use strict";
var assert = require("assert");
var Dispatch_1 = require("../../../../../dist/commonjs/System/Collections/Array/Dispatch");
it("should apply closures in order", function () {
    var result = 0;
    var a = [
        function (p) {
            result += p;
        },
        function (p) {
            result *= p;
        },
        null
    ];
    Dispatch_1.dispatch(a, 10);
    assert.equal(result, 100);
    assert.equal(Dispatch_1.mapped(null, 20), null);
    assert.equal(Dispatch_1.mapped([], 20).length, 0);
    assert.equal(Dispatch_1.mapped(a, 20).length, 3);
    Dispatch_1.unsafe(null, 10);
    assert.equal(result, 2400);
});
var b = [
    function (p) {
        throw "error";
    }
];
it("should propagate errors", function () {
    assert.throws(function () {
        Dispatch_1.dispatch(b, 10);
    });
    assert.throws(function () {
        Dispatch_1.mapped(b, 10);
    });
});
it("should trap errors", function () {
    assert.doesNotThrow(function () {
        Dispatch_1.dispatch(b, 10, true);
        Dispatch_1.dispatch(b, 10, function (err) { return assert.equal(err, 'error'); });
    });
    assert.doesNotThrow(function () {
        Dispatch_1.mapped(b, 10, true);
        Dispatch_1.mapped(b, 10, function (err) { return assert.equal(err, 'error'); });
    });
});
//# sourceMappingURL=Dispatch.js.map