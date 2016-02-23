'use strict';
import Type from '../Types';
import * as QueryParams from './QueryParams';
import OrderedStringKeyDictionary from '../Collections/Dictionaries/OrderedStringKeyDictionary';
const ENTRY_SEPARATOR = "&", KEY_VALUE_SEPARATOR = "=";
export default class QueryBuilder extends OrderedStringKeyDictionary {
    constructor(query, decodeValues = true) {
        super();
        this.importQuery(query, decodeValues);
    }
    importQuery(query, decodeValues = true) {
        if (Type.isString(query)) {
            this.importFromString(query, decodeValues);
        }
        else if (Array.isArray(query)) {
            this.importPairs(query);
        }
        else {
            this.importMap(query);
        }
        return this;
    }
    importFromString(values, deserialize = true, decodeValues = true) {
        var _ = this;
        QueryParams.parse(values, (key, value) => {
            if (_.containsKey(key)) {
                var prev = _.getValue(key);
                if (Array.isArray(prev))
                    prev.push(value);
                else
                    _.setValue(key, [prev, value]);
            }
            else
                _.setValue(key, value);
        }, deserialize, decodeValues);
        return this;
    }
    static init(query, decodeValues = true) {
        return new QueryBuilder(query, decodeValues);
    }
    encode(prefixIfNotEmpty) {
        var entries = [];
        var keys = this.keys;
        for (let k of keys) {
            var value = this.getValue(k);
            for (let v of Array.isArray(value) ? value : [value]) {
                entries.push(k + KEY_VALUE_SEPARATOR
                    + QueryParams.encodeValue(v));
            }
        }
        return (entries.length && prefixIfNotEmpty ? '?' : '')
            + entries.join(ENTRY_SEPARATOR);
    }
    toString() {
        return this.encode();
    }
}
//# sourceMappingURL=QueryBuilder.js.map