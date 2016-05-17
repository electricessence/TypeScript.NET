/// <reference path="../../../../source/System/Collections/Dictionaries/IDictionary.d.ts" />
/// <reference path="../../../../source/System/Serialization/ISerializable.d.ts" />
/// <reference path="../../../../source/System/Uri/IUriComponentFormattable.d.ts" />
/// <reference path="../../../../source/System/Primitive.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import OrderedStringKeyDictionary from "../Collections/Dictionaries/OrderedStringKeyDictionary";
export default class QueryBuilder extends OrderedStringKeyDictionary<UriComponentValue | UriComponentValue[]> {
    constructor(query: QueryParamsConvertible, decodeValues?: boolean);
    static init(query: QueryParamsConvertible, decodeValues?: boolean): QueryBuilder;
    importQuery(query: QueryParamsConvertible, decodeValues?: boolean): QueryBuilder;
    importFromString(values: string, deserialize?: boolean, decodeValues?: boolean): QueryBuilder;
    encode(prefixIfNotEmpty?: boolean): string;
    toString(): string;
}
