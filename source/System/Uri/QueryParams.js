(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../Types', '../Serialization/Utility', '../KeyValueExtract'], factory);
    }
})(function (require, exports) {
    /*
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     */
    ///<reference path="IUriComponentFormattable.d.ts"/>
    ///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
    ///<reference path="../Primitive.d.ts"/>
    'use strict'; // For compatibility with (let, const, function, class);
    var Types_1 = require('../Types');
    var Serialization = require('../Serialization/Utility');
    var KeyValueExtract_1 = require('../KeyValueExtract');
    /*
     * This module is provided as a lighter weight utility for acquiring query params.
     * If more detailed operations are necessary, consider importing QueryBuilder.
     */
    var ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
    /**
     * Returns the encoded URI string
     */
    function encode(values, prefixIfNotEmpty) {
        if (!values)
            return '';
        var entries;
        if (Array.isArray(values)) {
            entries = values.map(function (kvp) { return KeyValueExtract_1.default(kvp, function (key, value) { return key + KEY_VALUE_SEPARATOR + encodeValue(value); }); });
        }
        else {
            entries = Object.keys(values).map(function (key) { return key + KEY_VALUE_SEPARATOR + encodeValue(values[key]); });
        }
        return (entries.length && prefixIfNotEmpty ? '?' : '')
            + entries.join(ENTRY_SEPARATOR);
    }
    exports.encode = encode;
    /**
     * Converts any primitive, serializable or uri-component object to an encoded string.
     * @param value
     * @returns {string}
     */
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
    /**
     * A shortcut for identifying an IUriComponentFormattable object.
     * @param instance
     * @returns {boolean}
     */
    function isUriComponentFormattable(instance) {
        return Types_1.default.hasMemberOfType(instance, "toUriComponent", Types_1.default.FUNCTION);
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
                        value = Serialization.toPrimitive(value);
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
        Separator.Entry = ENTRY_SEPARATOR;
        Separator.KeyValue = KEY_VALUE_SEPARATOR;
    })(Separator = exports.Separator || (exports.Separator = {}));
    Object.freeze(Separator);
});
//# sourceMappingURL=QueryParams.js.map