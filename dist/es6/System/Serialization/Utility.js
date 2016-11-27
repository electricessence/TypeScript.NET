/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
const EMPTY = '', TRUE = 'true', FALSE = 'false';
export function toString(value, defaultForUnknown) {
    let v = value;
    switch (typeof v) {
        case Type.STRING:
            return v;
        case Type.BOOLEAN:
            return v ? TRUE : FALSE;
        case Type.NUMBER:
            return EMPTY + v;
        default:
            if (v == null)
                return v;
            if (isSerializable(v))
                return v.serialize();
            else if (defaultForUnknown)
                return defaultForUnknown;
            const ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
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
                return void (0);
            case TRUE:
                return true;
            case FALSE:
                return false;
            default:
                const cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
                if (cleaned) {
                    if (/^\d+$/g.test(cleaned)) {
                        const int = parseInt(cleaned);
                        if (!isNaN(int))
                            return int;
                    }
                    else {
                        const number = parseFloat(value);
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