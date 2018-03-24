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
    /**
     * Returns a numerical (integer) hash code of the string.  Can be used for identifying inequality of contents, but two different strings in rare cases will have the same hash code.
     * @param source
     * @returns {number}
     */
    function getHashCode(source) {
        var hash = 0 | 0;
        if (source.length == 0)
            return hash;
        for (var i = 0, l = source.length; i < l; i++) {
            var ch = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    exports.getHashCode = getHashCode;
});
//# sourceMappingURL=getHashCode.js.map