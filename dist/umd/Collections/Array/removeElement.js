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
        define(["require", "exports", "../../Comparison/areEqual"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    /**
     * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
     * @param array
     * @param value
     * @param maxCount
     * @param {function?} equalityComparer
     * @returns {number} The number of times the value was found and removed.
     */
    function removeElement(array, value, maxCount, equalityComparer) {
        if (maxCount === void 0) { maxCount = Infinity; }
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        if (!array || !array.length || !isNaN(maxCount) && maxCount <= 0)
            return 0;
        var count = 0;
        if (!maxCount || !isFinite(maxCount)) {
            // Don't track the indexes and remove in reverse.
            for (var i = (array.length - 1); i >= 0; i--) {
                if (equalityComparer(array[i], value)) {
                    array.splice(i, 1);
                    ++count;
                }
            }
        }
        else {
            // Since the user will expect it to happen in forward order...
            var found = []; // indexes;
            for (var i = 0, len = array.length; i < len; i++) {
                if (equalityComparer(array[i], value)) {
                    found.push(i);
                    ++count;
                    if (count == maxCount)
                        break;
                }
            }
            for (var i = found.length - 1; i >= 0; i--) {
                array.splice(found[i], 1);
            }
        }
        return count;
    }
    exports.default = removeElement;
});
//# sourceMappingURL=removeElement.js.map