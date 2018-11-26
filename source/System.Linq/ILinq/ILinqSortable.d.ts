/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparable} from "../../System/IComparable";
import {Comparison, Selector} from "../../System/FunctionTypes";
import ILinqOrdered from "./ILinqOrdered";

export default interface ILinqSortable<T, TSource>
{
	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):ILinqOrdered<T, TSource> & TSource

	orderUsing(comparison:Comparison<T>):ILinqOrdered<T, TSource> & TSource

	orderUsingReversed(comparison:Comparison<T>):ILinqOrdered<T, TSource> & TSource

	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):ILinqOrdered<T, TSource> & TSource
}