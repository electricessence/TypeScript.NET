/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Comparable} from "../../System/IComparable";
import {Comparison, Selector} from "../../System/FunctionTypes";
import Finite from "./Finite";

export default interface Sortable<T>
{
	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):Finite.Ordered<T>

	orderUsing(comparison:Comparison<T>):Finite.Ordered<T>

	orderUsingReversed(comparison:Comparison<T>):Finite.Ordered<T>

	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):Finite.Ordered<T>
}