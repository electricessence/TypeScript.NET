(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../source/System/Collections/Array/Utility", "../../../source/System.Linq/Linq"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Utility_1 = require("../../../source/System/Collections/Array/Utility");
    var Linq_1 = require("../../../source/System.Linq/Linq");
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
    var sourceArrayEnumerable = Linq_1.default.fromArray(source), sourceEnumerable = new Linq_1.default(function () { return sourceArrayEnumerable.getEnumerator(); });
    describe(".memoize()", function () {
        it("should cache the values as it goes for reuse later", function () {
            var source = sourceArrayEnumerable;
            var A = source.memoize();
            var sum = A.sum(function (o) { return o.a; });
            assert.equal(sum, source.sum(function (o) { return o.a; }), "Values must be equal after memoize pass 1.");
            sum = A.sum(function (o) { return o.b; });
            assert.equal(sum, source.sum(function (o) { return o.b; }), "Values must be equal after memoize pass 2.");
        });
    });
    describe(".where(predicate).memoize()", function () {
        it("should cache the values as it goes for reuse later", function () {
            var source = sourceArrayEnumerable.where(function (i) { return i.a == 1; });
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
    });
    describe(".orderBy(selector)", function () {
        it("should order ascending based upon the selector", function () {
            var source = sourceArrayEnumerable.reverse();
            assert.equal(source.first().c, "f");
        });
    });
    describe(".orderBy(selector)", function () {
        it("should order ascending based upon the selector", function () {
            var source = sourceArrayEnumerable.reverse();
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
    });
    describe(".orderByDescending(selector)", function () {
        it("should order descending based upon the selector", function () {
            var source = sourceArrayEnumerable.reverse();
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
    });
    describe(".orderBy(selector).thenBy(selector)", function () {
        it("should order by one then the other", function () {
            var B = sourceArrayEnumerable
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
    });
    describe(".groupBy(selector)", function () {
        it("should group by key provided by the selector", function () {
            var A_distinct = sourceArrayEnumerable
                .select(function (o) { return o.a; }).distinct();
            var A = sourceArrayEnumerable
                .groupBy(function (o) { return o.a; });
            assert.equal(A_distinct.count(), A.count(), "Number of groups should match distinct values.");
            var B = sourceArrayEnumerable
                .groupBy(function (o) { return o.b; });
            var B_distinct = sourceArrayEnumerable
                .select(function (o) { return o.b; }).distinct();
            assert.equal(B_distinct.count(), B.count(), "Number of groups should match distinct values.");
            var COMPANY_A = "Microsoft", COMPANY_B = "Hell Corp.";
            var objArray = [
                { Name: "John", Id: 0, Salary: 1300.00, Company: COMPANY_A },
                { Name: "Peter", Id: 1, Salary: 4800.50, Company: COMPANY_A },
                { Name: "Sandra", Id: 2, Salary: 999.99, Company: COMPANY_A },
                { Name: "Me", Id: 3, Salary: 1000000000.00, Company: COMPANY_B }
            ];
            var groups = Linq_1.default.from(objArray).groupBy(function (x) { return x.Company; });
            var companies = groups.select(function (x) { return x.key; }).toArray();
            assert.equal(companies.length, 2, "2 groups expected.");
            assert.ok(Utility_1.contains(companies, COMPANY_A), "Expect " + COMPANY_A);
            assert.ok(Utility_1.contains(companies, COMPANY_B), "Expect " + COMPANY_B);
            var group_A = groups.where(function (g) { return g.key == COMPANY_A; }).single();
            var group_B = groups.where(function (g) { return g.key == COMPANY_B; }).single();
            assert.equal(group_A.count(), 3, "Expected count of 3.");
            assert.equal(group_A.sum(function (x) { return x.Salary; }), 7100.49, "Expected sum to be correct.");
            assert.equal(group_B.count(), 1, "Expected count of 1.");
            assert.equal(group_B.sum(function (x) { return x.Salary; }), 1000000000.00, "Expected sum to be correct.");
        });
    });
    describe(".take(count)", function () {
        it("count should match number taken", function () {
            var e = sourceArrayEnumerable.take(2);
            assert.equal(e.count(), 2);
        });
    });
    describe(".takeWhile(predicate)", function () {
        it("should take while predicate returns true", function () {
            var e = sourceArrayEnumerable.takeWhile(function (v) { return v.a == 1; });
            assert.equal(e.count(), 3, "count should match number taken");
        });
    });
    describe(".takeUntil(predicate,includeUntil)", function () {
        it("should take until predicate returns true", function () {
            var e = sourceArrayEnumerable.takeUntil(function (v) { return v.a == 2; });
            assert.equal(e.count(), 3, "count should match number taken");
        });
        it("should take until predicate returns true and include value matched", function () {
            var e = sourceArrayEnumerable.takeUntil(function (v) { return v.a == 2; }, true);
            assert.equal(e.count(), 4, "count should match number taken");
            assert.equal(e.last().c, "d");
        });
    });
    describe(".takeExceptLast(count)", function () {
        it("should take the first ones minus the last", function () {
            var test = function (s) {
                var e = s.takeExceptLast(2);
                assert.equal(e.count(), 4);
                assert.equal(e.count(), 4, "count should match number taken");
                assert.equal(e.last().c, "d");
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
    describe(".skipToLast(count)", function () {
        it("should take the last items based on the count", function () {
            var test = function (s) {
                var e = s.skipToLast(2);
                assert.equal(e.count(), 2, "count should match number taken");
                assert.equal(e.first().c, "e");
                assert.equal(e.last().c, "f");
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
    describe(".skip(count)", function () {
        it("count should match total less skipped", function () {
            var test = function (s) {
                var e = s.skip(2);
                assert.equal(e.count(), 4);
                assert.equal(e.first().c, "c");
                assert.equal(e.last().c, "f");
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
    describe(".skipWhile(predicate)", function () {
        it("should skip while predicate returns true", function () {
            var e = sourceArrayEnumerable.skipWhile(function (v) { return v.a == 1; });
            assert.equal(e.count(), 3, "count should match number taken");
            assert.equal(e.first().c, "d");
            assert.equal(e.last().c, "f");
        });
    });
    describe(".select(selector)", function () {
        it("should use appropriate selection mechanism", function () {
            var test = function (s) {
                var e = s.select(function (e) { return e.c; });
                assert.equal(e.count(), 6);
                assert.equal(e.first(), "a");
                assert.equal(e.last(), "f");
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
        it("should use appropriate selection mechanism", function () {
            var test = function (s) {
                var e = s.select(function (e, i) { return i; });
                assert.equal(e.count(), 6);
                assert.equal(e.first(), 0);
                assert.equal(e.last(), 5);
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
    describe(".shuffle()", function () {
        it("should randomize the enumerable", function () {
            var e = sourceArrayEnumerable.shuffle();
            assert.equal(e.count(function (v) { return v.a == 1; }), 3);
        });
    });
    describe(".every(predicate)", function () {
        it("should determine if every element matches the criteria", function () {
            var test = function (s) {
                assert.ok(!s.every(function (v) { return v.a == 1; }));
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
    describe(".any(predicate)", function () {
        it("should determine if every element matches the criteria", function () {
            var test = function (s) {
                assert.ok(s.some(function (v) { return v.a == 1; }));
                assert.ok(!s.isEmpty());
            };
            test(sourceArrayEnumerable);
            test(sourceEnumerable);
        });
    });
});
//# sourceMappingURL=Enumerable.js.map