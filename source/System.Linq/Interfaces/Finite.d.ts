/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import IEnumerateEach from "../../System/Collections/Enumeration/IEnumerateEach";
import {FiniteIEnumerable} from "../../System/Collections/Enumeration/IEnumerable";
import {
	EqualityComparison,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../../System/FunctionTypes";
import Base from "./Base";
import SortableEnumerable from "./Sortable";
import OrderedEnumerable from "./Ordered";
import IMap from "../../IMap";
import IDictionary from "../../System/Collections/Dictionaries/IDictionary";
import Lookup from "./Lookup";

declare interface Finite<T>
	extends Base<T>, FiniteIEnumerable<T>, IEnumerateEach<T>
{
	select<TResult>(selector:SelectorWithIndex<T, TResult>):Finite.Sortable<TResult>

	map<TResult>(selector:SelectorWithIndex<T, TResult>):Finite.Sortable<TResult>

	traverse():Finite.TraversalController<T>

	zipMultiple<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
		resultSelector:(
			first:T,
			second:TSecond,
			index:number) => TResult):Finite.Sortable<TResult>

	toArray(predicate?:PredicateWithIndex<T>):T[]

	copyTo(target:T[], index?:number, count?:number):T[]

	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector?:SelectorWithIndex<T, TValue>,
		compareSelector?:HashSelector<TKey>):Lookup<TKey, TValue>

	toMap<TResult>(
		keySelector:SelectorWithIndex<T, string | number | symbol>,
		elementSelector:SelectorWithIndex<T, TResult>):IMap<TResult>

	toDictionary<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue>,
		compareSelector?:HashSelector<TKey>):IDictionary<TKey, TValue>

	toJoinedString(
		separator?:string,
		selector?:Selector<T, string>):string

	merge(enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):Finite.Sortable<T>

	concat(...enumerables:Array<FiniteEnumerableOrArrayLike<T>>):Finite.Sortable<T>

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TResult> | null | undefined>):Finite.Sortable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):Finite.Sortable<TResult>

	count(predicate?:PredicateWithIndex<T>):number

	all(predicate:PredicateWithIndex<T>):boolean

	every(predicate:PredicateWithIndex<T>):boolean

	any(predicate?:PredicateWithIndex<T>):boolean

	some(predicate?:PredicateWithIndex<T>):boolean

	contains(value:T, compareSelector?:Selector<T, any>):boolean

	indexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number

	lastIndexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number

	intersect(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector?:HashSelector<T>):Finite.Sortable<T>

	sequenceEqual(
		second:FiniteEnumerableOrArrayLike<T>,
		equalityComparer?:EqualityComparison<T>):boolean

	reverse():Finite<T>

	shuffle():Finite<T>

	skipWhile(predicate:PredicateWithIndex<T>):Finite.Sortable<T>

	skipToLast(count:number):this

	takeExceptLast(count?:number):this
}

declare namespace Finite
{
	export type Sortable<T> = Finite<T> & SortableEnumerable<T>

	export type Ordered<T> = Finite<T> & OrderedEnumerable<T>

	export interface TraversalController<T>
	{
		depth(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Finite<T>;

		depth<TNode>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Finite<TNode>;

		depth<TResult>(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):Finite<TResult>;

		depth<TNode, TResult>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):Finite<TResult>;

		breadth(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Finite<T>;

		breadth<TNode>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Finite<TNode>;

		breadth<TResult>(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):Finite<TResult>;

		breadth<TNode, TResult>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):Finite<TResult>;
	}
}

export default Finite;