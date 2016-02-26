/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import Type from '../Types';
import * as Serialization from '../Serialization/Utility';
import extractKeyValue from '../KeyValueExtract';
import { isEnumerable, forEach } from '../Collections/Enumeration/Enumerator';
const ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
export function encode(values, prefixIfNotEmpty) {
    if (!values)
        return '';
    var entries = [];
    if (Array.isArray(values) || isEnumerable(values)) {
        forEach(values, entry => extractKeyValue(entry, (key, value) => appendKeyValue(entries, key, value)));
    }
    else {
        Object.keys(values).forEach(key => appendKeyValue(entries, key, values[key]));
    }
    return (entries.length && prefixIfNotEmpty ? '?' : '')
        + entries.join(ENTRY_SEPARATOR);
}
function appendKeyValueSingle(entries, key, value) {
    entries.push(key + KEY_VALUE_SEPARATOR + encodeValue(value));
}
function appendKeyValue(entries, key, value) {
    if (Array.isArray(value) || isEnumerable(value)) {
        forEach(value, v => appendKeyValueSingle(entries, key, v));
    }
    else {
        appendKeyValueSingle(entries, key, value);
    }
}
export function encodeValue(value) {
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
export function isUriComponentFormattable(instance) {
    return Type.hasMemberOfType(instance, "toUriComponent", Type.FUNCTION);
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