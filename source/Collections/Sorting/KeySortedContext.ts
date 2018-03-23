/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Comparison, Selector} from "../../FunctionTypes";
import {Comparable} from "../../IComparable";
import IComparer from "../../IComparer";
import Functions from "../../Functions";
import SortContext from "./SortContext";
import Order from "./Order";
import compare from "../../Comparison/compare";

export default class KeySortedContext<T, TKey extends Comparable> extends SortContext<T>
{
	constructor(
		next:IComparer<T>|null,
		protected _keySelector:Selector<T,TKey>|null,
		order:Order = Order.Ascending,
		comparer:Comparison<T> = compare)
	{
		super(next, comparer, order);
	}

	compare(a:T, b:T):number
	{
		const _ = this;
		let ks = _._keySelector;
		if(!ks || ks==Functions.Identity) return super.compare(a, b);
		// We force <any> here since it can be a Primitive or IComparable<any>
		const d = compare(<any>ks(a), <any>ks(b));
		if(d==0 && _._next) return _._next.compare(a, b);
		return _._order*d;
	}
}
