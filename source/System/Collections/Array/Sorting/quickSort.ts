/*!
 * @author Sebastian Belmar / https://github.com/sebabelmar/
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "../../../Primitive";
import {ArgumentNullException} from "../../../Exceptions/ArgumentNullException";

/**
 * Quick sort O(n log (n))
 * Warning: Uses recursion.
 * @param target
 * @returns {T[]}
 */
export function quickSort<T extends Primitive>(target:T[]):T[]
{
	if(!target) throw new ArgumentNullException("target");
	var len = target.length;
	return target.length<2 ? target : sort(target, 0, len - 1);
}

function sort<T extends Primitive>(
	target:T[],
	low:number,
	high:number):T[]
{
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

		sort(target, low, i - 1);
		sort(target, i + 1, high);
	}

	return target;
}
