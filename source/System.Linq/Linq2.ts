/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {
	Action,
	Closure,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../System/FunctionTypes";
import EnumerableOrArrayLike from "../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";
import Interfaces from "./Enumerables";

export namespace Enumerable
{
	abstract class Base<T>
		implements Interfaces.Base<T>
	{
		alternateMultiple(sequence:FiniteEnumerableOrArrayLike<T>):this
		{
			return undefined;
		}

		alternateSingle(value:T):this
		{
			return undefined;
		}

		any():boolean
		{
			return false;
		}

		buffer(size:number):this
		{
			return undefined;
		}

		catchError(handler:Action<any>):this
		{
			return undefined;
		}

		defaultIfEmpty(defaultValue?:T):this & Interfaces.Sortable<T> & Interfaces.NotEmpty<T>
		{
			return undefined;
		}

		dispose():void
		{
		}

		distinct(compareSelector?:HashSelector<T>):this
		{
			return undefined;
		}

		distinctUntilChanged(compareSelector?:HashSelector<T>):this
		{
			return undefined;
		}

		elementAt(index:number):T
		{
			return undefined;
		}

		elementAtOrDefault(index:number):T | undefined;
		elementAtOrDefault(index:number, defaultValue:T):T;
		elementAtOrDefault(index:number, defaultValue?:T):any
		{
		}

		except(second:FiniteEnumerableOrArrayLike<T>, compareSelector?:HashSelector<T>):this
		{
			return undefined;
		}

		finallyAction(action:Closure):this
		{
			return undefined;
		}

		first():T
		{
			return undefined;
		}

		firstOrDefault():T | undefined;
		firstOrDefault(defaultValue:T):T;
		firstOrDefault(defaultValue?:T):any
		{
		}

		flatten<TFlat>():Interfaces.Base<TFlat>;
		flatten():Interfaces.Base<any>;
		flatten():any
		{
		}

		force():void
		{
		}

		insertAt(index:number, other:FiniteEnumerableOrArrayLike<T>):this
		{
			return undefined;
		}

		isEmpty():boolean
		{
			return false;
		}

		join<TInner, TKey, TResult>(
			inner:FiniteEnumerableOrArrayLike<TInner>,
			outerKeySelector:Selector<T, TKey>,
			innerKeySelector:Selector<TInner, TKey>,
			resultSelector:(outer:T, inner:TInner) => TResult,
			compareSelector?:HashSelector<TKey>):Interfaces.Base<TResult>
		{
			return undefined;
		}

		map<TResult>(selector:SelectorWithIndex<T, TResult>):Interfaces.Base<TResult>
		{
			return undefined;
		}

		memoize():this
		{
			return undefined;
		}

		nonNull():this
		{
			return undefined;
		}

		ofType<TType>(type:{ new(...params:any[]):TType }):Interfaces.Base<TType>
		{
			return undefined;
		}

		select<TResult>(selector:SelectorWithIndex<T, TResult>):Interfaces.Base<TResult>
		{
			return undefined;
		}

		selectMany<TResult>(collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):Interfaces.Base<TResult> & Interfaces.Sortable<TResult>;
		selectMany<TElement, TResult>(
			collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
			resultSelector:(collection:T, element:TElement) => TResult):Interfaces.Base<TResult>;
		selectMany(collectionSelector, resultSelector?):any
		{
		}

		share():this
		{
			return undefined;
		}

		single():T
		{
			return undefined;
		}

		singleOrDefault():T | undefined;
		singleOrDefault(defaultValue:T):T;
		singleOrDefault(defaultValue?:T):T | undefined;
		singleOrDefault(defaultValue?:T):any
		{
		}

		skip(count:number):this
		{
			return undefined;
		}

		take(count:number):Interfaces.Finite.Sortable<T>
		{
			return undefined;
		}

		takeUntil(predicate:PredicateWithIndex<T>, includeUntilValue?:boolean):this
		{
			return undefined;
		}

		takeWhile(predicate:PredicateWithIndex<T>):this
		{
			return undefined;
		}

		traverse():Interfaces.Base.TraversalController<T>
		{
			return undefined;
		}

		where(predicate:PredicateWithIndex<T>):this
		{
			return undefined;
		}

		zip<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<TSecond>,
			resultSelector:(first:T,
				second:TSecond,
				index:number) => TResult):Interfaces.Finite.Sortable<TResult>;
		zip<TSecond, TResult>(
			second:EnumerableOrArrayLike<TSecond>,
			resultSelector:(first:T,
				second:TSecond,
				index:number) => TResult):Interfaces.Base<TResult>;
		zip(second, resultSelector):any
		{
		}

		zipMultiple<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<TSecond>>,
			resultSelector:(first:T,
				second:TSecond,
				index:number) => TResult):Interfaces.Finite.Sortable<TResult>;
		zipMultiple<TSecond, TResult>(
			second:FiniteEnumerableOrArrayLike<EnumerableOrArrayLike<TSecond>>,
			resultSelector:(first:T,
				second:TSecond,
				index:number) => TResult):Interfaces.Base<TResult>;
		zipMultiple(second, resultSelector):any
		{
		}

	}

}