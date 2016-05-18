/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerable} from "../Collections/Enumeration/IEnumerable";
import {StringKeyValuePair} from "../KeyValuePair";
import * as UriComponent from "./UriComponent";

export declare type Array
	= IArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type Enumerable
	= IEnumerable<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type EnumerableOrArray
	= IEnumerableOrArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

export declare type Convertible
	= string | UriComponent.Map | EnumerableOrArray;