/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from '../Types';
import * as Serialization from '../Serialization/Utility';
const ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
export function encode(values, prefixIfNotEmpty) {
    if (!values)
        return '';
    var entries = [];
    if (values instanceof Array) {
        for (let kvp of values) {
            if (kvp)
                entries.push(kvp.key + KEY_VALUE_SEPARATOR + encodeValue(kvp.value));
        }
    }
    else {
        var keys = Object.keys(values);
        for (let k of keys) {
            entries.push(k + KEY_VALUE_SEPARATOR + encodeValue(values[k]));
        }
    }
    return (entries.length && prefixIfNotEmpty ? '?' : '')
        + entries.join(ENTRY_SEPARATOR);
}
export function encodeValue(value) {
    var v = value;
    if (typeof v == Type.OBJECT && "toUriComponent" in v) {
        v = v.toUriComponent();
        if (v && v.indexOf('&') != 1)
            throw '.toUriComponent() did not encode the value.';
    }
    else {
        v = encodeURIComponent(Serialization.toString(v));
    }
    return v;
}
export function parse(query, entryHandler, deserialize = true, decodeValues = true) {
    if (query && (query = query.replace(/^\s*\?+/, ''))) {
        var entries = query.split(ENTRY_SEPARATOR);
        for (let entry of entries) {
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
export function parseToMap(query, deserialize = true, decodeValues = true) {
    var result = {};
    parse(query, (key, value) => {
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
export function parseToArray(query, deserialize = true, decodeValues = true) {
    var result = [];
    parse(query, (key, value) => { result.push({ key: key, value: value }); }, deserialize, decodeValues);
    return result;
}
export var Separator;
(function (Separator) {
    Separator.Entry = ENTRY_SEPARATOR;
    Separator.KeyValue = KEY_VALUE_SEPARATOR;
})(Separator || (Separator = {}));
Object.freeze(Separator);
//# sourceMappingURL=QueryParams.js.map