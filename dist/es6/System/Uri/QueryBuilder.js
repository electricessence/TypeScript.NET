/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { OrderedStringKeyDictionary } from "../Collections/Dictionaries/OrderedStringKeyDictionary";
import { isEnumerableOrArrayLike } from "../Collections/Enumeration/Enumerator";
import { encode, parse } from "./QueryParams";
// noinspection JSUnusedLocalSymbols
/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
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
    /**
     * Property parses the components of an URI into their values or array of values.
     * @param values
     * @param deserialize
     * @param decodeValues
     * @returns {QueryBuilder}
     */
    importFromString(values, deserialize = true, decodeValues = true) {
        const _ = this;
        parse(values, (key, value) => {
            if (_.containsKey(key)) {
                const prev = _.getValue(key);
                if ((prev) instanceof (Array))
                    prev.push(value);
                else
                    _.setValue(key, [prev, value]);
            }
            else
                _.setValue(key, value);
        }, deserialize, decodeValues);
        return this;
    }
    /**
     * Returns the encoded URI string
     */
    encode(prefixIfNotEmpty) {
        return encode(this, prefixIfNotEmpty);
    }
    toString() {
        return this.encode();
    }
}
export default QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map