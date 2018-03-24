/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {EqualityComparison} from "../../FunctionTypes";
import areEqual from "../../Comparison/areEqual";
import areArraysEqual from "./areArraysEqual";

export default function areArraysAllEqual(
	arrays:ArrayLike<ArrayLike<any>>,
	equalityComparer?:EqualityComparison<any>):boolean
export default function areArraysAllEqual(
	arrays:ArrayLike<ArrayLike<any>>,
	strict:boolean,
	equalityComparer?:EqualityComparison<any>):boolean
export default function areArraysAllEqual(
	arrays:ArrayLike<ArrayLike<any>>,
	strict:boolean|EqualityComparison<any> = true,
	equalityComparer:EqualityComparison<any> = areEqual):boolean
{
	if(!arrays)
		throw new Error("ArgumentNullException: 'arrays' cannot be null.");
	if(arrays.length<2)
		throw new Error("Cannot compare a set of arrays less than 2.");

	if(typeof strict == 'function') {
		equalityComparer = strict;
		strict = true;
	}

	const first = arrays[0];
	for(let i = 1, l = arrays.length; i<l; i++)
	{
		if(!areArraysEqual(first, arrays[i], strict, equalityComparer))
			return false;
	}
	return true;
}
