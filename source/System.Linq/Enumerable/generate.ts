/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import ArgumentNullException from "../../System/Exceptions/ArgumentNullException";
import Integer from "../../System/Integer";
import {
	EndlessEnumeratorBase,
	FiniteEnumeratorBase
} from "../../System/Collections/Enumeration/EnumeratorBase";

import {ILinqEndless} from "../ILinq/ILinqEndless";
import {ILinqFinite} from "../ILinq/ILinqFinite";
import empty from "./empty";
import throwObjectDisposed from "../throwObjectDisposed";

import EndlessLinqEnumerable from "../EndlessLinqEnumerable";
import FiniteLinqEnumerable from "../FiniteLinqEnumerable";

export default function <T>(factory:() => T):ILinqEndless<T>;
export default function <T>(factory:() => T, count:number):ILinqFinite<T>;
export default function <T>(factory:(index:number) => T):ILinqEndless<T>;
export default function <T>(factory:(index:number) => T, count:number):ILinqFinite<T>;
export default function <T>(
	factory:Function,
	count:number = Infinity):any {
	if(!factory)
		throw new ArgumentNullException("factory");

	if(isNaN(count) || count<=0)
		return empty();

	return isFinite(count) && Integer.assert(count, "count")

		? new FiniteLinqEnumerable<T>(
			() => {
				let c:number = count;
				let index:number = 0;

				return new FiniteEnumeratorBase<T>(
					() => {
						index = 0;
					},

					(yielder) => {
						throwObjectDisposed(!factory, "FiniteLinqEnumerable");
						let current:number = index++;
						return current<c && yielder.yieldReturn(factory(current));
					}
				);
			},
			() => {
				factory = <any>null;
			})

		: new EndlessLinqEnumerable<T>(
			() => {
				let index:number = 0;
				return new EndlessEnumeratorBase<T>(
					() => {
						index = 0;
					},

					(yielder) => {
						throwObjectDisposed(!factory, "EndlessLinqEnumerable");
						return yielder.yieldReturn(factory(index++));
					}
				);
			},
			() => {
				factory = <any>null;
			});
}

