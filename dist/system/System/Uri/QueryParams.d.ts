/// <reference path="../../../../source/System/Uri/IUriComponentFormattable.d.ts" />
/// <reference path="../../../../source/System/Collections/Dictionaries/IDictionary.d.ts" />
/// <reference path="../../../../source/System/Primitive.d.ts" />
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
export declare function encode(values: IUriComponentMap | QueryParamEnumerableOrArray, prefixIfNotEmpty?: boolean): string;
export declare function encodeValue(value: UriComponentValue): string;
export declare function isUriComponentFormattable(instance: any): instance is IUriComponentFormattable;
export declare function parse(query: string, entryHandler: (key: string, value: Primitive) => void, deserialize?: boolean, decodeValues?: boolean): void;
export declare function parseToMap(query: string, deserialize?: boolean, decodeValues?: boolean): IMap<Primitive | Primitive[]>;
export declare function parseToArray(query: string, deserialize?: boolean, decodeValues?: boolean): IStringKeyValuePair<Primitive>[];
export declare module Separator {
    const Entry: string;
    const KeyValue: string;
}
