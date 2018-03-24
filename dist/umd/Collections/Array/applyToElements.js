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
     * Is similar to Array.map() but instead of returning a new array, it updates the existing indexes.
     * Can also be applied to a structure that indexes like an array, but may not be.
     * @param target
     * @param fn
     */
    function applyToElements(target, fn) {
        if (target && fn) {
            for (var i = 0; i < target.length; i++) {
                target[i] = fn(target[i], i);
            }
        }
    }
    exports.default = applyToElements;
});
//# sourceMappingURL=applyToElements.js.map