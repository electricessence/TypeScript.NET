/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import Type from '../Types';
import * as QueryParams from './QueryParams';
import OrderedStringKeyDictionary from '../Collections/Dictionaries/OrderedStringKeyDictionary';
import { isEnumerable } from '../Collections/Enumeration/Enumerator';
export default class QueryBuilder extends OrderedStringKeyDictionary {
    constructor(query, decodeValues = true) {
        super();
        this.importQuery(query, decodeValues);
    }
    static init(query, decodeValues = true) {
        return new QueryBuilder(query, decodeValues);
    }
    importQuery(query, decodeValues = true) {
        if (Type.isString(query)) {
            this.importFromString(query, decodeValues);
        }
        else if (Array.isArray(query) || isEnumerable(query)) {
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
    encode(prefixIfNotEmpty) {
        return QueryParams.encode(this, prefixIfNotEmpty);
    }
    toString() {
        return this.encode();
    }
}
//# sourceMappingURL=QueryBuilder.js.map