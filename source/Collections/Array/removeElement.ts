/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import areEqual from "../../Comparison/areEqual";
import {EqualityComparison} from "../../FunctionTypes";
import TypeOf from "../../Reflection/TypeOf";

/**
 * Finds and removes a value from an array.  Will remove all instances unless a maximum is specified.
 * @param array
 * @param value
 * @param maxCount
 * @param {function?} equalityComparer
 * @returns {number} The number of times the value was found and removed.
 */
export default function removeElement<T>(
	array:T[], value:T, maxCount:number = Infinity,
	equalityComparer:EqualityComparison<T> = areEqual):number
{
	if(!array || !array.length || typeof maxCount==TypeOf.NUMBER && maxCount<=0) return 0;
	let count = 0;
	if(!maxCount || !isFinite(maxCount))
	{
		// Don't track the indexes and remove in reverse.
		for(let i = (array.length - 1); i>=0; i--)
		{
			if(equalityComparer(array[i], value))
			{
				array.splice(i, 1);
				++count;
			}
		}
	}
	else
	{
		// Since the user will expect it to happen in forward order...
		const found:number[] = []; // indexes;
		for(let i = 0, len = array.length; i<len; i++)
		{
			if(equalityComparer(array[i], value))
			{
				found.push(i);
				++count;
				if(count==maxCount) break;
			}
		}

		for(let i = found.length - 1; i>=0; i--)
		{
			array.splice(found[i], 1);
		}
	}

	return count;
}
