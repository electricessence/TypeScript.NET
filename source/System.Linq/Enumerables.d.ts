/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Primitive from "../System/Primitive";
import IDisposable from "../System/Disposable/IDisposable";
import {EndlessIEnumerable, FiniteIEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {Comparison, HashSelector, Selector, SelectorWithIndex} from "../System/FunctionTypes";
import IEnumerateEach from "../System/Collections/Enumeration/IEnumerateEach";
import EnumerableOrArrayLike from "../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";

export namespace System.Linq.Enumerable.Interfaces
{
	export interface Base<T>
		extends IDisposable
	{
		force():void;

		take(count:number):Finite<T>

		elementAt(index:number):T

		elementAtOrDefault(index:number):T | undefined

		elementAtOrDefault(index:number, defaultValue:T):T

		first():T

		firstOrDefault():T | undefined

		firstOrDefault(defaultValue:T):T

		single():T

		singleOrDefault():T | undefined

		singleOrDefault(defaultValue:T):T

		singleOrDefault(defaultValue?:T):T | undefined

		any():boolean

		isEmpty():boolean

		select<TResult>(selector:SelectorWithIndex<T, TResult>):Base<TResult>

		map<TResult>(selector:SelectorWithIndex<T, TResult>):Base<TResult>

		ofType<TType>(type:{ new(...params:any[]):TType }):Base<TType>

		selectMany<TResult>(
			collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):Base<TResult>

		selectMany<TElement, TResult>(
			collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
			resultSelector:(collection:T, element:TElement) => TResult):Base<TResult>

		/**
		 * Alternates values between this and the second set until either runs out.
		 * @param second
		 * @param resultSelector
		 */
		zip<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<TSecond>,
			resultSelector:(first:T, second:TSecond, index:number) => TResult):Finite<TResult>
		zip<TSecond, TResult>(
			second:EnumerableOrArrayLike<TSecond>,
			resultSelector:(first:T, second:TSecond, index:number) => TResult):Base<TResult>

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
				index:number) => TResult):Finite<TResult>
		zipMultiple<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
			resultSelector:(
				first:T,
				second:TSecond,
				index:number) => TResult):Base<TResult>

		join<TInner, TKey, TResult>(
			inner:FiniteEnumerableOrArrayLike<TInner>,
			outerKeySelector:Selector<T, TKey>,
			innerKeySelector:Selector<TInner, TKey>,
			resultSelector:(outer:T, inner:TInner) => TResult,
			compareSelector?:HashSelector<TKey>):Base<TResult>
	}

	export interface Finite<T>
		extends Base<T>, FiniteIEnumerable<T>, IEnumerateEach<T>
	{
		select<TResult>(selector:SelectorWithIndex<T, TResult>):Finite<TResult>

		map<TResult>(selector:SelectorWithIndex<T, TResult>):Finite<TResult>

		zipMultiple<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
			resultSelector:(
				first:T,
				second:TSecond,
				index:number) => TResult):Finite<TResult>
	}

	export interface Endless<T>
		extends Base<T>, EndlessIEnumerable<T>
	{
		select<TResult>(selector:SelectorWithIndex<T, TResult>):Endless<TResult>

		map<TResult>(selector:SelectorWithIndex<T, TResult>):Endless<TResult>
	}

	export interface NotEmpty<T>
	{
		aggregate(
			reduction:(previous:T, current:T, index?:number) => T):T;

		reduce(
			reduction:(previous:T, current:T, index?:number) => T):T;

		max():T

		min():T

		maxBy(keySelector?:Selector<T, Primitive>):T

		minBy(keySelector?:Selector<T, Primitive>):T

		any():true;

		isEmpty():false;
	}

	export interface Ordered<T>
	{
		thenBy(keySelector:(value:T) => any):Ordered<T>;

		thenByDescending(keySelector:(value:T) => any):Ordered<T>;

		thenUsing(comparison:Comparison<T>):Ordered<T>;

		thenUsingReversed(comparison:Comparison<T>):Ordered<T>;
	}
}

