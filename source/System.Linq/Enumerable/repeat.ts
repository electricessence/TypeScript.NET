/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import Integer from "../../System/Integer";
import {
	EndlessEnumeratorBase,
	FiniteEnumeratorBase
} from "../../System/Collections/Enumeration/EnumeratorBase";
import EndlessLinqEnumerable, {ILinqEndless} from "../EndlessLinqEnumerable";
import FiniteLinqEnumerable, {ILinqFinite} from "../FiniteLinqEnumerable";
import empty from "./empty";

export function repeat<T>(element:T):ILinqEndless<T>;
export function repeat<T>(element:T, count:number):ILinqFinite<T>;
export function repeat<T>(element:T, count:number = Infinity):any
{
	if(!(count>0))
		return empty();

	return isFinite(count) && Integer.assert(count, "count")

		? new FiniteLinqEnumerable<T>(
			() => {
				let c:number = count;
				let index:number = 0;

				return new FiniteEnumeratorBase<T>(
					() => { index = 0; },
					(yielder) => (index++<c) && yielder.yieldReturn(element)
				);
			}
		)

		: new EndlessLinqEnumerable<T>(
			() =>
				new EndlessEnumeratorBase<T>(
					null,
					(yielder) => yielder.yieldReturn(element)
				)
		);
}
