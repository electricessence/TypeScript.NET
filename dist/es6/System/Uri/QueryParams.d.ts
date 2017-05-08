/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { UriComponent } from "./UriComponent";
import { QueryParam } from "./QueryParam";
import { IMap } from "../../IMap";
import { Primitive } from "../Primitive";
import { IStringKeyValuePair } from "../KeyValuePair";
/**
 * Returns the encoded URI string
 * @param values
 * @param prefixIfNotEmpty
 * @returns {string}
 */
export declare function encode(values: UriComponent.Map | QueryParam.EnumerableOrArray, prefixIfNotEmpty?: boolean): string;
/**
 * Converts any primitive, serializable or uri-component object to an encoded string.
 * @param value
 * @returns {string}
 */
export declare function encodeValue(value: UriComponent.Value): string;
/**
 * A shortcut for identifying an UriComponent.Formattable object.
 * @param instance
 * @returns {boolean}
 */
export declare function isUriComponentFormattable(instance: any): instance is UriComponent.Formattable;
/**
 * Parses a string for valid query param entries and pipes them through a handler.
 * @param query
 * @param entryHandler
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 */
export declare function parse(query: string, entryHandler: (key: string, value: Primitive) => void, deserialize?: boolean, decodeValues?: boolean): void;
/**
 * Parses a string for valid query params and returns a key-value map of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IMap<Primitive>}
 */
export declare function parseToMap(query: string, deserialize?: boolean, decodeValues?: boolean): IMap<Primitive | Primitive[]>;
/**
 * Parses a string for valid query params and returns a key-value pair array of the entries.
 * @param query
 * @param deserialize Default is true.
 * @param decodeValues Default is true.
 * @returns {IKeyValuePair<string, Primitive>[]}
 */
export declare function parseToArray(query: string, deserialize?: boolean, decodeValues?: boolean): IStringKeyValuePair<Primitive>[];
export declare module Separator {
    const Query: string;
    const Entry: string;
    const KeyValue: string;
}
