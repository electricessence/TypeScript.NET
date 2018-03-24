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
        define(["require", "exports", "../../Integer", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Integer_1 = require("../../Integer");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    /**
     * Removes an entry at a specified index.
     * @param array
     * @param index
     * @returns {boolean} True if the value was able to be removed.
     */
    function removeElementByIndex(array, index) {
        if (!array)
            throw new ArgumentNullException_1.default('array');
        Integer_1.default.assertZeroOrGreater(index, 'index');
        var exists = index < array.length;
        if (exists)
            array.splice(index, 1);
        return exists;
    }
    exports.default = removeElementByIndex;
});
//# sourceMappingURL=removeElementByIndex.js.map