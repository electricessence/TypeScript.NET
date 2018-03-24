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
        define(["require", "exports", "./repeatText"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var repeatText_1 = require("./repeatText");
    var EMPTY = '';
    function fromChars(chOrChars, count) {
        if (count === void 0) { count = 1; }
        if ((chOrChars) instanceof (Array)) {
            var result = EMPTY;
            for (var _i = 0, chOrChars_1 = chOrChars; _i < chOrChars_1.length; _i++) {
                var char = chOrChars_1[_i];
                result += String.fromCharCode(char);
            }
            return result;
        }
        else {
            return repeatText_1.default(String.fromCharCode(chOrChars), count);
        }
    }
    exports.default = fromChars;
});
//# sourceMappingURL=fromChars.js.map