/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './Types'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require('./Types');
    var isTrueNaN = Types_1.default.isTrueNaN;
    var VOID0 = void 0;
    function areEqual(a, b, strict) {
        if (strict === void 0) { strict = true; }
        return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
    }
    exports.areEqual = areEqual;
    var COMPARE_TO = "compareTo";
    function compare(a, b, strict) {
        if (strict === void 0) { strict = true; }
        if (areEqual(a, b, strict))
            return 0;
        if (a && Types_1.default.hasMember(a, COMPARE_TO))
            return a.compareTo(b);
        else if (b && Types_1.default.hasMember(b, COMPARE_TO))
            return -b.compareTo(a);
        if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
            return 1;
        if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
            return -1;
        return NaN;
    }
    exports.compare = compare;
});
//# sourceMappingURL=Compare.js.map