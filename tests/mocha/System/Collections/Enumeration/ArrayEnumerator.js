(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "assert", "mocha", "../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator"], function (require, exports) {
    "use strict";
    var assert = require("assert");
    require("mocha");
    var ArrayEnumerator_1 = require("../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator");
    describe("new & .moveNext()", function () {
        it("should allow empty arrays", function () {
            assert.doesNotThrow(function () {
                var i = new ArrayEnumerator_1.default([]);
                i.moveNext();
            });
            assert.doesNotThrow(function () {
                var i = new ArrayEnumerator_1.default(null);
                i.moveNext();
            });
        });
    });
});
//# sourceMappingURL=ArrayEnumerator.js.map