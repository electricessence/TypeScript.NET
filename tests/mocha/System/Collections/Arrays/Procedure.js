(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../../dist/commonjs/System/Collections/Array/Procedure"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArrayProcedure = require("../../../../../dist/commonjs/System/Collections/Array/Procedure");
    var assert = require('../../../../../node_modules/assert/assert');
    var minA = -10, maxA = 2000, minB = -Infinity, maxB = Infinity, a = [5, minA, -1, maxA, -2, NaN, 20], b = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20], sum = 5 + minA + (-1) + maxA + (-2) + 20, average = sum / 6, product = 5 * minA * (-1) * maxA * (-2) * 20, quotient = 5 / minA / (-1) / maxA / (-2) / 20;
    function procedureShouldBe(source, value, p) {
        it('should be NaN', function () {
            assert.ok(isNaN(p(source)));
        });
        it('should be ' + value, function () {
            assert.equal(p(source, true), value);
        });
    }
    describe(".sum(source)", function () {
        procedureShouldBe(a, sum, ArrayProcedure.sum);
        it('should be 0', function () {
            assert.equal(ArrayProcedure.sum([]), 0);
        });
    });
    describe(".average(source)", function () {
        procedureShouldBe(a, average, ArrayProcedure.average);
        it('should be NaN', function () {
            assert.ok(isNaN(ArrayProcedure.average([])));
        });
    });
    describe(".product(source)", function () {
        procedureShouldBe(a, product, ArrayProcedure.product);
        it('should be NaN', function () {
            assert.ok(isNaN(ArrayProcedure.product([])));
            assert.ok(isNaN(ArrayProcedure.product([NaN], true)));
        });
    });
    describe(".quotient(source)", function () {
        procedureShouldBe(a, quotient, ArrayProcedure.quotient);
        it('should be NaN', function () {
            assert.ok(isNaN(ArrayProcedure.quotient([])));
            assert.ok(isNaN(ArrayProcedure.quotient([1])));
            assert.ok(isNaN(ArrayProcedure.quotient([3, 2, 1, 0])));
            assert.ok(isNaN(ArrayProcedure.quotient([NaN], true)));
            assert.ok(isNaN(ArrayProcedure.quotient([NaN, NaN, NaN])));
        });
    });
    describe(".min(source)", function () {
        describe("a", function () {
            procedureShouldBe(a, minA, ArrayProcedure.min);
        });
        describe("b", function () {
            procedureShouldBe(b, minB, ArrayProcedure.min);
        });
        it("should be NaN", function () {
            assert.ok(isNaN(ArrayProcedure.min(null)));
            assert.ok(isNaN(ArrayProcedure.min([NaN], true)));
        });
    });
    describe(".max(source)", function () {
        describe("a", function () {
            procedureShouldBe(a, maxA, ArrayProcedure.max);
        });
        describe("b", function () {
            procedureShouldBe(b, maxB, ArrayProcedure.max);
        });
        it("should be NaN", function () {
            assert.ok(isNaN(ArrayProcedure.max(null)));
            assert.ok(isNaN(ArrayProcedure.max([NaN], true)));
        });
    });
});
//# sourceMappingURL=Procedure.js.map