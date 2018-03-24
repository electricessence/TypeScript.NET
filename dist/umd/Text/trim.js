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
        define(["require", "exports", "./escapeRegExp"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var escapeRegExp_1 = require("./escapeRegExp");
    var EMPTY = '';
    /**
     * Can trimEntries any character or set of characters from the ends of a string.
     * Uses a Regex escapement to replace them with empty.
     * @param source
     * @param chars A string or array of characters desired to be trimmed.
     * @param ignoreCase
     * @returns {string}
     */
    function trim(source, chars, ignoreCase) {
        if (chars === EMPTY)
            return source;
        if (chars instanceof Array)
            return trim(source, chars.join(EMPTY), ignoreCase);
        if (!chars)
            return source.replace(/^\s+|\s+$/g, EMPTY);
        var escaped = escapeRegExp_1.default(chars);
        return source.replace(new RegExp("^[" + escaped + "]+|[" + escaped + "]+$", "g" + (ignoreCase ? 'i' : EMPTY)), EMPTY);
    }
    exports.default = trim;
});
//# sourceMappingURL=trim.js.map