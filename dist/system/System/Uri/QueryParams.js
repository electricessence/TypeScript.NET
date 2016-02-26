/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Types', '../Serialization/Utility', '../KeyValueExtract', '../Collections/Enumeration/Enumerator'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var Types_1, Serialization, KeyValueExtract_1, Enumerator_1;
    var ENTRY_SEPARATOR, KEY_VALUE_SEPARATOR, Separator;
    function encode(values, prefixIfNotEmpty) {
        if (!values)
            return '';
        var entries = [];
        if (Array.isArray(values) || Enumerator_1.isEnumerable(values)) {
            Enumerator_1.forEach(values, function (entry) {
                return KeyValueExtract_1.default(entry, function (key, value) { return appendKeyValue(entries, key, value); });
            });
        }
        else {
            Object.keys(values).forEach(function (key) { return appendKeyValue(entries, key, values[key]); });
        }
        return (entries.length && prefixIfNotEmpty ? '?' : '')
            + entries.join(ENTRY_SEPARATOR);
    }
    exports_1("encode", encode);
    function appendKeyValueSingle(entries, key, value) {
        entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
    }
    function appendKeyValue(entries, key, value) {
        if (Array.isArray(value) || Enumerator_1.isEnumerable(value)) {
            Enumerator_1.forEach(value, function (v) { return appendKeyValueSingle(entries, key, v); });
        }
        else {
            appendKeyValueSingle(entries, key, value);
        }
    }
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
    exports_1("encodeValue", encodeValue);
    function isUriComponentFormattable(instance) {
        return Types_1.default.hasMemberOfType(instance, "toUriComponent", Types_1.default.FUNCTION);
    }
    exports_1("isUriComponentFormattable", isUriComponentFormattable);
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
    exports_1("parse", parse);
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
    exports_1("parseToMap", parseToMap);
    function parseToArray(query, deserialize, decodeValues) {
        if (deserialize === void 0) { deserialize = true; }
        if (decodeValues === void 0) { decodeValues = true; }
        var result = [];
        parse(query, function (key, value) { result.push({ key: key, value: value }); }, deserialize, decodeValues);
        return result;
    }
    exports_1("parseToArray", parseToArray);
    return {
        setters:[
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Serialization_1) {
                Serialization = Serialization_1;
            },
            function (KeyValueExtract_1_1) {
                KeyValueExtract_1 = KeyValueExtract_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            }],
        execute: function() {
            ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
            (function (Separator) {
                Separator.Entry = ENTRY_SEPARATOR;
                Separator.KeyValue = KEY_VALUE_SEPARATOR;
            })(Separator = Separator || (Separator = {}));
            exports_1("Separator", Separator);
            Object.freeze(Separator);
        }
    }
});
//# sourceMappingURL=QueryParams.js.map