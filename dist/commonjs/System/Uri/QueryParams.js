/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var Types_1 = require('../Types');
var Serialization = require('../Serialization/Utility');
var KeyValueExtract_1 = require('../KeyValueExtract');
var ENTRY_SEPARATOR = "&",
    KEY_VALUE_SEPARATOR = "=";
function encode(values, prefixIfNotEmpty) {
    if (!values) return '';
    var entries;
    if (Array.isArray(values)) {
        entries = values.map(function (kvp) {
            return KeyValueExtract_1.default(kvp, function (key, value) {
                return key + KEY_VALUE_SEPARATOR + encodeValue(value);
            });
        });
    } else {
        entries = Object.keys(values).map(function (key) {
            return key + KEY_VALUE_SEPARATOR + encodeValue(values[key]);
        });
    }
    return (entries.length && prefixIfNotEmpty ? '?' : '') + entries.join(ENTRY_SEPARATOR);
}
exports.encode = encode;
function encodeValue(value) {
    var v = null;
    if (isUriComponentFormattable(value)) {
        v = value.toUriComponent();
        if (v && v.indexOf('&') != 1) throw '.toUriComponent() did not encode the value.';
    } else {
        v = encodeURIComponent(Serialization.toString(v));
    }
    return v;
}
exports.encodeValue = encodeValue;
function isUriComponentFormattable(instance) {
    return Types_1.default.hasMemberOfType(instance, "toUriComponent", Types_1.default.FUNCTION);
}
exports.isUriComponentFormattable = isUriComponentFormattable;
function parse(query, entryHandler) {
    var deserialize = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var decodeValues = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    if (query && (query = query.replace(/^\s*\?+/, ''))) {
        var entries = query.split(ENTRY_SEPARATOR);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entry = _step.value;

                var si = entry.indexOf(KEY_VALUE_SEPARATOR);
                if (si != -1) {
                    var key = entry.substring(0, si);
                    var value = entry.substring(si + 1);
                    if (decodeValues) value = decodeURIComponent(value);
                    if (deserialize) value = Serialization.toPrimitive(value);
                    entryHandler(key, value);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
exports.parse = parse;
function parseToMap(query) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var result = {};
    parse(query, function (key, value) {
        if (key in result) {
            var prev = result[key];
            if (!Array.isArray(prev)) result[key] = prev = [prev];
            prev.push(value);
        } else result[key] = value;
    }, deserialize, decodeValues);
    return result;
}
exports.parseToMap = parseToMap;
function parseToArray(query) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    var decodeValues = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var result = [];
    parse(query, function (key, value) {
        result.push({ key: key, value: value });
    }, deserialize, decodeValues);
    return result;
}
exports.parseToArray = parseToArray;
var Separator;
(function (Separator) {
    Separator.Entry = ENTRY_SEPARATOR;
    Separator.KeyValue = KEY_VALUE_SEPARATOR;
})(Separator = exports.Separator || (exports.Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=QueryParams.js.map
