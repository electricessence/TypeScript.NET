/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */



import {EqualityComparison} from "../../FunctionTypes";
import areEqual from "../../Comparison/areEqual";
import isTrueNaN from "../../Reflection/isTrueNaN";

/**
 * Checks to see where the provided array contains an item/value.
 * If the array value is null, then -1 is returned.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {number}
 */
export default function indexOfElement<T>(
	array:ArrayLike<T>, item:T,
	equalityComparer:EqualityComparison<T> = areEqual):number
{

	const len = array && array.length;
	if(len)
	{
		// NaN NEVER evaluates its equality so be careful.
		if((array) instanceof (Array) && !isTrueNaN(item))
			return array.indexOf(item);

		for(let i = 0; i<len; i++)
		{
			// 'areEqual' includes NaN==NaN evaluation.
			if(equalityComparer(array[i], item))
				return i;
		}
	}

	return -1;
}

