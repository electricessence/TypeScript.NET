/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import {LinqEnumerable} from "../Linq";
import * as enumUtil from "../../System/Collections/Enumeration/Enumerator";

/**
 * Static helper for converting enumerables to an array.
 * @param source
 * @returns {any}
 */
export function toArray<T>(source:FiniteEnumerableOrArrayLike<T>):T[]
{
	// noinspection SuspiciousInstanceOfGuard
	if(source instanceof LinqEnumerable)
		return source.toArray();

	return enumUtil.toArray(source);
}