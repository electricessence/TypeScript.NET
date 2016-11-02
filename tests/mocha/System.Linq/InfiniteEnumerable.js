(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "assert", "../../../dist/commonjs/System.Linq/Linq"], factory);
    }
})(function (require, exports) {
    "use strict";
    var assert = require("assert");
    var Linq_1 = require("../../../dist/commonjs/System.Linq/Linq");
    var source = Linq_1.default.toInfinity().asEnumerable();
    describe(".doAction(...)", function () {
        it("should throw when disposed", function () {
            var a = source.doAction(function (e) { });
            a.force();
            var n = a.getEnumerator();
            assert.ok(n.moveNext());
            n.dispose();
            assert.ok(!n.moveNext());
            n = a.getEnumerator();
            assert.ok(n.moveNext());
            a.dispose();
            assert.throws(function () { return n.moveNext(); });
        });
    });
    describe(".elementAt(x)", function () {
        it("the index should match the value", function () {
            for (var i = 0; i < 10; i++) {
                assert.equal(source.elementAt(i), i);
            }
        });
    });
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
    describe(".skip(count)", function () {
        it("should return empty if Infinity", function () {
            assert.equal(source
                .skip(Infinity)
                .firstOrDefault(-1), -1);
        });
    });
    describe(".take(count)", function () {
        it("should return empty if zero less", function () {
            assert.equal(source
                .take(0)
                .defaultIfEmpty(-1)
                .first(), -1);
            assert.equal(source
                .take(-1)
                .firstOrDefault(-1), -1);
            assert.throws(function () {
                var t = source.take(2);
                var e = t.getEnumerator();
                e.moveNext();
                t.dispose();
                e.moveNext();
            });
            assert.doesNotThrow(function () {
                var e = false, f = false;
                assert.ok(source
                    .where(function (e) {
                    if (!e)
                        throw "Error";
                    return true;
                })
                    .catchError(function (error) {
                    e = error == "Error";
                })
                    .finallyAction(function () {
                    f = true;
                })
                    .isEmpty());
                assert.ok(e);
                assert.ok(f);
            });
        });
        it("should throw for Infinity", function () {
            assert.throws(function () {
                source.take(Infinity);
            });
        });
    });
    describe(".choose()", function () {
        it("should filter non-null", function () {
            assert.equal(source.choose().first(), 0);
            assert.equal(source.choose(function (s) { return s; }).first(), 0);
        });
    });
    describe(".except()", function () {
        it("should skip values that are excepted", function () {
            assert.equal(source.except([0, 1]).first(), 2);
            assert.equal(source.except([1, 2]).elementAt(2), 4);
            source.except([1, 2]).dispose();
        });
    });
    describe(".pairwise(selector)", function () {
        it("should produce pair selected values", function () {
            var s = Linq_1.default.toInfinity().pairwise(function (a, b) { return "" + a + "" + b; });
            assert.equal(s.elementAt(0), "01");
            assert.equal(s.elementAt(5), "56");
            s.dispose();
        });
    });
});
//# sourceMappingURL=InfiniteEnumerable.js.map