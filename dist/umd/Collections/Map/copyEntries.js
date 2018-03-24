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
        define(["require", "exports", "./applyEntries"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var applyEntries_1 = require("./applyEntries");
    /**
     * Make a copy of the source object.
     * @param source
     * @returns {Object}
     */
    function copyEntries(source) {
        return applyEntries_1.default({}, source);
    }
    exports.default = copyEntries;
});
//# sourceMappingURL=copyEntries.js.map