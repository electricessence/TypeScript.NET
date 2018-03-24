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
        define(["require", "exports", "../Collections/Array/repeatElement"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var repeatElement_1 = require("../Collections/Array/repeatElement");
    var EMPTY = '';
    function repeatText(source, count) {
        if (isNaN(source) && !source)
            return EMPTY;
        return repeatElement_1.repeatElement(source, count).join(EMPTY);
    }
    exports.default = repeatText;
});
//# sourceMappingURL=repeatText.js.map