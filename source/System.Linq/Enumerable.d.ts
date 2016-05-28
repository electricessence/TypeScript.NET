///<reference path="../System/IComparable.d.ts"/>

import {Action, Predicate, Selector, EqualityComparison, Comparison} from "../System/FunctionTypes";
import {IEnumerableOrArray} from "../System/Collections/IEnumerableOrArray";
import {IArray} from "../System/Collections/Array/IArray";
import {IMap, IDictionary} from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";
import {IEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {IDisposable} from "../System/Disposable/IDisposable";

export interface IInfiniteEnumerable<T> extends IEnumerable<T>, IDisposable
{
	force():void;

	skip(count:number):IInfiniteEnumerable<T>;

	take(count:number):IFiniteEnumerable<T>;

	elementAt(index:number):T;

	elementAtOrDefault(index:number, defaultValue?:T):T;

	first():T;

	firstOrDefault(defaultValue?:T):T;

	single():T;

	singleOrDefault(defaultValue?:T):T;

	any():boolean;

	isEmpty():boolean;

	traverseBreadthFirst(childrenSelector:(element:T) => IEnumerableOrArray<T>):ILinqEnumerable<T>;
	traverseBreadthFirst<TNode>(childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>):ILinqEnumerable<TNode>;
	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):ILinqEnumerable<TResult>;
	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):ILinqEnumerable<TResult>;

	traverseDepthFirst(childrenSelector:(element:T) => IEnumerableOrArray<T>):ILinqEnumerable<T>;
	traverseDepthFirst<TNode>(childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>):ILinqEnumerable<TNode>;
	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):ILinqEnumerable<TResult>;
	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):ILinqEnumerable<TResult>;

	flatten():ILinqEnumerable<any>;

	pairwise<TSelect>(selector:(prev:T, current:T) => TSelect):ILinqEnumerable<TSelect>;

	scan(func:(a:T, b:T) => T, seed?:T):ILinqEnumerable<T>;

	select<TResult>(selector:Selector<T, TResult>):IInfiniteEnumerable<TResult>;

	selectMany<TResult>(collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):IInfiniteEnumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement) => TResult):IInfiniteEnumerable<TResult>;

	choose():IInfiniteEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):IInfiniteEnumerable<TResult>;

	where(predicate:Predicate<T>):IInfiniteEnumerable<T>;

	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):IInfiniteEnumerable<TType>;

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):IInfiniteEnumerable<T>;

	distinct(compareSelector?:(value:T) => T):IInfiniteEnumerable<T>;

	distinctUntilChanged<TCompare>(compareSelector?:Selector<T, TCompare>):IInfiniteEnumerable<T>;

	defaultIfEmpty(defaultValue?:T):ILinqEnumerable<T>;

	zip<TSecond, TResult>(
		second:IEnumerableOrArray<TSecond>,
		resultSelector:(
			first:T,
			second:TSecond,
			index?:number) => TResult):ILinqEnumerable<TResult>;

	zipMultiple<TSecond, TResult>(
		second:IArray<IEnumerableOrArray<TSecond>>,
		resultSelector:(
			first:T,
			second:TSecond,
			index?:number) => TResult):ILinqEnumerable<TResult>;

	join<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector?:Selector<TKey, TCompare>):ILinqEnumerable<TResult>;

	groupJoin<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[]) => TResult,
		compareSelector?:Selector<TKey, TCompare>):ILinqEnumerable<TResult>;

	merge(enumerables:IArray<IEnumerableOrArray<T>>):IInfiniteEnumerable<T>;

	concat(...enumerables:Array<IEnumerableOrArray<T>>):IInfiniteEnumerable<T>;

	union<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):ILinqEnumerable<T>;

	insertAt(index:number, other:IEnumerableOrArray<T>):ILinqEnumerable<T>;

	alternateMultiple(sequence:IEnumerableOrArray<T>):ILinqEnumerable<T>;

	alternateSingle(value:T):ILinqEnumerable<T>;

	alternate(...sequence:T[]):ILinqEnumerable<T>;

	catchError(handler:(e:any) => void):IInfiniteEnumerable<T>;

	finallyAction(action:() => void):IInfiniteEnumerable<T>;

	buffer(size:number):IInfiniteEnumerable<T[]>;

	share():IInfiniteEnumerable<T>;
}
export interface ILinqEnumerable<T> extends IInfiniteEnumerable<T>
{
	skip(count:number):ILinqEnumerable<T>;

