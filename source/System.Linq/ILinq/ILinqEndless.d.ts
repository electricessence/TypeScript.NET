/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ILinqBase from "./ILinqBase";
import {EndlessIEnumerable} from "../../System/Collections/Enumeration/IEnumerable";
import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import {LinqFinite} from "./ILinqFinite";
import {HashSelector, Selector, SelectorWithIndex} from "../../System/FunctionTypes";

export declare interface ILinqEndless<T>
	extends ILinqBase<T>, EndlessIEnumerable<T>
{
	select<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqEndless<TResult>

	map<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqEndless<TResult>

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):ILinqEndless<TResult>

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):ILinqEndless<TResult>

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
		resultSelector:(first:T, second:TSecond, index:number) => TResult):ILinqBase<TResult>

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
			index:number) => TResult):ILinqBase<TResult>

	join<TInner, TKey, TResult>(
		inner:FiniteEnumerableOrArrayLike<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector?:HashSelector<TKey>):ILinqBase<TResult>

}