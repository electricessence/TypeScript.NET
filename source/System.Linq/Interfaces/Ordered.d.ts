/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparison} from "../../System/FunctionTypes";
import Finite from "./Finite";

export default interface Ordered<T>
{
	thenBy(keySelector:(value:T) => any):Finite.Ordered<T>;

	thenByDescending(keySelector:(value:T) => any):Finite.Ordered<T>;

	thenUsing(comparison:Comparison<T>):Finite.Ordered<T>;

	thenUsingReversed(comparison:Comparison<T>):Finite.Ordered<T>;
}