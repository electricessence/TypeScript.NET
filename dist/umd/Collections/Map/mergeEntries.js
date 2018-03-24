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
        define(["require", "exports", "./applyEntries", "./copyEntries"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var applyEntries_1 = require("./applyEntries");
    var copyEntries_1 = require("./copyEntries");
    /**
     * Takes two objects and creates another with the values of both.
     * B overwrites A.
     * @param a
     * @param b
     */
    function mergeEntries(a, b) {
        return applyEntries_1.default(copyEntries_1.default(a), b);
    }
    exports.default = mergeEntries;
});
//# sourceMappingURL=mergeEntries.js.map