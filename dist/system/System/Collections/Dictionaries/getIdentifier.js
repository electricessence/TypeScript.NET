System.register(["../../Types"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("getIdentifier", getIdentifier);
    var Types_1, VOID0, NULL, GET_SYMBOL, GET_HASH_CODE;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            }
        ],
        execute: function () {
            VOID0 = void 0;
            NULL = "null", GET_SYMBOL = "getSymbol", GET_HASH_CODE = "getHashCode";
            exports_1("default", getIdentifier);
        }
    };
});
//# sourceMappingURL=getIdentifier.js.map