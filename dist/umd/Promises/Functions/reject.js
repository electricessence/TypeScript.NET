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
        define(["require", "exports", "../Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../Promise");
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    function reject(reason) {
        return new Promise_1.Rejected(reason);
    }
    exports.default = reject;
});
//# sourceMappingURL=reject.js.map