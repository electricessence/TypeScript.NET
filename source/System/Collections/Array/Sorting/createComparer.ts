/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import {Type} from "../../../Types";
import {compare} from "../../../Compare";
import {Primitive} from "../../../Primitive";
import {Selector, Comparison} from "../../../FunctionTypes";
import {CompareResult} from "../../../CompareResult";
import {Order} from "../../Sorting/Order";

function ensureArray<T>(value:T|T[]):T[]
{
	return (value)instanceof(Array)
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
 * @returns {(a:TSource, b:TSource)=>CompareResult}
 */
export function createComparer<TSource,TSelect extends Primitive>(
	selector:Selector<TSource,TSelect|TSelect[]>,
	order:Order | Order[] = Order.Ascending,
	equivalentToNaN:any = NaN):Comparison<TSource>
{
	const nanHasEquivalent = !Type.isTrueNaN(equivalentToNaN);

	return (a:TSource, b:TSource):CompareResult=>
	{
		// Use an array always to ensure a single code path.
		const aValue = ensureArray(selector(a));
		const bValue = ensureArray(selector(b));
		const len = Math.min(aValue.length, bValue.length);

		const oArray = (order)instanceof(Array) ? order : null;
		for(let i = 0; i<len; i++)
		{
			let vA = aValue[i],
			    vB = bValue[i];
			const o = oArray
				? (i<oArray.length ? oArray[i] : Order.Ascending)
				: <Order>order;

			if(nanHasEquivalent)
			{
				if(Type.isTrueNaN(vA))
					vA = equivalentToNaN;
				if(Type.isTrueNaN(vB))
					vB = equivalentToNaN;

			}

			const r = compare(vA, vB);
			if(r!==CompareResult.Equal)
				return o*r;

		}

		return 0;
	};
}

