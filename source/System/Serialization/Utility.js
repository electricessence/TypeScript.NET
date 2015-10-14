/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../Types', '../Exceptions/InvalidOperationException'], function (require, exports, Types_1, InvalidOperationException_1) {
    var EMPTY = '', TRUE = 'true', FALSE = 'false';
    function toString(value, defaultForUnknown) {
        var v = value;
        switch (typeof v) {
            case Types_1.default.NULL:
            case Types_1.default.UNDEFINED:
            case Types_1.default.STRING:
                return v;
            case Types_1.default.BOOLEAN:
                return v ? TRUE : FALSE;
            case Types_1.default.NUMBER:
                return EMPTY + v;
            default:
                if (Types_1.default.of(v).member('serialize').isFunction)
                    return v.serialize();
                else if (arguments.length > 1)
                    return defaultForUnknown;
                var ex = new InvalidOperationException_1.default('Attempting to serialize unidentifiable type.');
                ex.data['value'] = v;
                throw ex;
        }
    }
    exports.toString = toString;
    function toPrimitive(value, caseInsensitive, unknownHandler) {
        if (value) {
            if (caseInsensitive)
                value = value.toLowerCase();
            switch (value) {
                case Types_1.default.NULL:
                    return null;
                case Types_1.default.UNDEFINED:
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
    exports.toPrimitive = toPrimitive;
});
//# sourceMappingURL=Utility.js.map