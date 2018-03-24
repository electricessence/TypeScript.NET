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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PATTERN = /[-[\]\/{}()*+?.\\^$|]/g;
    var REPLACEMENT = "\\$&";
    /**
     * Escapes a RegExp sequence.
     * @param source
     * @returns {string}
     */
    function escapeRegExp(source) {
        return source.replace(PATTERN, REPLACEMENT);
    }
    exports.default = escapeRegExp;
});
//# sourceMappingURL=escapeRegExp.js.map