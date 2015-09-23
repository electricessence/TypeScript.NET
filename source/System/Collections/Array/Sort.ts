/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="../../FunctionTypes.ts"/>

import Types = require('../../Types');
import ValueCompare = require('../../Compare');
import CompareResult = ValueCompare.CompareResult;

module Sort
{
	export const enum Order
	{
		Ascending  = (+1) | 0,
		Descending = (-1) | 0
	}

	function ensureArray<T>(value:T|T[]):T[] {
		return value instanceof Array
			? <T[]>value
			: [<T>value];
	}

	export function createComparer<TSource,T>(
		selector:Selector<TSource|TSource[],T>,
		order:Order | Order[] = Order.Ascending,
		equivalentToNaN:any = NaN):Comparison<TSource|TSource[]>
	{
		var nanHasEquivalent = !Types.isTrueNaN(equivalentToNaN);

		return (a:TSource|TSource[], b:TSource|TSource[]):CompareResult=> {
			// Use an array always to ensure a single code path.
			var aValue = ensureArray(selector(a));
			var bValue = ensureArray(selector(b));
			var len = Math.min(aValue.length, bValue.length);

			var oArray:Order[] = order instanceof Array ? <Order[]>order : null;
			for(var i = 0; i<len; i++)
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

				var r = ValueCompare.compare(vA, vB);
				if(r!==CompareResult.Equal)
					return o*r;

			}

			return 0;
		};
	}
}
Object.freeze(Sort);

export = Sort;

