/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import Primitive from "../System/Primitive";
import IDisposable from "../System/Disposable/IDisposable";
import {EndlessIEnumerable, FiniteIEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {
	Action,
	Closure,
	Comparison,
	EqualityComparison,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../System/FunctionTypes";
import IEnumerateEach from "../System/Collections/Enumeration/IEnumerateEach";
import EnumerableOrArrayLike from "../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";
import IMap from "../IMap";
import IDictionary from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";

declare namespace Interfaces
{
	export interface Base<T>
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

		traverse():Base.TraversalController<T>

		flatten<TFlat>():Base<TFlat>
		flatten():Base<any>
	}

	export namespace Base
	{
		export interface TraversalController<T>
		{
			depth(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Base<T>;

			depth<TNode>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Base<TNode>;

			depth<TResult>(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

			depth<TNode, TResult>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

			breadth(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Base<T>;

			breadth<TNode>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Base<TNode>;

			breadth<TResult>(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;

			breadth<TNode, TResult>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Base<TResult>;
		}
	}

	export interface Endless<T>
		extends Base<T>, EndlessIEnumerable<T>
	{
		select<TResult>(selector:SelectorWithIndex<T, TResult>):Endless<TResult>

		map<TResult>(selector:SelectorWithIndex<T, TResult>):Endless<TResult>

		traverse():Endless.TraversalController<T>
	}

	export namespace Endless
	{
		export interface TraversalController<T>
		{
			depth(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Endless<T>;

			depth<TNode>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Endless<TNode>;

			depth<TResult>(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Endless<TResult>;

			depth<TNode, TResult>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Endless<TResult>;

			breadth(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):Endless<T>;

			breadth<TNode>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):Endless<TNode>;

			breadth<TResult>(
				childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Endless<TResult>;

			breadth<TNode, TResult>(
				childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
				resultSelector:SelectorWithIndex<T, TResult>):Endless<TResult>;
		}
	}

	export interface Finite<T>
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

	export namespace Finite
	{
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

		export type Sortable<T> = Finite<T> & SortableEnumerable<T>

		export type Ordered<T> = Finite<T> & OrderedEnumerable<T>
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

	export interface Sortable<T>
	{
		orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):Finite.Ordered<T>

		orderUsing(comparison:Comparison<T>):Finite.Ordered<T>

		orderUsingReversed(comparison:Comparison<T>):Finite.Ordered<T>

		orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):Finite.Ordered<T>
	}

	type SortableEnumerable<T> = Sortable<T>

	export interface Ordered<T>
	{
		thenBy(keySelector:(value:T) => any):Finite.Ordered<T>;

		thenByDescending(keySelector:(value:T) => any):Finite.Ordered<T>;

		thenUsing(comparison:Comparison<T>):Finite.Ordered<T>;

		thenUsingReversed(comparison:Comparison<T>):Finite.Ordered<T>;
	}

	type OrderedEnumerable<T> = Ordered<T>

	export interface Lookup<TKey, TElement>
	{
		readonly count:number;

		get(key:TKey):TElement[] | null

		contains(key:TKey):boolean;

		getEnumerator():FiniteIEnumerable<Grouping<TKey, TElement>>
	}

	export interface Grouping<TKey, T>
		extends Finite<T>, Sortable<T>
	{
		readonly key:TKey;
	}
}

export default Interfaces;