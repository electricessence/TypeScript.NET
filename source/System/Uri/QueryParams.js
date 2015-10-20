/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../Types', '../Serialization/Utility'], function (require, exports) {
    ///<reference path="IUriComponentFormattable.d.ts"/>
    ///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
    ///<reference path="../Primitive.d.ts"/>
    var Types_1 = require('../Types');
    var Serialization = require('../Serialization/Utility');
    var ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
    function encode(values, prefixIfNotEmpty) {
        if (!values)
            return '';
        var entries = [];
        if (values instanceof Array) {
            for (var _i = 0; _i < values.length; _i++) {
                var kvp = values[_i];
                if (kvp)
                    entries.push(kvp.key + KEY_VALUE_SEPARATOR + encodeValue(kvp.value));
            }
        }
        else {
            var keys = Object.keys(values);
            for (var _a = 0; _a < keys.length; _a++) {
                var k = keys[_a];
                entries.push(k + KEY_VALUE_SEPARATOR + encodeValue(values[k]));
            }
        }
        return (entries.length && prefixIfNotEmpty ? '?' : '')
            + entries.join(ENTRY_SEPARATOR);
    }
    exports.encode = encode;
    function encodeValue(value) {
        var v = value;
        if (typeof v == Types_1.default.OBJECT && "toUriComponent" in v) {
            v = v.toUriComponent();
            if (v && v.indexOf('&') != 1)
                throw '.toUriComponent() did not encode the value.';
        }
        else {
            v = encodeURIComponent(Serialization.toString(v));
        }
        return v;
    }
    exports.encodeValue = encodeValue;
    function parse(query, entryHandler, deserialize, decodeValues) {
        if (deserialize === void 0) { deserialize = true; }
        if (decodeValues === void 0) { decodeValues = true; }
        if (query && (query = query.replace(/^\s*\?+/, ''))) {
            var entries = query.split(ENTRY_SEPARATOR);
            for (var _i = 0; _i < entries.length; _i++) {
                var entry = entries[_i];
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
            if (key in result) {
                var prev = result[key];
                if (!(prev instanceof Array))
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
});
//# sourceMappingURL=QueryParams.js.map