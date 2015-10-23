///<reference path="../import.d.ts"/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../../../source/System.Linq/Linq'], function (require, exports) {
    var Linq_1 = require('../../../source/System.Linq/Linq');
    var assert = require('../../../node_modules/assert/assert');
    var source = Object.freeze([
        {
            a: 1,
            b: 2,
            c: "a"
        },
        {
            a: 1,
            b: 1,
            c: "b"
        },
        {
            a: 1,
            b: 3,
            c: "c"
        },
        {
            a: 2,
            b: 2,
            c: "d"
        },
        {
            a: 2,
            b: 1,
            c: "e"
        },
        {
            a: 2,
            b: 3,
            c: "f"
        }
    ]);
    var sourceEnumerable = Linq_1.default.fromArray(source);
    it(".memoize()", function () {
        var source = sourceEnumerable;
        var A = source.memoize();
        var sum = A.sum(function (o) { return o.a; });
        assert.equal(sum, source.sum(function (o) { return o.a; }), "Values must be equal after memoize pass 1.");
        sum = A.sum(function (o) { return o.b; });
        assert.equal(sum, source.sum(function (o) { return o.b; }), "Values must be equal after memoize pass 2.");
    });
    it(".where(predicate).memoize()", function () {
        var source = sourceEnumerable.where(function (i) { return i.a == 1; });
        var sum, A = source;
        sum = A.sum(function (o) { return o.a; });
        assert.equal(sum, source.sum(function (o) { return o.a; }), "Values must be equal after where pass 1.");
        sum = A.sum(function (o) { return o.b; });
        assert.equal(sum, source.sum(function (o) { return o.b; }), "Values must be equal after where pass 2.");
        A = source.memoize();
        sum = A.sum(function (o) { return o.a; });
        assert.equal(sum, source.sum(function (o) { return o.a; }), "Values must be equal after memoize pass 1.");
        sum = A.sum(function (o) { return o.b; });
        assert.equal(sum, source.sum(function (o) { return o.b; }), "Values must be equal after memoize pass 2.");
    });
    it(".orderBy(selector)", function () {
        var source = sourceEnumerable.reverse();
        var A = source.orderBy(function (o) { return o.a; }).toArray();
        for (var i = 0; i < 3; i++) {
            assert.equal(A[i].a, 1, "First three 'a' values should be 1 when ordered by 'a'.");
        }
        for (var i = 3; i < 6; i++) {
            assert.equal(A[i].a, 2, "Last three 'a' values should be 2 when ordered by 'a'.");
        }
        var B = source.orderBy(function (o) { return o.b; }).toArray();
        for (var i = 0; i < 2; i++) {
            assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
        }
        for (var i = 2; i < 4; i++) {
            assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
        }
        for (var i = 4; i < 6; i++) {
            assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");
        }
    });
    it(".orderByDescending(selector)", function () {
        var source = sourceEnumerable.reverse();
        var A = source.orderByDescending(function (o) { return o.a; }).toArray();
        for (var i = 0; i < 3; i++) {
            assert.equal(A[i].a, 2, "First three 'a' values should be 2 when ordered by 'a'.");
        }
        for (var i = 3; i < 6; i++) {
            assert.equal(A[i].a, 1, "Last three 'a' values should be 1 when ordered by 'a'.");
        }
        var B = source.orderByDescending(function (o) { return o.b; }).toArray();
        for (var i = 0; i < 2; i++) {
            assert.equal(B[i].b, 3, "First two 'b' values should be 3 when ordered by 'b'.");
        }
        for (var i = 2; i < 4; i++) {
            assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
        }
        for (var i = 4; i < 6; i++) {
            assert.equal(B[i].b, 1, "Last two 'b' values should be 1 when ordered by 'b'.");
        }
    });
    it(".orderBy(selector).thenBy(selector)", function () {
        var B = sourceEnumerable
            .orderBy(function (o) { return o.b; })
            .thenBy(function (o) { return o.c; })
            .toArray();
        for (var i = 0; i < 2; i++) {
            assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
        }
        for (var i = 2; i < 4; i++) {
            assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
        }
        for (var i = 4; i < 6; i++) {
            assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");
        }
        assert.equal(B[0].c, "b");
        assert.equal(B[1].c, "e");
        assert.equal(B[2].c, "a");
        assert.equal(B[3].c, "d");
        assert.equal(B[4].c, "c");
        assert.equal(B[5].c, "f");
    });
    it(".groupBy(selector)", function () {
        var A_distinct = sourceEnumerable
            .select(function (o) { return o.a; }).distinct();
        var A = sourceEnumerable
            .groupBy(function (o) { return o.a; });
        assert.equal(A_distinct.count(), A.count(), "Number of groups should match distinct values.");
        var B = sourceEnumerable
            .groupBy(function (o) { return o.b; });
        var B_distinct = sourceEnumerable
            .select(function (o) { return o.b; }).distinct();
        assert.equal(B_distinct.count(), B.count(), "Number of groups should match distinct values.");
    });
});

//# sourceMappingURL=Enumerable.js.map
