/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import hasMemberOfType from "../Reflection/hasMemberOfType";
var EMPTY = '', TRUE = 'true', FALSE = 'false';
export function toString(value, defaultForUnknown) {
    var v = value;
    switch (typeof v) {
        case "string" /* String */:
            return v;
        case "boolean" /* Boolean */:
            return v ? TRUE : FALSE;
        case "number" /* Number */:
            return EMPTY + v;
        default:
            if (v == null)
                return v;
            if (isSerializable(v))
                return v.serialize();
            else if (defaultForUnknown)
                return defaultForUnknown;
            var ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
            ex.data['value'] = v;
            throw ex;
    }
}
export function isSerializable(instance) {
    return hasMemberOfType(instance, 'serialize', "function" /* Function */);
}
export function toPrimitive(value, caseInsensitive, unknownHandler) {
    if (value) {
        if (caseInsensitive)
            value = value.toLowerCase();
        switch (value) {
            case 'null':
                return null;
            case "undefined" /* Undefined */:
                return void (0);
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
                // Handle Dates...  Possibly JSON?
                // Instead of throwing we allow for handling...
                if (unknownHandler)
                    value = unknownHandler(value);
                break;
        }
    }
    return value;
}
//# sourceMappingURL=Utility.js.map