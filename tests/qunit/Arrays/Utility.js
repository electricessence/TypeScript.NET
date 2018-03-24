(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "QUnit"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        // Min/Max tests...
        var minA = -10, maxA = 2000;
        var a = [5, minA, -1, maxA, -2, NaN, 20];
        QUnit.test("Array/Utility.initialize", function (assert) {
            var len;
            len = 100;
            var a = initArray(len);
            assert.equal(a.length, len, ".length should be " + len);
            len = 100000;
            var b = initArray(len);
            assert.equal(b.length, len, ".length should be " + len);
        });
        QUnit.test("Array/Utility.arrayCopy/equals", function (assert) {
            var s1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
            var s2 = copyArray(s1);
            assert.ok(areArraysEqual(s1, s2));
        });
        QUnit.test("Array/Utility.contains", function (assert) {
            assert.ok(containsElement(a, -1));
            assert.ok(!containsElement(a, -9876));
        });
        QUnit.test("Array/Utility.findIndex", function (assert) {
            assert.equal(findElementIndex(a, function (v) { return v == -1; }), 2);
            assert.equal(findElementIndex(a, function (v) { return v == -9876; }), -1);
        });
        QUnit.test("Array/Utility.register", function (assert) {
            var s = copyArray(a);
            var len = s.length;
            assert.ok(registerElement(s, -9876));
            assert.equal(s.length, len + 1);
            len = s.length;
            assert.ok(!registerElement(s, -1));
            assert.equal(s.length, len);
        });
        /*	Utility.applyTo skipped.
         It has too many permutations while being a straight forward function. */
        QUnit.test("Array/Utility.remove", function (assert) {
            var s = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
            var len = s.length;
            assert.equal(removeElement(s, 9), 1, "Only 9 removed once");
            assert.equal(s.length, len - 1, ".length should be less by one");
            assert.equal(s[1], 8, "Index [1] is now 8");
            len = s.length;
            assert.equal(removeElement(s, 2), 2, "2 removed twice");
            assert.equal(s.length, len - 2, ".length should be less by two");
            assert.equal(s[7], 1, "Index [7] is now 1");
            assert.equal(s[10], 3, "Index [10] is now 3");
            len = s.length;
            assert.equal(removeElement(s, 15), 0, "15 does not exist");
            assert.equal(s.length, len, ".length should be the same");
            len = s.length;
            assert.ok(removeElementByIndex(s, 5), "Index [5] removed");
            assert.equal(s.length, len - 1, ".length should be less by one");
            len = s.length;
            assert.ok(!removeElementByIndex(s, 15), "Index [15] doesn't exist");
            assert.equal(s.length, len, ".length should be the same");
        });
        QUnit.test("Array/Utility.repeat", function (assert) {
            var value = 10, count = 3;
            var r = repeatElement(value, count);
            assert.ok(r.length == count, ".length should be 3");
            for (var i = 0; i < count; i++) {
                assert.equal(r[i], value);
            }
        });
    }
    exports.default = run;
});
//# sourceMappingURL=Utility.js.map