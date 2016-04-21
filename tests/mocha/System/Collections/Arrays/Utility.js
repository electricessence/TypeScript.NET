(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../../source/System/Collections/Array/Compare", "../../../../../source/System/Collections/Array/Utility", "../../../../../source/System/Diagnostics/Stopwatch"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Arrays = require("../../../../../source/System/Collections/Array/Compare");
    var ArrayUtility = require("../../../../../source/System/Collections/Array/Utility");
    var Stopwatch_1 = require("../../../../../source/System/Diagnostics/Stopwatch");
    var assert = require('../../../../../node_modules/assert/assert');
    var minA = -10, maxA = 2000;
    function initTestArray() {
        return [5, minA, -1, maxA, -2, NaN, 20];
    }
    describe(".initialize(length)", function () {
        function testLength(len) {
            it("should be length " + len, function () {
                len = 100;
                var a = ArrayUtility.initialize(len);
                assert.equal(a.length, len, ".length should be " + len);
            });
        }
        testLength(100);
        testLength(100000);
    });
    describe(".copy(source) & .equals(old,new)", function () {
        it("should equal", function () {
            var s1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
            var s2 = ArrayUtility.copy(s1);
            assert.ok(Arrays.areEqual(s1, s2));
        });
    });
    describe(".contains(source,value)", function () {
        var a = initTestArray();
        it("should return true for a value contained", function () {
            assert.ok(ArrayUtility.contains(a, -1));
        });
        it("should return false for a value that is not present", function () {
            assert.ok(!ArrayUtility.contains(a, -9876));
        });
    });
    describe(".findIndex(source,of)", function () {
        var a = initTestArray();
        it("should find and return the correct index", function () {
            assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -1; }), 2);
        });
        it("should return -1 when the value is not present", function () {
            assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -9876; }), -1);
        });
    });
    describe(".register(target,value)", function () {
        it("should add a value that isn't present", function () {
            var a = initTestArray();
            var len = a.length;
            assert.ok(ArrayUtility.register(a, -9876));
            assert.equal(a.length, len + 1);
        });
        it("should not add a value that is present", function () {
            var a = initTestArray();
            var len = a.length;
            assert.ok(!ArrayUtility.register(a, -1));
            assert.equal(a.length, len);
        });
    });
    describe(".remove(target,value)", function () {
        it("should remove the item/value request and return the number of instances removed", function () {
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
    });
    describe(".repeat(value,count)", function () {
        it("should correctly repeat the value requested", function () {
            var value = 10, count = 3;
            var r = ArrayUtility.repeat(value, count);
            assert.ok(r.length == count, ".length should be 3");
            for (var i = 0; i < count; i++) {
                assert.equal(r[i], value);
            }
        });
    });
    function measureRepeated(closure) {
        var repeat = 50;
        var ms = 0;
        for (var i = 0; i < repeat; i++) {
            ms += Stopwatch_1.default.measure(closure).total.milliseconds;
        }
        return ms;
    }
    function outputMeasured(suffix, closure) {
        it(measureRepeated(closure) + " milliseconds: " + suffix, function () {
            assert.ok(true);
        });
    }
});

//# sourceMappingURL=Utility.js.map
