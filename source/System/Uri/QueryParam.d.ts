/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {UriComponent} from "./UriComponent";
import {StringKeyValuePair} from "../KeyValuePair";
import {FiniteIEnumerable} from "../Collections/Enumeration/IEnumerable";
import FiniteEnumerableOrArrayLike from "../Collections/FiniteEnumerableOrArrayLike";

export module QueryParam
{
	export type Array
		= ArrayLike<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type Enumerable
		= FiniteIEnumerable<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type EnumerableOrArray
		= FiniteEnumerableOrArrayLike<StringKeyValuePair<UriComponent.Value|UriComponent.Value[]>>;

	export type Convertible
		= string | UriComponent.Map | EnumerableOrArray;
}

export default QueryParam;
