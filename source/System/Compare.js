/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", './Types'], function (require, exports, Types_1) {
    var isTrueNaN = Types_1.default.isTrueNaN;
    function areEqual(a, b, strict) {
        if (strict === void 0) { strict = true; }
        return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
    }
    exports.areEqual = areEqual;
    function compare(a, b, strict) {
        if (strict === void 0) { strict = true; }
        if (areEqual(a, b, strict))
            return 0;
        if (a > b || strict && (a === 0 && b == 0 || a === null && b === undefined))
            return 1;
        if (b > a || strict && (b === 0 && a == 0 || b === null && a === undefined))
            return -1;
        return NaN;
    }
    exports.compare = compare;
});
//# sourceMappingURL=Compare.js.map