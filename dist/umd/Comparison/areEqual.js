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
        define(["require", "exports", "../Reflection/isTrueNaN"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isTrueNaN_1 = require("../Reflection/isTrueNaN");
    /**
     * Used for special comparison including NaN.
     * @param a
     * @param b
     * @param strict
     * @returns {boolean|any}
     */
    function areEqual(a, b, strict) {
        if (strict === void 0) { strict = true; }
        return a === b
            || !strict && a == b
            || isTrueNaN_1.default(a) && isTrueNaN_1.default(b);
    }
    exports.default = areEqual;
});
//# sourceMappingURL=areEqual.js.map