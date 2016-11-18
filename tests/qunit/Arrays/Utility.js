(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "QUnit", "../../../dist/amd/System/Collections/Array/Compare", "../../../dist/amd/System/Collections/Array/Utility"], function (require, exports) {
    "use strict";
    var Arrays = require("../../../dist/amd/System/Collections/Array/Compare");
    var ArrayUtility = require("../../../dist/amd/System/Collections/Array/Utility");
    function run() {
        var minA = -10, maxA = 2000;
        var a = [5, minA, -1, maxA, -2, NaN, 20];
        QUnit.test("Array/Utility.initialize", function (assert) {
            var len;
            len = 100;
            var a = ArrayUtility.initialize(len);
            assert.equal(a.length, len, ".length should be " + len);
            len = 100000;
            var b = ArrayUtility.initialize(len);
            assert.equal(b.length, len, ".length should be " + len);
        });
        QUnit.test("Array/Utility.copy/equals", function (assert) {
            var s1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
            var s2 = ArrayUtility.copy(s1);
            assert.ok(Arrays.areEqual(s1, s2));
        });
        QUnit.test("Array/Utility.contains", function (assert) {
            assert.ok(ArrayUtility.contains(a, -1));
            assert.ok(!ArrayUtility.contains(a, -9876));
        });
        QUnit.test("Array/Utility.findIndex", function (assert) {
            assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -1; }), 2);
            assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -9876; }), -1);
        });
        QUnit.test("Array/Utility.register", function (assert) {
            var s = ArrayUtility.copy(a);
            var len = s.length;
            assert.ok(ArrayUtility.register(s, -9876));
            assert.equal(s.length, len + 1);
            len = s.length;
            assert.ok(!ArrayUtility.register(s, -1));
            assert.equal(s.length, len);
        });
        QUnit.test("Array/Utility.remove", function (assert) {
            var s = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
            var len = s.length;
            assert.equal(ArrayUtility.remove(s, 9), 1, "Only 9 removed once");
            assert.equal(s.length, len - 1, ".length should be less by one");
            assert.equal(s[1], 8, "Index [1] is now 8");
            len = s.length;
            assert.equal(ArrayUtility.remove(s, 2), 2, "2 removed twice");
            assert.equal(s.length, len - 2, ".length should be less by two");
            assert.equal(s[7], 1, "Index [7] is now 1");
            assert.equal(s[10], 3, "Index [10] is now 3");
            len = s.length;
            assert.equal(ArrayUtility.remove(s, 15), 0, "15 does not exist");
            assert.equal(s.length, len, ".length should be the same");
            len = s.length;
            assert.ok(ArrayUtility.removeIndex(s, 5), "Index [5] removed");
            assert.equal(s.length, len - 1, ".length should be less by one");
            len = s.length;
            assert.ok(!ArrayUtility.removeIndex(s, 15), "Index [15] doesn't exist");
            assert.equal(s.length, len, ".length should be the same");
        });
        QUnit.test("Array/Utility.repeat", function (assert) {
            var value = 10, count = 3;
            var r = ArrayUtility.repeat(value, count);
            assert.ok(r.length == count, ".length should be 3");
            for (var i = 0; i < count; i++) {
                assert.equal(r[i], value);
            }
        });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = run;
});
//# sourceMappingURL=Utility.js.map