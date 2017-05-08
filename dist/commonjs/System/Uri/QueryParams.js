"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Serialize = require("../Serialization/Utility");
var Types_1 = require("../Types");
var KeyValueExtract_1 = require("../KeyValueExtract");
var Enumerator_1 = require("../Collections/Enumeration/Enumerator");
/*
 * This module is provided as a lighter weight utility for acquiring query params.
 * If more detailed operations are necessary, consider importing QueryBuilder.
 */
var EMPTY = "", QUERY_SEPARATOR = "?", ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=", TO_URI_COMPONENT = "toUriComponent";
/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
function encode(values, prefixIfNotEmpty) {
    if (!values)
        return EMPTY;
    var entries = [];
    if (Enumerator_1.isEnumerableOrArrayLike(values)) {
        Enumerator_1.forEach(values, function (entry) {
            return KeyValueExtract_1.extractKeyValue(entry, function (key, value) { return appendKeyValue(entries, key, value); });
        });
    }
    else {
        Object.keys(values).forEach(function (key) { return appendKeyValue(entries, key, values[key]); });
    }
    return (entries.length && prefixIfNotEmpty ? QUERY_SEPARATOR : EMPTY)
        + entries.join(ENTRY_SEPARATOR);
}
exports.encode = encode;
function appendKeyValueSingle(entries, key, value) {
    entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}
// According to spec, if there is an array of values with the same key, then each value is replicated with that key.
function appendKeyValue(entries, key, value) {
    if (Enumerator_1.isEnumerableOrArrayLike(value)) {
        Enumerator_1.forEach(value, function (v) { return appendKeyValueSingle(entries, key, v); });
    }
    else {
        appendKeyValueSingle(entries, key, value);
    }
}
/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
function encodeValue(value) {
    if (isUriComponentFormattable(value)) {
        var v = value.toUriComponent();
        if (v && v.indexOf(ENTRY_SEPARATOR) != 1)
            throw '.toUriComponent() did not encode the value.';
        return v;
    }
    else {
        return encodeURIComponent(Serialize.toString(value));
    }
}
exports.encodeValue = encodeValue;
/**
 * A shortcut for identifying an UriComponent.Formattable object.
 * @param instance
 * @returns {boolean}
 */
function isUriComponentFormattable(instance) {
    return Types_1.Type.hasMemberOfType(instance, TO_URI_COMPONENT, Types_1.Type.FUNCTION);
}
exports.isUriComponentFormattable = isUriComponentFormattable;
/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 */
function parse(query, entryHandler, deserialize, decodeValues) {
    if (deserialize === void 0) { deserialize = true; }
    if (decodeValues === void 0) { decodeValues = true; }
    if (query && (query = query.replace(/^\s*\?+/, ''))) {
        var entries = query.split(ENTRY_SEPARATOR);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            /*
             * Since it is technically possible to have multiple '=' we need to identify the first one.
             * And if there is no '=' then the entry is ignored.
             */
            var si = entry.indexOf(KEY_VALUE_SEPARATOR);
            if (si != -1) {
                var key = entry.substring(0, si);
                var value = entry.substring(si + 1);
                if (decodeValues)
                    value = decodeURIComponent(value);
                if (deserialize)
                    value = Serialize.toPrimitive(value);
                entryHandler(key, value);
            }
        }
    }
}
exports.parse = parse;
/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IMap<Primitive>}
 */
function parseToMap(query, deserialize, decodeValues) {
    if (deserialize === void 0) { deserialize = true; }
    if (decodeValues === void 0) { decodeValues = true; }
    var result = {};
    parse(query, function (key, value) {
        if ((key) in (result)) {
            var prev = result[key];
            if (!((prev) instanceof (Array)))
                result[key] = prev = [prev];
            prev.push(value);
        }
        else
            result[key] = value;
    }, deserialize, decodeValues);
    return result;
}
exports.parseToMap = parseToMap;
/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IKeyValuePair<string, Primitive>[]}
 */
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
    Separator.Query = QUERY_SEPARATOR;
    Separator.Entry = ENTRY_SEPARATOR;
    Separator.KeyValue = KEY_VALUE_SEPARATOR;
})(Separator = exports.Separator || (exports.Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=QueryParams.js.map