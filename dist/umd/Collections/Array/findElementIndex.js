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
        define(["require", "exports", "../../Reflection/isNumber", "../../Exceptions/ArgumentException", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isNumber_1 = require("../../Reflection/isNumber");
    var ArgumentException_1 = require("../../Exceptions/ArgumentException");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    /**
     * Returns the first index of which the provided predicate returns true.
     * Returns -1 if always false.
     * @param array
     * @param predicate
     * @returns {number}
     */
    function findElementIndex(array, predicate) {
        if (!array)
            throw new ArgumentNullException_1.default('array');
        if (typeof predicate != 'function')
            throw new ArgumentException_1.default('predicate', 'Must be a function.');
        var len = array.length;
        if (!isNumber_1.default(len, true) || len < 0)
            throw new ArgumentException_1.default('array', 'Does not have a valid length.');
        if ((array) instanceof (Array)) {
            for (var i = 0; i < len; i++) {
                if (predicate(array[i], i))
                    return i;
            }
        }
        else {
            for (var i = 0; i < len; i++) {
                if ((i) in (array) && predicate(array[i], i))
                    return i;
            }
        }
        return -1;
    }
    exports.default = findElementIndex;
});
//# sourceMappingURL=findElementIndex.js.map