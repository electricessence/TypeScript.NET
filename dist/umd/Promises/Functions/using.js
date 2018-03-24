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
     * Syntactic shortcut for avoiding 'new'.
     * @param resolver
     * @param forceSynchronous
     * @returns {Promise}
     */
    function using(resolver, forceSynchronous) {
        if (forceSynchronous === void 0) { forceSynchronous = false; }
        return new Promise_1.default(resolver, forceSynchronous);
    }
    exports.default = using;
});
//# sourceMappingURL=using.js.map