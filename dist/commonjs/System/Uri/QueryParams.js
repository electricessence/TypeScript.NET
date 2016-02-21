'use strict';
var Types_1 = require('../Types');
var Serialization = require('../Serialization/Utility');
var ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
function encode(values, prefixIfNotEmpty) {
    if (!values)
        return '';
    var entries = [];
    if (Array.isArray(values)) {
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var kvp = values_1[_i];
            if (kvp)
                entries.push(kvp.key + KEY_VALUE_SEPARATOR + encodeValue(kvp.value));
        }
    }
    else {
        var keys = Object.keys(values);
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var k = keys_1[_a];
            entries.push(k + KEY_VALUE_SEPARATOR + encodeValue(values[k]));
        }
    }
    return (entries.length && prefixIfNotEmpty ? '?' : '')
        + entries.join(ENTRY_SEPARATOR);
}
exports.encode = encode;
function encodeValue(value) {
    var v = null;
    if (isUriComponentFormattable(value)) {
        v = value.toUriComponent();
        if (v && v.indexOf('&') != 1)
            throw '.toUriComponent() did not encode the value.';
    }
    else {
        v = encodeURIComponent(Serialization.toString(v));
    }
    return v;
}
exports.encodeValue = encodeValue;
function isUriComponentFormattable(instance) {
    return Types_1.default.hasMemberOfType(instance, "toUriComponent", Types_1.default.FUNCTION);
}
exports.isUriComponentFormattable = isUriComponentFormattable;
function parse(query, entryHandler, deserialize, decodeValues) {
    if (deserialize === void 0) { deserialize = true; }
    if (decodeValues === void 0) { decodeValues = true; }
    if (query && (query = query.replace(/^\s*\?+/, ''))) {
        var entries = query.split(ENTRY_SEPARATOR);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            var si = entry.indexOf(KEY_VALUE_SEPARATOR);
            if (si != -1) {
                var key = entry.substring(0, si);
                var value = entry.substring(si + 1);
                if (decodeValues)
                    value = decodeURIComponent(value);
                if (deserialize)
                    value = Serialization.toPrimitive(value);
                entryHandler(key, value);
            }
        }
    }
}
exports.parse = parse;
function parseToMap(query, deserialize, decodeValues) {
    if (deserialize === void 0) { deserialize = true; }
    if (decodeValues === void 0) { decodeValues = true; }
    var result = {};
    parse(query, function (key, value) {
        if ((key) in (result)) {
            var prev = result[key];
            if (!(Array.isArray(prev)))
                result[key] = prev = [prev];
            prev.push(value);
        }
        else
            result[key] = value;
    }, deserialize, decodeValues);
    return result;
}
exports.parseToMap = parseToMap;
function parseToArray(query, deserialize, decodeValues) {
    if (deserialize === void 0) { deserialize = true; }
    if (decodeValues === void 0) { decodeValues = true; }
    var result = [];
    parse(query, function (key, value) { result.push({ key: key, value: value }); }, deserialize, decodeValues);
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