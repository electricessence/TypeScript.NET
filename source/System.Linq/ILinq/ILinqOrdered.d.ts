/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparison} from "../../System/FunctionTypes";

export default interface ILinqOrdered<T, TSource>
{
	thenBy(keySelector:(value:T) => any):ILinqOrdered<T, TSource> & TSource;

	thenByDescending(keySelector:(value:T) => any):ILinqOrdered<T, TSource> & TSource;

	thenUsing(comparison:Comparison<T>):ILinqOrdered<T, TSource> & TSource;

	thenUsingReversed(comparison:Comparison<T>):ILinqOrdered<T, TSource> & TSource;
}