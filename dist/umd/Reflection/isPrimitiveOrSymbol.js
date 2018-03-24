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
        define(["require", "exports", "./isPrimitive"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isPrimitive_1 = require("./isPrimitive");
    function isPrimitiveOrSymbol(value, allowUndefined) {
        if (allowUndefined === void 0) { allowUndefined = false; }
        return typeof value === "symbol" /* Symbol */ ? true : isPrimitive_1.default(value, allowUndefined);
    }
    exports.default = isPrimitiveOrSymbol;
});
//# sourceMappingURL=isPrimitiveOrSymbol.js.map