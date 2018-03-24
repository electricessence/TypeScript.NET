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
     * Finds and replaces a value from an array.
     * Replaces all instances unless a max count is specified.
     * @param array
     * @param old
     * @param newValue
     * @param maxCount
     * @returns {number} The number of times replaced.
     */
    function replaceElement(array, old, newValue, maxCount) {
        if (maxCount === void 0) { maxCount = Infinity; }
        if (!array || !array.length || maxCount <= 0)
            return 0;
        if (!maxCount || isNaN(maxCount))
            maxCount = Infinity; // just in case.
        var count = 0;
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === old) {
                array[i] = newValue;
                ++count;
                if (count == maxCount)
                    break;
            }
        }
        return count;
    }
    exports.default = replaceElement;
});
//# sourceMappingURL=replaceElement.js.map