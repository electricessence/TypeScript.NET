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
    /**
     * Returns true if the value parameter is a string.
     * @param value
     * @returns {boolean}
     */
    function isString(value) {
        return typeof value === "string" /* String */;
    }
    exports.default = isString;
});
//# sourceMappingURL=isString.js.map