/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { OrderedStringKeyDictionary } from "../Collections/Dictionaries/OrderedStringKeyDictionary";
import { UriComponent } from "./UriComponent";
import { QueryParam } from "./QueryParam";
/**
 * Provides a means for parsing and building a set of parameters.
 *
 * In other languages, dictionaries are not reliable for retaining the order of stored values. So for certainty and flexibility we use an ordered dictionary as a base class.
 */
export declare class QueryBuilder extends OrderedStringKeyDictionary<UriComponent.Value | UriComponent.Value[]> {
    constructor(query: QueryParam.Convertible, decodeValues?: boolean);
    static init(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    importQuery(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    /**
     * Property parses the components of an URI into their values or array of values.
     * @param values
     * @param deserialize
     * @param decodeValues
     * @returns {QueryBuilder}
     */
    importFromString(values: string, deserialize?: boolean, decodeValues?: boolean): QueryBuilder;
    /**
     * Returns the encoded URI string
     */
    encode(prefixIfNotEmpty?: boolean): string;
    toString(): string;
}
export default QueryBuilder;
