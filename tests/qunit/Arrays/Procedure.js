define(["require", "exports", "source/System/Collections/Array/Procedure", "QUnit"], function (require, exports, ArrayProcedure) {
    "use strict";
    function run() {
        var minA = -10, maxA = 2000, minB = -Infinity, maxB = Infinity;
        var a = [5, minA, -1, maxA, -2, NaN, 20], sum = 5 + minA + -1 + maxA + -2 + 20, average = sum / 6, product = 5 * minA * -1 * maxA * -2 * 20;
        var b = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20];
        QUnit.test("Array/Procedure.sum", function (assert) {
            assert.ok(isNaN(ArrayProcedure.sum(a, false)), "Sum should be NaN");
            assert.equal(ArrayProcedure.sum(a, true), sum, "Sum should be " + sum);
        });
        QUnit.test("Array/Procedure.average", function (assert) {
            assert.ok(isNaN(ArrayProcedure.average(a, false)), "Average should be NaN");
            assert.equal(ArrayProcedure.average(a, true), average, "Average should be " + average);
        });
        QUnit.test("Array/Procedure.product", function (assert) {
            assert.ok(isNaN(ArrayProcedure.product(a, false)), "Product should be NaN");
            assert.equal(ArrayProcedure.product(a, true), product, "Product should be " + product);
        });
        QUnit.test("Array/Procedure.min", function (assert) {
            assert.ok(isNaN(ArrayProcedure.min(a, false)), "Min value should be NaN");
            assert.equal(ArrayProcedure.min(a, true), minA, "Min value should be " + minA);
            assert.equal(ArrayProcedure.min(b, true), minB, "Min value should be " + minB);
        });
        QUnit.test("Array/Procedure.max", function (assert) {
            assert.ok(isNaN(ArrayProcedure.max(a, false)), "Min value should be NaN");
            assert.equal(ArrayProcedure.max(a, true), maxA, "Min value should be " + maxA);
            assert.equal(ArrayProcedure.max(b, true), maxB, "Min value should be " + maxB);
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=Procedure.js.map