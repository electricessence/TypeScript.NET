/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function isWhiteSpace(ch) {
        return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
    }
    exports.isWhiteSpace = isWhiteSpace;
    function isLetter(ch) {
        return (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
    }
    exports.isLetter = isLetter;
    function isLetterOrDigit(ch) {
        return (48 <= ch && ch <= 57) || (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
    }
    exports.isLetterOrDigit = isLetterOrDigit;
    function isDigit(chOrStr, index) {
        if (arguments.length == 1) {
            return 48 <= chOrStr && chOrStr <= 57;
        }
        else {
            var ch = chOrStr.charCodeAt(index);
            return 48 <= ch && ch <= 57;
        }
    }
    exports.isDigit = isDigit;
});
//# sourceMappingURL=Char.js.map