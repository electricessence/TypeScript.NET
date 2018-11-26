/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparable} from "../../System/IComparable";
import {Comparison, Selector} from "../../System/FunctionTypes";
import ILinqOrdered from "./ILinqOrdered";

export default interface ILinqSortable<T>
{
	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):ILinqOrdered<T>

	orderUsing(comparison:Comparison<T>):ILinqOrdered<T>

	orderUsingReversed(comparison:Comparison<T>):ILinqOrdered<T>

	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):ILinqOrdered<T>
}