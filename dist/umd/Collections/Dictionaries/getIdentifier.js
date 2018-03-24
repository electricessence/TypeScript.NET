/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../Reflection/isPropertyKey", "../../Reflection/hasMethod"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var isPropertyKey_1 = require("../../Reflection/isPropertyKey");
    var hasMethod_1 = require("../../Reflection/hasMethod");
    var VOID0 = void 0;
    var NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
    function getIdentifier(obj, throwIfUnknown) {
        if (throwIfUnknown === void 0) { throwIfUnknown = false; }
        if (isPropertyKey_1.default(obj))
            return obj;
        if (obj === null)
            return NULL;
        if (obj === VOID0)
            return "undefined" /* Undefined */;
        // See ISymbolizable.
        if (hasMethod_1.default(obj, GET_SYMBOL)) {
            return obj.getSymbol();
        }
        // See IHashable.
        if (hasMethod_1.default(obj, GET_HASH_CODE)) {
            return obj.getHashCode();
        }
        if (throwIfUnknown) {
            if (typeof throwIfUnknown == 'function')
                return throwIfUnknown(obj);
            else
                throw "Cannot create known identity.";
        }
        return (typeof obj.toString == "function" /* Function */)
            ? obj.toString()
            : Object.prototype.toString.call(obj);
    }
    exports.default = getIdentifier;
});
//# sourceMappingURL=getIdentifier.js.map