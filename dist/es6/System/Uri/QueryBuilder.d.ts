/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { OrderedStringKeyDictionary } from "../Collections/Dictionaries/OrderedStringKeyDictionary";
import * as UriComponent from "./UriComponent";
import * as QueryParam from "./QueryParam";
export declare class QueryBuilder extends OrderedStringKeyDictionary<UriComponent.Value | UriComponent.Value[]> {
    constructor(query: QueryParam.Convertible, decodeValues?: boolean);
    static init(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    importQuery(query: QueryParam.Convertible, decodeValues?: boolean): QueryBuilder;
    importFromString(values: string, deserialize?: boolean, decodeValues?: boolean): QueryBuilder;
    encode(prefixIfNotEmpty?: boolean): string;
    toString(): string;
}
export default QueryBuilder;
