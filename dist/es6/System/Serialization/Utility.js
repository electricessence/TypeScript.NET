/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
const EMPTY = '', TRUE = 'true', FALSE = 'false';
export function toString(value, defaultForUnknown) {
    var v = value;
    switch (typeof v) {
        case Type.UNDEFINED:
        case Type.STRING:
            return v;
        case Type.BOOLEAN:
            return v ? TRUE : FALSE;
        case Type.NUMBER:
            return EMPTY + v;
        default:
            if (v === null)
                return v;
            if (isSerializable(v))
                return v.serialize();
            else if (arguments.length > 1)
                return defaultForUnknown;
            var ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
            ex.data['value'] = v;
            throw ex;
    }
}
export function isSerializable(instance) {
    return Type.hasMemberOfType(instance, 'serialize', Type.FUNCTION);
}
export function toPrimitive(value, caseInsensitive, unknownHandler) {
    if (value) {
        if (caseInsensitive)
            value = value.toLowerCase();
        switch (value) {
            case 'null':
                return null;
            case Type.UNDEFINED:
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
//# sourceMappingURL=Utility.js.map