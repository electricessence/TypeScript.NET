(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ICollection", "../../../../dist/commonjs/System/Collections/Set"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ICollectionTests = require("./ICollection");
    var Set_1 = require("../../../../dist/commonjs/System/Collections/Set");
    var assert = require('../../../../node_modules/assert/assert');
    ICollectionTests.Collection('Set<' + 'string>', new Set_1.default(), [
        "",
        "lorem",
        "ipsum",
        "dolem"
    ]);
    ICollectionTests.Collection('Set<' + 'number>', new Set_1.default(), [
        0,
        1,
        2,
        3,
        5,
        7,
        11,
        13
    ]);
    ICollectionTests.Collection('Set<' + 'Primitive>', new Set_1.default(), [
        0,
        1,
        2,
        3,
        5,
        7,
        11,
        13,
        "",
        "0",
        "1",
        "2",
        "3",
        "5",
        "7",
        "11",
        "13",
        true,
        false
    ]);
    var sourcePrimitives = [
        1, 2, 1, "1", true, false, "hello", "hello", "hi", true
    ];
    var subset = sourcePrimitives.slice(4);
    var superset = sourcePrimitives.slice();
    superset.push("NO");
    var otherWithIntersect = [1, "1", 4000, "goodbye"];
    it("should not repeat entries", function () {
        var s = new Set_1.default(sourcePrimitives);
        assert.equal(s.count, 7);
    });
    describe(".setEquals()", function () {
        it("the current set should equal to the same set and not equal for different sets", function () {
            var s = new Set_1.default(sourcePrimitives);
            var v = sourcePrimitives.slice();
            v[8] = "hola";
            assert.equal(s.setEquals(sourcePrimitives), true, "Exact same set should be equal.");
            assert.equal(s.setEquals(subset), false, "Smaller set should not be equal.");
            assert.equal(s.setEquals(superset), false, "Larger set should not be a equal.");
            assert.equal(s.setEquals(v), false, "Similar set should not be a equal.");
        });
    });
    describe(".isSupersetOf()", function () {
        it("the current set should be a super set of any equal or smaller set", function () {
            var s = new Set_1.default(sourcePrimitives);
            assert.equal(s.isSupersetOf(sourcePrimitives), true, "Exact same set should be a superset and subset.");
            assert.equal(s.isSupersetOf(subset), true, "Smaller set should be a subset.");
            assert.equal(s.isSupersetOf(superset), false, "Larger set should not be a subset.");
        });
    });
    describe(".isProperSupersetOf()", function () {
        it("the current set should be a super set of any smaller matching set", function () {
            var s = new Set_1.default(sourcePrimitives);
            assert.equal(s.isProperSupersetOf(sourcePrimitives), false, "Exact same set should not be a proper superset or subset.");
            assert.equal(s.isProperSupersetOf(subset), true, "Smaller set should be a subset.");
            assert.equal(s.isProperSupersetOf(superset), false, "Larger set should not be a subset.");
        });
    });
    describe(".isSubsetOf()", function () {
        it("the current set should be a sub set of any equal or larger matching set", function () {
            var s = new Set_1.default(sourcePrimitives);
            assert.equal(s.isSubsetOf(sourcePrimitives), true, "Exact same set should be a superset and subset.");
            assert.equal(s.isSubsetOf(subset), false, "Smaller set should be a subset.");
            assert.equal(s.isSubsetOf(superset), true, "Larger set should be a superset.");
        });
    });
    describe(".isProperSubsetOf()", function () {
        it("the current set should be a sub set of any larger matching set", function () {
            var s = new Set_1.default(sourcePrimitives);
            assert.equal(s.isProperSubsetOf(sourcePrimitives), false, "Exact same set should not be a proper superset or subset.");
            assert.equal(s.isProperSubsetOf(subset), false, "Smaller set should be a subset.");
            assert.equal(s.isProperSubsetOf(superset), true, "Larger set should be a superset.");
        });
    });
    describe(".exceptWith()", function () {
        it("should remove the specified items fromt the set", function () {
            var s = new Set_1.default(sourcePrimitives);
            s.exceptWith([1, "1"]);
            assert.equal(s.count, 5);
            assert.equal(s.contains(1), false);
            assert.equal(s.contains("1"), false);
            assert.equal(s.contains("hello"), true);
        });
    });
    describe(".intersectWith()", function () {
        it("should only leave the intersecting items behind", function () {
            var s = new Set_1.default(sourcePrimitives);
            s.intersectWith(otherWithIntersect);
            assert.equal(s.count, 2);
            assert.equal(s.contains(1), true);
            assert.equal(s.contains("1"), true);
            assert.equal(s.contains("hello"), false);
        });
    });
    describe(".unionWith()", function () {
        it("should only leave the intersecting items behind", function () {
            var s = new Set_1.default(sourcePrimitives);
            var c = s.count;
            s.unionWith(otherWithIntersect);
            assert.equal(s.count, c + 2);
            assert.equal(s.contains(4000), true);
            assert.equal(s.contains("goodbye"), true);
        });
    });
    describe(".symmetricExceptWith()", function () {
        it("should only leave unique items behind", function () {
            var s = new Set_1.default(sourcePrimitives);
            var c = s.count;
            s.symmetricExceptWith(otherWithIntersect);
            assert.equal(s.count, c - 2 + 2);
            assert.equal(s.contains(4000), true);
            assert.equal(s.contains("goodbye"), true);
            assert.equal(s.contains(1), false);
            assert.equal(s.contains("1"), false);
        });
    });
});
//# sourceMappingURL=Set.js.map