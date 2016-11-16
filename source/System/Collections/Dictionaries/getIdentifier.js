/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../../Types"], function (require, exports) {
    "use strict";
    var Types_1 = require("../../Types");
    var VOID0 = void 0;
    var NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
    function getIdentifier(obj, throwIfUnknown) {
        if (throwIfUnknown === void 0) { throwIfUnknown = false; }
        if (Types_1.Type.isPropertyKey(obj))
            return obj;
        if (obj === null)
            return NULL;
        if (obj === VOID0)
            return Types_1.Type.UNDEFINED;
        if (Types_1.Type.hasMethod(obj, GET_SYMBOL)) {
            return obj.getSymbol();
        }
        if (Types_1.Type.hasMethod(obj, GET_HASH_CODE)) {
            return obj.getHashCode();
        }
        if (throwIfUnknown)
            throw "Cannot create known identity.";
        return (typeof obj.toString == Types_1.Type.FUNCTION)
            ? obj.toString()
            : Object.prototype.toString.call(obj);
    }
    exports.getIdentifier = getIdentifier;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getIdentifier;
});
//# sourceMappingURL=getIdentifier.js.map