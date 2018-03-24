/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./initializeArray", "./copyArrayTo"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var initializeArray_1 = require("./initializeArray");
    var copyArrayTo_1 = require("./copyArrayTo");
    /**
     *
     * @param source
     * @param sourceIndex
     * @param length
     * @returns {any}
     */
    function copyArray(source, sourceIndex, length) {
        if (sourceIndex === void 0) { sourceIndex = 0; }
        if (length === void 0) { length = Infinity; }
        if (!source)
            return source; // may have passed zero? undefined? or null?
        return copyArrayTo_1.default(source, initializeArray_1.default(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
    }
    exports.default = copyArray;
});
//# sourceMappingURL=copyArray.js.map