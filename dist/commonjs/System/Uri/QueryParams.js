/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var Serialization = require("../Serialization/Utility");
var Types_1 = require("../Types");
var KeyValueExtract_1 = require("../KeyValueExtract");
var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
var EMPTY = "",
    QUERY_SEPARATOR = "?",
    ENTRY_SEPARATOR = "&",
    KEY_VALUE_SEPARATOR = "=",
    TO_URI_COMPONENT = "toUriComponent";
function encode(values, prefixIfNotEmpty) {
    if (!values) return EMPTY;
    var entries = [];
    if (Enumerator_1.isEnumerableOrArrayLike(values)) {
        Enumerator_1.forEach(values, function (entry) {
            return KeyValueExtract_1.extractKeyValue(entry, function (key, value) {
                return appendKeyValue(entries, key, value);
            });
        });
    } else {
        Object.keys(values).forEach(function (key) {
            return appendKeyValue(entries, key, values[key]);
        });
    }
    return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY) + entries.join(ENTRY_SEPARATOR);
}
exports.encode = encode;
function appendKeyValueSingle(entries, key, value) {
    entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}
function appendKeyValue(entries, key, value) {
    if (Enumerator_1.isEnumerableOrArrayLike(value)) {
        Enumerator_1.forEach(value, function (v) {
            return appendKeyValueSingle(entries, key, v);
        });
    } else {
        appendKeyValueSingle(entries, key, value);
    }
}
function encodeValue(value) {
    var v = null;
    if (isUriComponentFormattable(value)) {
        v = value.toUriComponent();
        if (v && v.indexOf(ENTRY_SEPARATOR) != 1) throw '.toUriComponent() did not encode the value.';
    } else {
        v = encodeURIComponent(Serialization.toString(v));
    }
    return v;
}
exports.encodeValue = encodeValue;
function isUriComponentFormattable(instance) {
    return Types_1.Type.hasMemberOfType(instance, TO_URI_COMPONENT, Types_1.Type.FUNCTION);
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
    Separator.Query = QUERY_SEPARATOR;
    Separator.Entry = ENTRY_SEPARATOR;
    Separator.KeyValue = KEY_VALUE_SEPARATOR;
})(Separator = exports.Separator || (exports.Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=QueryParams.js.map
