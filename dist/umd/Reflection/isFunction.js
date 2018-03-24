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
     * Returns true if the value parameter is a function.
     * @param value
     * @returns {boolean}
     */
    function isFunction(value) {
        return typeof value === "function" /* Function */;
    }
    exports.default = isFunction;
});
//# sourceMappingURL=isFunction.js.map