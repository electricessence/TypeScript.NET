/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import {IDisposable} from "../../System/Disposable/IDisposable";
import {
	Action,
	Closure,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../../System/FunctionTypes";
import Finite from "./Finite";
import NotEmpty from "./NotEmpty";
import Sortable from "./Sortable";
import {TraversalController} from "./TraversalController";

export default interface Base<T>
	extends IDisposable
{
	force():void

	take(count:number):Finite.Sortable<T>

	takeWhile(predicate:PredicateWithIndex<T>):this

	takeUntil(predicate:PredicateWithIndex<T>, includeUntilValue?:boolean):this

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
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):Base<TResult> & Sortable<TResult>

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
		resultSelector:(first:T, second:TSecond, index:number) => TResult):Finite.Sortable<TResult>

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
			index:number) => TResult):Finite.Sortable<TResult>

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

	memoize():this

	skip(count:number):this

	where(predicate:PredicateWithIndex<T>):this

	nonNull():this

	except(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector?:HashSelector<T>):this

	distinct(compareSelector?:HashSelector<T>):this

	distinctUntilChanged(compareSelector?:HashSelector<T>):this

	defaultIfEmpty(defaultValue?:T):this & Sortable<T> & NotEmpty<T>

	insertAt(index:number, other:FiniteEnumerableOrArrayLike<T>):this

	alternateMultiple(sequence:FiniteEnumerableOrArrayLike<T>):this

	alternateSingle(value:T):this

	catchError(handler:Action<any>):this

	finallyAction(action:Closure):this

	buffer(size:number):this

	share():this

	traverse():TraversalController<T>

	flatten<TFlat>():Base<TFlat>
	flatten():Base<any>
}