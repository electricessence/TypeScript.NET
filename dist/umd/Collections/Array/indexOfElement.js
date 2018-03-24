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
        define(["require", "exports", "../../Comparison/areEqual", "../../Reflection/isTrueNaN"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    var isTrueNaN_1 = require("../../Reflection/isTrueNaN");
    /**
     * Checks to see where the provided array contains an item/value.
     * If the array value is null, then -1 is returned.
     * @param array
     * @param item
     * @param {function?} equalityComparer
     * @returns {number}
     */
    function indexOfElement(array, item, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        var len = array && array.length;
        if (len) {
            // NaN NEVER evaluates its equality so be careful.
            if ((array) instanceof (Array) && !isTrueNaN_1.default(item))
                return array.indexOf(item);
            for (var i = 0; i < len; i++) {
                // 'areEqual' includes NaN==NaN evaluation.
                if (equalityComparer(array[i], item))
                    return i;
            }
        }
        return -1;
    }
    exports.default = indexOfElement;
});
//# sourceMappingURL=indexOfElement.js.map