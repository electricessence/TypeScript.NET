/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import FiniteLinqEnumerable, {ILinqFinite} from "../FiniteLinqEnumerable";
import {getEmptyEnumerator} from "../../System/Collections/Enumeration/EmptyEnumerator";


export default function <T>():ILinqFinite<T> {
	// Could be single export function instance, but for safety, we'll make a new one.
	return new FiniteLinqEnumerable<T>(getEmptyEnumerator);
}