/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import {UriComponent} from "./UriComponent";
import {StringKeyValuePair} from "../KeyValuePair";
import {IArray} from "../Collections/Array/IArray";
import {IEnumerable} from "../Collections/Enumeration/IEnumerable";
import {IEnumerableOrArray} from "../Collections/IEnumerableOrArray";

export module QueryParam
{
	export type Array
		= IArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type Enumerable
		= IEnumerable<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type EnumerableOrArray
		= IEnumerableOrArray<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type Convertible
		= string | UriComponent.Map | EnumerableOrArray;
}

export default QueryParam;
