/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Primitive} from "../../../Primitive";
import {ArgumentNullException} from "../../../Exceptions/ArgumentNullException";

/**
 * https://en.wikipedia.org/wiki/Insertion_sort
 * @param target
 * @returns {T[]}
 */
export function insertionSort<T extends Primitive>(target:T[]):T[]
{
	if(!target) throw new ArgumentNullException("target");
	var len = target.length;

	for(let i = 1; i<len; i++)
	{
		let j = i, j1:number;

		while(j>0 && target[(j1 = j - 1)]>target[j])
		{
			let swap = target[j];
			target[j] = target[j1];
			target[j1] = swap;
			j--;
		}
	}

	return target;

}
