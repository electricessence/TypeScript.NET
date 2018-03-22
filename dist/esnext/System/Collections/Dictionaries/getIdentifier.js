/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../../Types";
var VOID0 = void 0;
var NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
export function getIdentifier(obj, throwIfUnknown) {
    if (throwIfUnknown === void 0) { throwIfUnknown = false; }
    if (Type.isPropertyKey(obj))
        return obj;
    if (obj === null)
        return NULL;
    if (obj === VOID0)
        return Type.UNDEFINED;
    // See ISymbolizable.
    if (Type.hasMethod(obj, GET_SYMBOL)) {
        return obj.getSymbol();
    }
    // See IHashable.
    if (Type.hasMethod(obj, GET_HASH_CODE)) {
        return obj.getHashCode();
    }
    if (throwIfUnknown) {
        if (Type.isFunction(throwIfUnknown))
            return throwIfUnknown(obj);
        else
            throw "Cannot create known identity.";
    }
    return (typeof obj.toString == TypeOfValue.Function)
        ? obj.toString()
        : Object.prototype.toString.call(obj);
}
export default getIdentifier;
//# sourceMappingURL=getIdentifier.js.map