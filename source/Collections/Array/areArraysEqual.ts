/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EqualityComparison} from "../../FunctionTypes";
import areEqual from "../../Comparison/areEqual";
import validateSize from "./validateSize";

/**
 * Compares two arrays for equality (does not recurse).
 * @param a
 * @param b
 * @param equalityComparer
 */
export default function areArraysEqual<T>(
	a:ArrayLike<T>, b:ArrayLike<T>,
	equalityComparer?:EqualityComparison<T>):boolean
export default function areArraysEqual<T>(
	a:ArrayLike<T>, b:ArrayLike<T>,
	strict:boolean,
	equalityComparer?:EqualityComparison<T>):boolean
export default function areArraysEqual<T>(
	a:ArrayLike<T>, b:ArrayLike<T>,
	strict:boolean|EqualityComparison<T> = true,
	equalityComparer:EqualityComparison<T> = areEqual):boolean
{
	const len = validateSize(a, b);
	if(typeof len == 'boolean') return len;

	if(typeof strict == 'function') {
		equalityComparer = strict;
		strict = true;
	}

	for(let i = 0; i<len; i++)
		if(!equalityComparer(a[i], b[i], strict))
			return false;

	return true;
}

