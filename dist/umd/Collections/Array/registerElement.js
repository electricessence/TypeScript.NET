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
        define(["require", "exports", "../../Comparison/areEqual", "./indexOfElement", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    var indexOfElement_1 = require("./indexOfElement");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    /**
     * Ensures a value exists within an array.  If not found, adds to the end.
     * @param array
     * @param item
     * @param {function?} equalityComparer
     * @returns {boolean}
     */
    function registerElement(array, item, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        if (!array)
            throw new ArgumentNullException_1.default('array');
        var len = array.length; // avoid querying .length more than once. *
        var ok = !len || indexOfElement_1.default(array, item, equalityComparer) != -1;
        if (ok)
            array[len] = item; // * push would query length again.
        return ok;
    }
    exports.default = registerElement;
});
//# sourceMappingURL=registerElement.js.map