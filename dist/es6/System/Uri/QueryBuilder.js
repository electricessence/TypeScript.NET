/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { OrderedStringKeyDictionary } from "../Collections/Dictionaries/OrderedStringKeyDictionary";
import { isEnumerableOrArrayLike } from "../Collections/Enumeration/Enumerator";
import * as QueryParams from "./QueryParams";
export class QueryBuilder extends OrderedStringKeyDictionary {
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
        else if (isEnumerableOrArrayLike(query)) {
            this.importEntries(query);
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
export default QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map