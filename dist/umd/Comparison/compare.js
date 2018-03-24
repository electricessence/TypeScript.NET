/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../Reflection/hasMember", "./areEqual"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasMember_1 = require("../Reflection/hasMember");
    var areEqual_1 = require("./areEqual");
    var VOID0 = void 0;
    var COMPARE_TO = "compareTo";
    function compare(a, b, strict) {
        if (strict === void 0) { strict = true; }
        if (areEqual_1.default(a, b, strict))
            return 0 /* Equal */;
        if (a && hasMember_1.default(a, COMPARE_TO))
            return a.compareTo(b); // If a has compareTo, use it.
        else if (b && hasMember_1.default(b, COMPARE_TO))
            return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.
        // Allow for special inequality..
        if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
            return 1 /* Greater */;
        if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
            return -1 /* Less */;
        return NaN;
    }
    exports.default = compare;
});
//# sourceMappingURL=compare.js.map