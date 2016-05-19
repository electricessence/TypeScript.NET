/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Types", "../Exceptions/InvalidOperationException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, InvalidOperationException_1;
    var EMPTY, TRUE, FALSE;
    function toString(value, defaultForUnknown) {
        var v = value;
        switch (typeof v) {
            case Types_1.Type.UNDEFINED:
            case Types_1.Type.STRING:
                return v;
            case Types_1.Type.BOOLEAN:
                return v ? TRUE : FALSE;
            case Types_1.Type.NUMBER:
                return EMPTY + v;
            default:
                if (v === null)
                    return v;
                if (isSerializable(v))
                    return v.serialize();
                else if (arguments.length > 1)
                    return defaultForUnknown;
                var ex = new InvalidOperationException_1.InvalidOperationException('Attempting to serialize unidentifiable type.');
                ex.data['value'] = v;
                throw ex;
        }
    }
    exports_1("toString", toString);
    function isSerializable(instance) {
        return Types_1.Type.hasMemberOfType(instance, 'serialize', Types_1.Type.FUNCTION);
    }
    exports_1("isSerializable", isSerializable);
    function toPrimitive(value, caseInsensitive, unknownHandler) {
        if (value) {
            if (caseInsensitive)
                value = value.toLowerCase();
            switch (value) {
                case 'null':
                    return null;
                case Types_1.Type.UNDEFINED:
                    return undefined;
                case TRUE:
                    return true;
                case FALSE:
                    return false;
                default:
                    var cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                    if (cleaned) {
                        if (/^\d+$/g.test(cleaned)) {
                            var int = parseInt(cleaned);
                            if (!isNaN(int))
                                return int;
                        }
                        else {
                            var number = parseFloat(value);
                            if (!isNaN(number))
                                return number;
                        }
                    }
                    if (unknownHandler)
                        value = unknownHandler(value);
                    break;
            }
        }
        return value;
    }
    exports_1("toPrimitive", toPrimitive);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            }],
        execute: function() {
            EMPTY = '', TRUE = 'true', FALSE = 'false';
        }
    }
});
//# sourceMappingURL=Utility.js.map