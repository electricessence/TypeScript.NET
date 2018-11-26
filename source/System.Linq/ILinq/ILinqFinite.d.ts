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
import ILinqBase from "./ILinqBase";
import ILinqSortable from "./ILinqSortable";
import ILinqOrdered from "./ILinqOrdered";
import IMap from "../../IMap";
import IDictionary from "../../System/Collections/Dictionaries/IDictionary";
import ILookup from "./ILookup";

export declare interface ILinqFinite<T>
	extends ILinqBase<T>, FiniteIEnumerable<T>, IEnumerateEach<T>
{
	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqFinite.Sortable<TResult>

	map<TResult>(selector:SelectorWithIndex<T, TResult>):LinqFinite.Sortable<TResult>

	// traverse():ILinqFinite.TraversalController<T>

	zipMultiple<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
		resultSelector:(
			first:T,
			second:TSecond,
			index:number) => TResult):LinqFinite.Sortable<TResult>

	toArray(predicate?:PredicateWithIndex<T>):T[]

	copyTo(target:T[], index?:number, count?:number):T[]

	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector?:SelectorWithIndex<T, TValue>,
		compareSelector?:HashSelector<TKey>):ILookup<TKey, TValue>

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

	merge(enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):LinqFinite.Sortable<T>

	concat(...enumerables:Array<FiniteEnumerableOrArrayLike<T>>):LinqFinite.Sortable<T>

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TResult> | null | undefined>):LinqFinite.Sortable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):LinqFinite.Sortable<TResult>

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
		compareSelector?:HashSelector<T>):LinqFinite.Sortable<T>

	sequenceEqual(
		second:FiniteEnumerableOrArrayLike<T>,
		equalityComparer?:EqualityComparison<T>):boolean

	reverse():ILinqFinite<T>

	shuffle():ILinqFinite<T>

	skipWhile(predicate:PredicateWithIndex<T>):LinqFinite.Sortable<T>

	skipToLast(count:number):this

	takeExceptLast(count?:number):this


	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqFinite.Sortable<TResult>

	map<TResult>(selector:SelectorWithIndex<T, TResult>):LinqFinite.Sortable<TResult>

	ofType<TType>(type:{ new(...params:any[]):TType }):LinqFinite.Sortable<TType>

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):LinqFinite.Sortable<TResult>

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):LinqFinite.Sortable<TResult>

	/**
	 * Alternates values between this and the second set until either runs out.
	 * @param second
	 * @param resultSelector
	 */
	zip<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<TSecond>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):LinqFinite.Sortable<TResult>

	zip<TSecond, TResult>(
		second:EnumerableOrArrayLike<TSecond>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):LinqFinite.Sortable<TResult>

	/**
	 * Rotates through all sets until any set is complete.
	 * @param second
	 * @param resultSelector
	 */
	zipMultiple<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<TSecond>>,
		resultSelector:(
			first:T,
			second:TSecond,
			index:number) => TResult):LinqFinite.Sortable<TResult>

	zipMultiple<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
		resultSelector:(
			first:T,
			second:TSecond,
			index:number) => TResult):LinqFinite.Sortable<TResult>

	join<TInner, TKey, TResult>(
		inner:FiniteEnumerableOrArrayLike<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector?:HashSelector<TKey>):LinqFinite.Sortable<TResult>

}

export declare namespace LinqFinite
{
	export type Sortable<T> = ILinqFinite<T> & ILinqSortable<T, ILinqFinite<T>>

	export type Ordered<T> = ILinqFinite<T> & ILinqOrdered<T, ILinqFinite<T>>

	export interface TraversalController<T>
	{
		depth(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):ILinqFinite<T>;

		depth<TNode>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):ILinqFinite<TNode>;

		depth<TResult>(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):ILinqFinite<TResult>;

		depth<TNode, TResult>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):ILinqFinite<TResult>;

		breadth(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):ILinqFinite<T>;

		breadth<TNode>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):ILinqFinite<TNode>;

		breadth<TResult>(
			childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):ILinqFinite<TResult>;

		breadth<TNode, TResult>(
			childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
			resultSelector:SelectorWithIndex<T, TResult>):ILinqFinite<TResult>;
	}
}

export default ILinqFinite;