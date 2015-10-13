/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../FunctionTypes.d.ts"/>

import Types from '../../Types';
import {compare,CompareResult} from '../../Compare';

/**
 * Enum representation of sorting order.
 */
export const enum Order
{
	Ascending  = (+1) | 0,
	Descending = (-1) | 0
}

function ensureArray<T>(value:T|T[]):T[]
{
	return value instanceof Array
		? <T[]>value
		: [<T>value];
}

/**
 * A factory function that creates a comparer to be used in multi-dimensional sorting.
 *
 * <h4>Example</h4>
 * ```typescript
 * var myArray = [{a:1:b:2},{a:3,b:4},{a:1,b:3}];
 *
 * // First sort by a, then by b.
 * myArray.sort(
 *   createComparer(
 *     (e)=> [e.a, e.b],
 *     [Order.Ascending, Order.Descending]
 *   )
 * );
 *
 * // result: [{a:1,b:3},{a:1:b:2},{a:3,b:4}]
 * ```
 *
 * @param selector
 * @param order
 * @param equivalentToNaN
 * @returns {function((TSource|TSource[]), (TSource|TSource[])): CompareResult}
 */
export function createComparer<TSource,T>(
	selector:Selector<TSource|TSource[],T>,
	order:Order | Order[] = Order.Ascending,
	equivalentToNaN:any = NaN):Comparison<TSource|TSource[]>
{
	var nanHasEquivalent = !Types.isTrueNaN(equivalentToNaN);

	return (a:TSource|TSource[], b:TSource|TSource[]):CompareResult=>
	{
		// Use an array always to ensure a single code path.
		var aValue = ensureArray(selector(a));
		var bValue = ensureArray(selector(b));
		var len = Math.min(aValue.length, bValue.length);

		var oArray:Order[] = order instanceof Array ? <Order[]>order : null;
		for(let i = 0; i<len; i++)
		{
			var vA = aValue[i], vB = bValue[i],
			    o  = oArray
				    ? (i<oArray.length ? oArray[i] : Order.Ascending)
				    : <Order>order;

			if(nanHasEquivalent)
			{
				if(Types.isTrueNaN(vA))
					vA = equivalentToNaN;
				if(Types.isTrueNaN(vA))
					vB = equivalentToNaN;

			}

			var r = compare(vA, vB);
			if(r!==CompareResult.Equal)
				return o*r;

		}

		return 0;
	};
}

export {
	createComparer as default, // Allow for default import.
	createComparer as by // Alias for Sort.by(...) instead of Sort.createComparer
}