	skipWhile(predicate:Predicate<T>):ILinqEnumerable<T>;

	takeWhile(predicate:Predicate<T>):ILinqEnumerable<T>;

	takeUntil(predicate:Predicate<T>, includeUntilValue?:boolean):ILinqEnumerable<T>;

	forEach(action:Predicate<T> | Action<T>):void;

	toArray(predicate?:Predicate<T>):T[];

	copyTo(target:T[], index?:number, count?:number):T[];

	toLookup<TKey, TValue, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TValue>,
		compareSelector?:Selector<TKey, TCompare>):ILookup<TKey, TValue>;

	toMap<TResult>(
		keySelector:Selector<T, string>,
		elementSelector:Selector<T, TResult>):IMap<TResult>;

	toDictionary<TKey, TValue, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TValue>,
		compareSelector?:Selector<TKey, TCompare>):IDictionary<TKey, TValue>;

	toJoinedString(separator?:string, selector?:Selector<T, string>):string;

	takeExceptLast(count?:number):ILinqEnumerable<T>;

	skipToLast(count:number):ILinqEnumerable<T>;

	where(predicate:Predicate<T>):ILinqEnumerable<T>;

	select<TResult>(selector:Selector<T, TResult>):ILinqEnumerable<TResult>;

	selectMany<TResult>(collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):ILinqEnumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement) => TResult):ILinqEnumerable<TResult>;

	choose():ILinqEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):ILinqEnumerable<TResult>;

	reverse():ILinqEnumerable<T>;

	shuffle():ILinqEnumerable<T>;

	count(predicate?:Predicate<T>):number;

	all(predicate:Predicate<T>):boolean;

	every(predicate:Predicate<T>):boolean;

	any(predicate?:Predicate<T>):boolean;

	some(predicate:Predicate<T>):boolean;

	contains<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):boolean;

	indexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number;

	lastIndexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number;

	merge(enumerables:IArray<IEnumerableOrArray<T>>):ILinqEnumerable<T>;

	concat(...enumerables:Array<IEnumerableOrArray<T>>):ILinqEnumerable<T>;

	intersect<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):ILinqEnumerable<T>;

	sequenceEqual(second:IEnumerableOrArray<T>, equalityComparer?:EqualityComparison<T>):boolean;

	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):ILinqEnumerable<TType>;

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):ILinqEnumerable<T>;

	distinct(compareSelector?:(value:T) => T):ILinqEnumerable<T>;

	distinctUntilChanged<TCompare>(compareSelector?:Selector<T, TCompare>):ILinqEnumerable<T>;

	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;

	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;

	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;

	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;

	buffer(size:number):ILinqEnumerable<T[]>;

	groupBy<TKey>(keySelector:Selector<T, TKey>):ILinqEnumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, T>,
		compareSelector?:Selector<TKey, TCompare>):ILinqEnumerable<IGrouping<TKey, T>>;

	partitionBy<TKey>(keySelector:Selector<T, TKey>):ILinqEnumerable<IGrouping<TKey, T>>;
	partitionBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>,
		compareSelector?:Selector<TKey, TCompare>):ILinqEnumerable<IGrouping<TKey, TElement>>;

	aggregate(func:(a:T, b:T) => T, seed?:T):T;

	average(selector?:Selector<T, number>):number;

	max():T;

	min():T;

	maxBy<TCompare>(keySelector?:Selector<T, TCompare>):T;

	minBy<TCompare>(keySelector?:Selector<T, TCompare>):T;

	sum(selector?:Selector<T, number>):number;

	product(selector?:Selector<T, number>):number;

	quotient(selector?:Selector<T, number>):number;

	last():T;

	lastOrDefault(defaultValue?:T):T;

	share():ILinqEnumerable<T>;

	catchError(handler:(e:any) => void):ILinqEnumerable<T>;

	finallyAction(action:() => void):ILinqEnumerable<T>;

	memoize():ILinqEnumerable<T>;
}
export interface IFiniteEnumerable<T> extends ILinqEnumerable<T>
{

}
export interface IGrouping<TKey, TElement> extends ILinqEnumerable<TElement>
{
	key:TKey;
}
export interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>>
{
	count:number;
	get(key:TKey):TElement[];
	contains(key:TKey):boolean;
}
export interface IOrderedEnumerable<T> extends IFiniteEnumerable<T>
{
	thenBy(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenByDescending(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;
	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;
}