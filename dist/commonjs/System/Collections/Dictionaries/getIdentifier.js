"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
    // See ISymbolizable.
    if (Types_1.Type.hasMethod(obj, GET_SYMBOL)) {
        return obj.getSymbol();
    }
    // See IHashable.
    if (Types_1.Type.hasMethod(obj, GET_HASH_CODE)) {
        return obj.getHashCode();
    }
    if (throwIfUnknown) {
        if (Types_1.Type.isFunction(throwIfUnknown))
            return throwIfUnknown(obj);
        else
            throw "Cannot create known identity.";
    }
    return (typeof obj.toString == Types_1.Type.FUNCTION)
        ? obj.toString()
        : Object.prototype.toString.call(obj);
}
exports.getIdentifier = getIdentifier;
exports.default = getIdentifier;
//# sourceMappingURL=getIdentifier.js.map