"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var EMPTY = '', TRUE = 'true', FALSE = 'false';
function toString(value, defaultForUnknown) {
    var v = value;
    switch (typeof v) {
        case Types_1.Type.STRING:
            return v;
        case Types_1.Type.BOOLEAN:
            return v ? TRUE : FALSE;
        case Types_1.Type.NUMBER:
            return EMPTY + v;
        default:
            if (v == null)
                return v;
            if (isSerializable(v))
                return v.serialize();
            else if (defaultForUnknown)
                return defaultForUnknown;
            var ex = new InvalidOperationException_1.InvalidOperationException('Attempting to serialize unidentifiable type.');
            ex.data['value'] = v;
            throw ex;
    }
}
exports.toString = toString;
function isSerializable(instance) {
    return Types_1.Type.hasMemberOfType(instance, 'serialize', Types_1.Type.FUNCTION);
}
exports.isSerializable = isSerializable;
function toPrimitive(value, caseInsensitive, unknownHandler) {
    if (value) {
        if (caseInsensitive)
            value = value.toLowerCase();
        switch (value) {
            case 'null':
                return null;
            case Types_1.Type.UNDEFINED:
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
exports.toPrimitive = toPrimitive;
//# sourceMappingURL=Utility.js.map