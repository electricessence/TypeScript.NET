/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ArrayLikeWritable from "./ArrayLikeWritable";

/**
 * Finds and replaces a value from an array.
 * Replaces all instances unless a max count is specified.
 * @param array
 * @param old
 * @param newValue
 * @param maxCount
 * @returns {number} The number of times replaced.
 */
export default function replaceElement<T>(
	array:ArrayLikeWritable<T>,
	old:T,
	newValue:T,
	maxCount:number = Infinity):number
{
	if(!array || !array.length || maxCount<=0) return 0;
	if(!maxCount || isNaN(maxCount)) maxCount = Infinity; // just in case.

	let count = 0;

	for(let i = 0, len = array.length; i<len; i++)
	{
		if(array[i]===old)
		{
			(<any>array)[i] = newValue;
			++count;
			if(count==maxCount) break;
		}
	}

	return count;
}
