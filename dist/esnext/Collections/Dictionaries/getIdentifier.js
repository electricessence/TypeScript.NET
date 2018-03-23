/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import isPropertyKey from "../../Reflection/isPropertyKey";
import hasMethod from "../../Reflection/hasMethod";
var VOID0 = void 0;
var NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
function getIdentifier(obj, throwIfUnknown) {
    if (throwIfUnknown === void 0) { throwIfUnknown = false; }
    if (isPropertyKey(obj))
        return obj;
    if (obj === null)
        return NULL;
    if (obj === VOID0)
        return "undefined" /* Undefined */;
    // See ISymbolizable.
    if (hasMethod(obj, GET_SYMBOL)) {
        return obj.getSymbol();
    }
    // See IHashable.
    if (hasMethod(obj, GET_HASH_CODE)) {
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
export default getIdentifier;
//# sourceMappingURL=getIdentifier.js.map