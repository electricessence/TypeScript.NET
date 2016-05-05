(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../source/System/Collections/Array/Utility", "../../../source/System/Collections/Array/Procedure", "../../../source/System.Linq/Linq", "../../../source/System/Functions", "../../../source/System/Collections/Enumeration/Enumerator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Utility_1 = require("../../../source/System/Collections/Array/Utility");
    var Procedure = require("../../../source/System/Collections/Array/Procedure");
    var Linq_1 = require("../../../source/System.Linq/Linq");
    var Functions_1 = require("../../../source/System/Functions");
    var Enumerator_1 = require("../../../source/System/Collections/Enumeration/Enumerator");
    var assert = require('../../../node_modules/assert/assert');
    var source = Object.freeze([
        {
            a: 1,
            b: 2,
            c: "a",
            children: [
                {
                    a: 1,
                    b: 2,
                    c: "a",
                    children: [
                        {
                            a: 1,
                            b: 2,
                            c: "a",
                            children: []
                        },
                        {
                            a: 1,
                            b: 1,
                            c: "b",
                        },
                        {
                            a: 1,
                            b: 3,
                            c: "c"
                        }
                    ]
                },
                {
                    a: 1,
                    b: 1,
                    c: "b",
                },
                {
                    a: 1,
                    b: 3,
                    c: "c"
                }
            ]
        },
        {
            a: 1,
            b: 1,
            c: "b",
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
    var sourceMany = Linq_1.default.from(Object.freeze([
        "a,b,c,d,e",
        null,
        "f,g,h,i,j",
        "k,l,m,n,o",
        "p,q,r,s,t",
        "u,v,w,x,y",
    ]));
    var sourceManyFlat = "abcdefghijklmnopqrstuvwxy";
    var sourceArrayEnumerable = Linq_1.default.from(source), sourceEnumerable = new Linq_1.default(function () { return sourceArrayEnumerable.getEnumerator(); });
    describe(".force()", function () {
        it("should not throw", function () {
            assert.doesNotThrow(function () { sourceEnumerable.force(); });
        });
    });
    describe(".count()", function () {
        it("should match count to length", function () {
            assert.equal(sourceArrayEnumerable.count(), source.length);
            assert.equal(sourceEnumerable.count(), source.length);
            assert.equal(Linq_1.default.from([]).count(), 0);
            assert.equal(Linq_1.default.empty().count(), 0);
            assert.equal(sourceArrayEnumerable.count(function (e) { return e.a === 1; }), 3);
        });
    });
    describe(".source", function () {
        it("should equal the original", function () {
            assert.equal(source, (sourceArrayEnumerable).source);
        });
    });
    describe(".memoize()", function () {
        it("should cache the values as it goes for reuse later", function () {
            var source = sourceEnumerable;
            var A = source.memoize();
            source.memoize().dispose();
            var sum = A.sum(function (o) { return o.a; });
            assert.equal(sum, source.sum(function (o) { return o.a; }), "Values must be equal after memoize pass 1.");
            sum = A.sum(function (o) { return o.b; });
            assert.equal(sum, source.sum(function (o) { return o.b; }), "Values must be equal after memoize pass 2.");
            A.dispose();
            assert.throws(function () {
                A.force();
            });
            A = sourceArrayEnumerable.memoize();
            A.dispose();
            assert.throws(function () {
                A.force();
            });
        });
    });
    describe(".choose(predicate)", function () {
        it("should filter out null and undefined values.", function () {
            var other = [null, void (0)];
            assert.equal(sourceArrayEnumerable
                .concat(other)
                .choose()
                .select(function (s) { return s.a; })
                .where(function (s) { return s === 1; })
                .count(), 3);
            assert.equal(sourceArrayEnumerable
                .concat(other)
                .choose(function (e, i) {
                return (i % 2 ? e : null);
            })
                .count(), 3);
            sourceArrayEnumerable
                .concat(other)
                .choose()
                .dispose();
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
            source.dispose();
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
    describe(".select(b)", function () {
        var b = sourceArrayEnumerable.select(function (e) { return e.b; });
        describe(".distinct()", function () {
            var d = b.distinct();
            describe(".orderBy()", function () {
                it("should be 1,2,3", function () {
                    var s = d.orderBy();
                    assert.equal(s.count(), 3);
                    assert.equal(s.sum(), 6);
                    assert.equal(s.elementAt(0), 1);
                    assert.equal(s.elementAt(1), 2);
                    assert.equal(s.elementAt(2), 3);
                });
            });
            describe(".orderByDescending()", function () {
                it("should be 1,2,3", function () {
                    var s = d.orderByDescending();
                    assert.equal(s.count(), 3);
                    assert.equal(s.sum(), 6);
                    assert.equal(s.elementAt(0), 3);
                    assert.equal(s.elementAt(1), 2);
                    assert.equal(s.elementAt(2), 1);
                });
            });
        });
        describe(".distinctUntilChanged()", function () {
            it("should be as expected", function () {
                assert.equal(b.distinctUntilChanged().toJoinedString(), "213213");
                assert.equal(b.distinctUntilChanged(function (v) { return Math.max(v, 2); }).toJoinedString(), "2323");
                assert.equal(b.distinctUntilChanged(function (v) { return Math.min(v, 2); }).toJoinedString(), "21313");
                assert.equal(b.orderBy().distinctUntilChanged().toJoinedString(), "123");
            });
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
            var C = sourceArrayEnumerable
                .groupBy(function (o) { return o.b; }, null, Functions_1.default.Identity);
            var D = sourceArrayEnumerable
                .groupBy(function (o) { return o.b; }, Functions_1.default.Identity, Functions_1.default.Identity);
            assert.ok(B.first().sequenceEqual(C.first()));
            assert.ok(C.first().sequenceEqual(D.first()));
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
                var e = s.takeExceptLast();
                assert.equal(e.count(), 5);
                assert.equal(e.count(), 5, "count should match number taken");
                assert.equal(e.last().c, "e");
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
                e = s.skipToLast(0);
                assert.equal(e.count(), 0);
                e = s.skipToLast(Infinity);
                assert.equal(e.count(), 6);
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
            assert.equal(sourceArrayEnumerable.skip(0), sourceArrayEnumerable);
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
            e.dispose();
            assert.throws(function () { return e.count(); });
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
    describe(".empty()", function () {
        var source = Linq_1.default.empty();
        describe(".singleOrDefault()", function () {
            it("should be defaulted", function () {
                assert.equal(source.singleOrDefault(), null);
                assert.equal(source.singleOrDefault(-1), -1);
            });
        });
        describe(".single()", function () {
            it("should throw", function () {
                assert.throws(function () {
                    source.single();
                });
            });
        });
        describe(".first()", function () {
            it("should throw", function () {
                assert.throws(function () {
                    source.first();
                });
            });
        });
        describe(".firstOrDefault()", function () {
            it("should be defaulted", function () {
                assert.equal(source.firstOrDefault(), null);
            });
        });
        describe(".last()", function () {
            it("should throw", function () {
                assert.throws(function () {
                    source.last();
                });
            });
        });
        describe(".lastOrDefault()", function () {
            it("should be defaulted", function () {
                assert.equal(source.lastOrDefault(), null);
                var d = 1;
                assert.equal(source.lastOrDefault(d), d);
            });
        });
    });
    describe(".last()", function () {
        it("should match last", function () {
            assert.equal(sourceArrayEnumerable.last().c, "f");
        });
        it("should throw", function () {
            assert.throws(function () { return Linq_1.default.from([]).last(); });
        });
    });
    describe(".lastOrDefault()", function () {
        it("should match last", function () {
            assert.equal(sourceArrayEnumerable.lastOrDefault().c, "f");
        });
        it("should be defaulted", function () {
            assert.equal(Linq_1.default.from([]).lastOrDefault("f"), "f");
        });
    });
    describe(".from(x)", function () {
        it("should throw if not enumerable", function () {
            assert.throws(function () { return Linq_1.default.from(1); });
        });
    });
    describe(".fromAny(x,default)", function () {
        it("should return the default if not enumerable", function () {
            assert.equal(Linq_1.default.fromAny(1, "x"), "x");
        });
    });
    describe(".fromAny(x,default)", function () {
        it("should return an enumerable from an enumerable", function () {
            assert.ok(Linq_1.default.fromAny(sourceArrayEnumerable) instanceof Linq_1.default);
        });
        it("should return an enumerable from an array", function () {
            assert.ok(Linq_1.default.fromAny(source) instanceof Linq_1.default);
        });
        it("should return an enumerable from an IEnumerable", function () {
            var e = Linq_1.default.fromAny({ getEnumerator: function () { return Enumerator_1.empty; } });
            e.getEnumerator();
            assert.ok(e instanceof Linq_1.default);
        });
    });
    describe(".from([1])", function () {
        var source = new Linq_1.default(function () { return Linq_1.default.from([1]).getEnumerator(); });
        describe(".singleOrDefault()", function () {
            it("should return single value", function () {
                assert.equal(source.single(), 1);
            });
        });
        describe(".singleOrDefault()", function () {
            it("should return single value", function () {
                assert.equal(source.singleOrDefault(), 1);
            });
        });
        describe(".elementAt(x)", function () {
            it("should throw if no more", function () {
                assert.throws(function () { return source.elementAt(2); });
            });
        });
        describe(".elementAtOrDefault (x)", function () {
            it("should be defaulted", function () {
                assert.equal(source.elementAtOrDefault(2, -1), -1);
                assert.equal(source.elementAtOrDefault(2), null);
            });
            it("should throw", function () {
                assert.throws(function () { source.elementAtOrDefault(NaN); });
                assert.throws(function () { source.elementAtOrDefault(-1); });
                assert.throws(function () { source.elementAtOrDefault(Infinity); });
            });
        });
    });
    describe(".elementAt(x)", function () {
        it("should return the indexed element", function () {
            assert.equal(sourceEnumerable.elementAt(2), source[2]);
            assert.equal(sourceArrayEnumerable.elementAt(2), source[2]);
        });
        it("should throw", function () {
            assert.throws(function () { return sourceArrayEnumerable.elementAt(-1); });
        });
    });
    describe(".elementAtOrDefault (x)", function () {
        it("should return the indexed element", function () {
            assert.equal(sourceEnumerable.elementAtOrDefault(2), source[2]);
            assert.equal(sourceArrayEnumerable.elementAtOrDefault(2), source[2]);
            var d = {};
            assert.equal(sourceArrayEnumerable.elementAtOrDefault(10, d), d);
        });
        it("should throw", function () {
            assert.throws(function () { return sourceArrayEnumerable.elementAtOrDefault(-1); });
        });
    });
    describe(".min()", function () {
        it("should return the minimum of the selected", function () {
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.b; }).min(), 1);
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.c; }).min(), "a");
        });
    });
    describe(".max()", function () {
        it("should return the maximum of the selected", function () {
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.b; }).max(), 3);
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.c; }).max(), "f");
        });
    });
    describe(".minBy(selector)", function () {
        it("should return the minimum of the selected", function () {
            assert.equal(sourceArrayEnumerable.minBy(function (e) { return e.b; }).b, 1);
            assert.equal(sourceArrayEnumerable.minBy(function (e) { return e.c; }).c, "a");
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.b; }).minBy(), 1);
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.c; }).minBy(), "a");
        });
    });
    describe(".maxBy(selector)", function () {
        it("should return the maximum of the selected", function () {
            assert.equal(sourceArrayEnumerable.maxBy(function (e) { return e.b; }).b, 3);
            assert.equal(sourceArrayEnumerable.maxBy(function (e) { return e.c; }).c, "f");
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.b; }).maxBy(), 3);
            assert.equal(sourceArrayEnumerable.select(function (e) { return e.c; }).maxBy(), "f");
        });
    });
    describe(".concat(...)", function () {
        it("should remain the same", function () {
            assert.equal(sourceArrayEnumerable.merge(null).count(), 6);
            assert.equal(sourceArrayEnumerable.merge([]).count(), 6);
        });
        it("should combine two into one", function () {
            assert.equal(sourceArrayEnumerable.concat(sourceArrayEnumerable).count(), 12);
        });
    });
    describe(".selectMany(...)", function () {
        it("should select the sub values", function () {
            function test(values) {
                assert.equal(values.count(), 25);
                assert.equal(values.toJoinedString(), sourceManyFlat);
            }
            var split = function (s) { return s && s.split(","); };
            test(sourceMany.selectMany(split));
            test(sourceMany.selectMany(split, function (c, e) { return e; }));
            assert.equal(Linq_1.default.from([]).selectMany(split).count(), 0);
            var iSource = Linq_1.default.toInfinity().selectMany(function (s) { return Utility_1.repeat("" + s, s); });
            assert.equal(iSource.take(10).toJoinedString(), "1223334444");
            var s = sourceMany.select(function (s) { return s.length; });
            s.dispose();
            assert.throws(function () { return s.toArray(); });
        });
    });
    describe(".traverseBreadthFirst()", function () {
        it("walk the tree in proper order", function () {
            var tree = sourceEnumerable
                .traverseBreadthFirst(function (e) { return e.children; }), c = tree.select(function (e) { return e.c; });
            assert.equal(c.elementAt(2), "c");
            assert.equal(c.elementAt(6), "a");
            assert.equal(c.count(), 12);
            assert.equal(Linq_1.default.empty().traverseBreadthFirst(function (e) { return e.children; }, Functions_1.default.Identity).count(), 0);
        });
    });
    describe(".traverseDepthFirst()", function () {
        it("walk the tree in proper order", function () {
            var tree = sourceEnumerable
                .traverseDepthFirst(function (e) { return e.children; }), c = tree.select(function (e) { return e.c; });
            assert.equal(c.elementAt(2), "a");
            assert.equal(c.elementAt(6), "c");
            assert.equal(c.count(), 12);
            assert.equal(Linq_1.default.empty().traverseDepthFirst(function (e) { return e.children; }, Functions_1.default.Identity).count(), 0);
        });
    });
    describe(".flatten()", function () {
        it("should convert deep enumerable to flat one", function () {
            assert.equal(sourceMany
                .choose()
                .select(function (s) { return s.split(','); })
                .concat([["z"]])
                .flatten()
                .toJoinedString(), sourceManyFlat + "z");
        });
    });
    describe(".ofType(type)", function () {
        var source = Linq_1.default.from([
            1,
            "a",
            true,
            [],
            [],
            2,
            "b",
            [],
            false,
            function () { },
            3,
            "c",
            [],
            "d",
            "e",
            null,
            undefined
        ]);
        it("should select only the type requested", function () {
            assert.equal(source.ofType(Number).count(), 3);
            assert.equal(source.ofType(String).count(), 5);
            assert.equal(source.ofType(Boolean).count(), 2);
            assert.equal(source.ofType(Function).count(), 1);
            assert.equal(source.ofType(Array).count(), 4);
        });
    });
    describe(".buffer(size)", function () {
        it("should return arrays at the size provided", function () {
            var s2 = sourceEnumerable.buffer(2);
            assert.equal(s2.first().length, 2);
            assert.equal(s2.count(), 3);
        });
        it("should throw for invalid sizes", function () {
            assert.throws(function () { return sourceEnumerable.buffer(-1); });
            assert.throws(function () { return sourceEnumerable.buffer(Infinity); });
        });
    });
    describe(".share()", function () {
        it("should share an enumerator", function () {
            var s = sourceEnumerable.select(function (e) { return e.c; }).share();
            var e1 = s.getEnumerator();
            var e2 = s.getEnumerator();
            e1.moveNext();
            assert.equal(e1.current, "a");
            assert.equal(e2.current, "a");
            e2.moveNext();
            assert.equal(e1.current, "b");
            assert.equal(e2.current, "b");
        });
    });
    var mathTree = sourceEnumerable.traverseDepthFirst(function (e) { return e.children; }), mathTreeArray = mathTree.select(function (e) { return e.b; }).toArray();
    describe(".sum()", function () {
        it("should render the sum value", function () {
            var v = Procedure.sum(mathTreeArray);
            assert.equal(Linq_1.default.empty().sum(), 0);
            assert.equal(mathTree.select(function (e) { return e.b; }).sum(), v);
            assert.equal(mathTree.select(function (e) { return e.b; }).concat([Infinity, -Infinity]).sum(), v);
            assert.equal(mathTree.select(function (e) { return e.b; }).concat([Infinity, Infinity, -Infinity]).sum(), Infinity);
            assert.equal(mathTree.select(function (e) { return e.b; }).concat([Infinity, -Infinity, -Infinity]).sum(), -Infinity);
            assert.ok(isNaN(mathTree.select(function (e) { return e.b; }).concat([NaN]).sum()));
            assert.equal(mathTree.sum(function (e) { return e.b; }), v);
        });
    });
    describe(".product()", function () {
        it("should render the product value", function () {
            var v = Procedure.product(mathTreeArray);
            assert.equal(mathTree.select(function (e) { return e.b; }).product(), v);
            assert.ok(isNaN(mathTree.select(function (e) { return e.b; }).concat([NaN]).product()));
            assert.equal(mathTree.select(function (e) { return e.b; }).concat([0]).product(), 0);
            assert.equal(mathTree.product(function (e) { return e.b; }), v);
        });
    });
    describe(".quotient()", function () {
        it("should render the quotient value", function () {
            var v = Procedure.quotient(mathTreeArray);
            assert.equal(mathTree.select(function (e) { return e.b; }).quotient(), v);
            assert.ok(isNaN(mathTree.select(function (e) { return e.b; }).concat([NaN]).quotient()));
            assert.ok(isNaN(mathTree.select(function (e) { return e.b; }).take(1).quotient()));
            assert.equal(mathTree.quotient(function (e) { return e.b; }), v);
        });
    });
    describe(".average()", function () {
        it("should render the average value", function () {
            var tree = sourceEnumerable
                .traverseDepthFirst(function (e) { return e.children; });
            var v = Procedure.average(mathTreeArray);
            assert.equal(mathTree.select(function (e) { return e.b; }).average(), v);
            assert.ok(isNaN(mathTree.select(function (e) { return e.b; }).concat([NaN]).average()));
            assert.equal(mathTree.average(function (e) { return e.b; }), v);
        });
    });
});

//# sourceMappingURL=Enumerable.js.map
