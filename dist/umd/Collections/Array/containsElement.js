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
        define(["require", "exports", "../../Comparison/areEqual", "./indexOfElement"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var areEqual_1 = require("../../Comparison/areEqual");
    var indexOfElement_1 = require("./indexOfElement");
    /**
     * Checks to see if the provided array contains an item.
     * If the array value is null, then false is returned.
     * @param array
     * @param item
     * @param {function?} equalityComparer
     * @returns {boolean}
     */
    function containsElement(array, item, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
        return indexOfElement_1.default(array, item, equalityComparer) != -1;
    }
    exports.default = containsElement;
});
//# sourceMappingURL=containsElement.js.map