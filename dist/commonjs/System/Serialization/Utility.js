/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.toString = toString;
exports.toPrimitive = toPrimitive;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var _ExceptionsInvalidOperationException = require('../Exceptions/InvalidOperationException');

var _ExceptionsInvalidOperationException2 = _interopRequireDefault(_ExceptionsInvalidOperationException);

var EMPTY = '',
    TRUE = 'true',
    FALSE = 'false';

function toString(value, defaultForUnknown) {
    var v = value;
    switch (typeof v) {
        case _Types2['default'].UNDEFINED:
        case _Types2['default'].STRING:
            return v;
        case _Types2['default'].BOOLEAN:
            return v ? TRUE : FALSE;
        case _Types2['default'].NUMBER:
            return EMPTY + v;
        default:
            if (v === null) return v;
            if (_Types2['default'].of(v).member('serialize').isFunction) return v.serialize();else if (arguments.length > 1) return defaultForUnknown;
            var ex = new _ExceptionsInvalidOperationException2['default']('Attempting to serialize unidentifiable type.');
            ex.data['value'] = v;
            throw ex;
    }
}

function toPrimitive(value, caseInsensitive, unknownHandler) {
    if (value) {
        if (caseInsensitive) value = value.toLowerCase();
        switch (value) {
            case 'null':
                return null;
            case _Types2['default'].UNDEFINED:
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
                        if (!isNaN(int)) return int;
                    } else {
                        var number = parseFloat(value);
                        if (!isNaN(number)) return number;
                    }
                }
                if (unknownHandler) value = unknownHandler(value);
                break;
        }
    }
    return value;
}
//# sourceMappingURL=Utility.js.map
