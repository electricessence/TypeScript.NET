/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "../../../Primitive";
import {ArgumentNullException} from "../../../Exceptions/ArgumentNullException";

/**
 * Quick sort O (n log n)
 * Warning: Uses recursion.
 * @param target
 * @param low
 * @param high
 * @returns {Array}
 */
export function quickSort<T extends Primitive>(
	target:T[],
	low:number = 0,
	high:number = target && (target.length - 1)):T[]
{
	if(!target) throw new ArgumentNullException("target");
	if(low<high)
	{
		// Partition first...
		var swap:T, pivotIndex = Math.floor((low + high)/2);

		swap = target[pivotIndex];
		target[pivotIndex] = target[high];
		target[high] = swap;

		var i = low;
		for(let j = low; j<high; j++)
		{
			if(target[j]<target[high])
			{
				swap = target[i];
				target[i] = target[j];
				target[j] = swap;
				i++;
			}
		}

		swap = target[i];
		target[i] = target[high];
		target[high] = swap;

		quickSort(target, low, i - 1);
		quickSort(target, i + 1, high);
	}

	return target;
}
