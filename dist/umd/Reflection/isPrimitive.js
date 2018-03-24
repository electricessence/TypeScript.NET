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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isPrimitive(value, allowUndefined) {
        if (allowUndefined === void 0) { allowUndefined = false; }
        var t = typeof value;
        switch (t) {
            case "boolean" /* Boolean */:
            case "string" /* String */:
            case "number" /* Number */:
                return true;
            case "undefined" /* Undefined */:
                return allowUndefined;
            case "object" /* Object */:
                return value === null;
        }
        return false;
    }
    exports.default = isPrimitive;
});
//# sourceMappingURL=isPrimitive.js.map