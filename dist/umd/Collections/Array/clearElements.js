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
        define(["require", "exports", "./updateRange"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var updateRange_1 = require("./updateRange");
    /**
     * Clears (sets to null) values of an array across a range of indexes.
     * @param array
     * @param start
     * @param stop
     */
    function clearElements(array, start, stop) {
        if (start === void 0) { start = 0; }
        updateRange_1.default(array, null, start, stop);
    }
    exports.default = clearElements;
});
//# sourceMappingURL=clearElements.js.map