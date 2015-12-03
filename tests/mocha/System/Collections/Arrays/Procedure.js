///<reference path="../../../import"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../../../../../source/System/Collections/Array/Procedure'], function (require, exports) {
    var ArrayProcedure = require('../../../../../source/System/Collections/Array/Procedure');
    var assert = require('../../../../../node_modules/assert/assert');
    var minA = -10, maxA = 2000, minB = -Infinity, maxB = Infinity, a = [5, minA, -1, maxA, -2, NaN, 20], b = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20], sum = 5 + minA + (-1) + maxA + (-2) + 20, average = sum / 6, product = 5 * minA * (-1) * maxA * (-2) * 20;
    function procedureShouldBe(source, value, p) {
        it('should be NaN', function () {
            assert.ok(isNaN(p(source, false)));
        });
        it('should be ' + value, function () {
            assert.equal(p(source, true), value);
        });
    }
    describe(".sum(source)", function () {
        procedureShouldBe(a, sum, ArrayProcedure.sum);
    });
    describe(".average(source)", function () {
        procedureShouldBe(a, average, ArrayProcedure.average);
    });
    describe(".product(source)", function () {
        procedureShouldBe(a, product, ArrayProcedure.product);
    });
    describe(".min(source)", function () {
        describe("a", function () {
            procedureShouldBe(a, minA, ArrayProcedure.min);
        });
        describe("b", function () {
            procedureShouldBe(b, minB, ArrayProcedure.min);
        });
    });
    describe(".max(source)", function () {
        describe("a", function () {
            procedureShouldBe(a, maxA, ArrayProcedure.max);
        });
        describe("b", function () {
            procedureShouldBe(b, maxB, ArrayProcedure.max);
        });
    });
});

//# sourceMappingURL=Procedure.js.map
