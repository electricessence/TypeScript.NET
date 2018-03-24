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
        define(["require", "exports", "../../Comparison/areEqual", "./validateSize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    var validateSize_1 = require("./validateSize");
    function areArraysEqual(a, b, strict, equalityComparer) {
        if (strict === void 0) { strict = true; }
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        var len = validateSize_1.default(a, b);
        if (typeof len == 'boolean')
            return len;
        if (typeof strict == 'function') {
            equalityComparer = strict;
            strict = true;
        }
        for (var i = 0; i < len; i++)
            if (!equalityComparer(a[i], b[i], strict))
                return false;
        return true;
    }
    exports.default = areArraysEqual;
});
//# sourceMappingURL=areArraysEqual.js.map