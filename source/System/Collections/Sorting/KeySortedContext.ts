/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import * as Values from "../../Compare";
import {SortContext} from "./SortContext";
import {Functions} from "../../Functions";
import {Comparison, Selector} from "../../FunctionTypes";
import {Comparable} from "../../IComparable";
import {IComparer} from "../../IComparer";
import {Order} from "./Order";

export class KeySortedContext<T, TKey extends Comparable> extends SortContext<T>
{
	constructor(
		next:IComparer<T>,
		protected _keySelector:Selector<T,TKey>,
		order:Order = Order.Ascending,
		comparer:Comparison<T> = Values.compare)
	{
		super(next, comparer, order);
	}

	compare(a:T, b:T):number
	{
		var _ = this, ks = _._keySelector;
		if(!ks || ks==Functions.Identity) return super.compare(a, b);
		// We force <any> here since it can be a Primitive or IComparable<any>
		var d = Values.compare(<any>ks(a), <any>ks(b));
		if(d==0 && _._next) return _._next.compare(a, b);
		return _._order*d;
	}
}

export default KeySortedContext;