///<reference path="../../typings/qunit/qunit.d.ts"/>
///<amd-dependency path="QUnit"/>

import ArrayCompare = require('../../source/System/Collections/Array/Compare');
import ArrayUtility = require('../../source/System/Collections/Array/Utility');

function run() {
    // Min/Max tests...
    var minA = -10, maxA = 2000;

    var a = [5, minA, -1, maxA, -2, NaN, 20];

    QUnit.test("Array/Utility.initialize", function (assert) {
        var len:number;

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

        assert.ok(ArrayCompare.areEqual(s1, s2));
    });

    QUnit.test("Array/Utility.contains", function (assert) {
        assert.ok(ArrayUtility.contains(a, -1));
        assert.ok(!ArrayUtility.contains(a, -9876));
    });

    QUnit.test("Array/Utility.findIndex", function (assert) {
        assert.equal(ArrayUtility.findIndex(a, function (v:number) {
            return v == -1;
        }), 2);
        assert.equal(ArrayUtility.findIndex(a, function (v:number) {
            return v == -9876;
        }), -1);
    });

    QUnit.test("Array/Utility.register", function (assert) {
        var s = ArrayUtility.copy(a), len = s.length;
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

    /*	Utility.applyTo skipped.
     It has too many permutations while being a straight forward function. */

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
        for (var i = 0; i < count; i++)
            assert.equal(r[i], value);
    });


}

export = run;
