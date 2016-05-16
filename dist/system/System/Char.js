/*!
 * @author electricessence / https://github.com/electricessence/
 * From Netjs mscorlib.ts
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isWhiteSpace(ch) {
        return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
    }
    exports_1("isWhiteSpace", isWhiteSpace);
    function isLetter(ch) {
        return (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
    }
    exports_1("isLetter", isLetter);
    function isLetterOrDigit(ch) {
        return (48 <= ch && ch <= 57) || (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
    }
    exports_1("isLetterOrDigit", isLetterOrDigit);
    function isDigit(chOrStr, index) {
        if (arguments.length == 1) {
            return 48 <= chOrStr && chOrStr <= 57;
        }
        else {
            var ch = chOrStr.charCodeAt(index);
            return 48 <= ch && ch <= 57;
        }
    }
    exports_1("isDigit", isDigit);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=Char.js.map