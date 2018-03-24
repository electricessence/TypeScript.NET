/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../Comparison/areEqual", "./areArraysEqual"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    var areArraysEqual_1 = require("./areArraysEqual");
    function areArraysAllEqual(arrays, strict, equalityComparer) {
        if (strict === void 0) { strict = true; }
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        if (!arrays)
            throw new Error("ArgumentNullException: 'arrays' cannot be null.");
        if (arrays.length < 2)
            throw new Error("Cannot compare a set of arrays less than 2.");
        if (typeof strict == 'function') {
            equalityComparer = strict;
            strict = true;
        }
        var first = arrays[0];
        for (var i = 1, l = arrays.length; i < l; i++) {
            if (!areArraysEqual_1.default(first, arrays[i], strict, equalityComparer))
                return false;
        }
        return true;
    }
    exports.default = areArraysAllEqual;
});
//# sourceMappingURL=areArraysAllEqual.js.map