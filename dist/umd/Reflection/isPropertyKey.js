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
    var PropertyKey;
    (function (PropertyKey) {
        PropertyKey.typeOfValues = Object.freeze([
            "string" /* String */,
            "number" /* Number */,
            "symbol" /* Symbol */,
        ]);
    })(PropertyKey = exports.PropertyKey || (exports.PropertyKey = {}));
    var keyTypeOfValues = {};
    PropertyKey.typeOfValues.forEach(function (v) { return keyTypeOfValues[v] = true; });
    /**
     * Returns true if the value is a string, number, or symbol.
     * (Can be used for indexing.)
     * @param value
     * @returns {boolean}
     */
    function isPropertyKey(value) {
        return keyTypeOfValues[typeof value] || false;
    }
    exports.default = isPropertyKey;
});
//# sourceMappingURL=isPropertyKey.js.map