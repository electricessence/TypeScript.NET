/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "../../../Primitive";
import {ArgumentNullException} from "../../../Exceptions/ArgumentNullException";

/**
 * Merge sort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @param low
 * @param high
 * @returns {number[]}
 */
export function mergeSort<T extends Primitive>(
	target:T[],
	low:number = 0,
	high:number = target && (target.length - 1) || 0):T[]
{
	if(!target) throw new ArgumentNullException("target");
	if(low<high)
	{
		// Step 1: Create variables to traverse
		var middle = Math.floor((low + high)/2);
		var i = low, j = middle + 1, k = low;

		mergeSort(target, low, middle);
		mergeSort(target, j, high);

		// Step 2: Copy the original array
		var temp = target.slice();

		// Step 3: Merge: Move from the temp to target integers in order
		while(i<=middle && j<=high)
		{
			target[k++]
				= temp[i]>temp[j]
				? temp[j++]
				: temp[i++];
		}

		// Step 4: Finalize merging in case right side of the array is bigger.
		while(i<=middle)
		{
			target[k++] = temp[i++];
		}

	}

	return target
}
