/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as UriComponent from "./UriComponent";
import * as QueryParam from "./QueryParam";
import { IMap } from "../Collections/Dictionaries/IDictionary";
import { Primitive } from "../Primitive";
import { IStringKeyValuePair } from "../KeyValuePair";
export declare function encode(values: UriComponent.Map | QueryParam.EnumerableOrArray, prefixIfNotEmpty?: boolean): string;
export declare function encodeValue(value: UriComponent.Value): string;
export declare function isUriComponentFormattable(instance: any): instance is UriComponent.Formattable;
export declare function parse(query: string, entryHandler: (key: string, value: Primitive) => void, deserialize?: boolean, decodeValues?: boolean): void;
export declare function parseToMap(query: string, deserialize?: boolean, decodeValues?: boolean): IMap<Primitive | Primitive[]>;
export declare function parseToArray(query: string, deserialize?: boolean, decodeValues?: boolean): IStringKeyValuePair<Primitive>[];
export declare module Separator {
    const Query: string;
    const Entry: string;
    const KeyValue: string;
}
