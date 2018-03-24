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
     * Takes a target object and applies all source values to it.
     * @param target
     * @param source
     * @returns {any}
     */
    function applyEntries(target, source) {
        var result = target || {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }
        return result;
    }
    exports.default = applyEntries;
});
//# sourceMappingURL=applyEntries.js.map