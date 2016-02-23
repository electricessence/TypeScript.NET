/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../../FunctionTypes.d.ts"/>
///<reference path="../../IComparer.d.ts"/>
///<reference path="../../Primitive.d.ts"/>
///<reference path="../Array/IArray.d.ts"/>
///<reference path="Order.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import * as Values from '../../Compare'
import SortContext from "./SortContext";
import Functions from "../../Functions";

type Comparable = Primitive|IComparable<any>

export default
class KeySortedContext<T, TKey extends Comparable> extends SortContext<T>
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
