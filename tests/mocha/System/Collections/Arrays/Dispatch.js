(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../../source/System/Collections/Array/Dispatch"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Dispatch_1 = require("../../../../../source/System/Collections/Array/Dispatch");
    var assert = require('../../../../../node_modules/assert/assert');
    it("should apply closures in order", function () {
        var result = 0;
        var a = [
            function (p) {
                result += p;
            },
            function (p) {
                result *= p;
            }
        ];
        Dispatch_1.default(a, 10);
        assert.equal(result, 100);
        Dispatch_1.default(a, 20);
        assert.equal(result, 2400);
    });
});
//# sourceMappingURL=Dispatch.js.map