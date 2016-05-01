(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../source/System.Linq/Linq"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Linq_1 = require("../../../source/System.Linq/Linq");
    var assert = require('../../../node_modules/assert/assert');
    var source = Linq_1.default.toInfinity();
    describe('.toInfinity()', function () {
        describe(".elementAt(x)", function () {
            it("the index should match the value", function () {
                for (var i = 0; i < 10; i++)
                    assert.equal(source.elementAt(i), i);
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
    });
});
//# sourceMappingURL=InfiniteEnumerable.js.map