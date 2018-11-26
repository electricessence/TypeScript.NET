/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparison} from "../../System/FunctionTypes";

export default interface ILinqOrdered<T>
{
	thenBy(keySelector:(value:T) => any):ILinqOrdered<T>;

	thenByDescending(keySelector:(value:T) => any):ILinqOrdered<T>;

	thenUsing(comparison:Comparison<T>):ILinqOrdered<T>;

	thenUsingReversed(comparison:Comparison<T>):ILinqOrdered<T>;
}