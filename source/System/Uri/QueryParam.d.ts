/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import * as UriComponent from "./UriComponent";
import {StringKeyValuePair} from "../KeyValuePair";
import {IArray} from "../Collections/Array/IArray";
import {IEnumerable} from "../Collections/Enumeration/IEnumerable";
import {IEnumerableOrArray} from "../Collections/IEnumerableOrArray";

export declare type Array
	= IArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type Enumerable
	= IEnumerable<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type EnumerableOrArray
	= IEnumerableOrArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type Convertible
	= string | UriComponent.Map | EnumerableOrArray;