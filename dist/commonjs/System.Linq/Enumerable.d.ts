/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {IEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import {
	Action,
	ActionWithIndex,
	Closure,
	Comparison,
	EqualityComparison,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex,
	HashSelector
} from "../System/FunctionTypes";
import {IDictionary, IMap} from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";
import {EnumerableAction} from "./EnumerableAction";
import {IEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {IDisposable} from "../System/Disposable/IDisposable";
import {Primitive} from "../System/Primitive";
import {ForEachEnumerable} from "../System/Collections/Enumeration/ForEachEnumerable";

export interface IInfiniteEnumerable<T> extends IEnumerable<T>, IDisposable
{
	getEnumerator():IEnumerator<T>;
	asEnumerable():this;
	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer:Closure|null,
		isEndless:true,
		onComplete?:Action<number>):IInfiniteEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure|null,
		isEndless?:boolean|null|undefined,
		onComplete?:Action<number>):ILinqEnumerable<T>
	force():void;
	skip(count:number):IInfiniteEnumerable<T>;
	take(count:number):IFiniteEnumerable<T>;
	elementAt(index:number):T;
	elementAtOrDefault(index:number):T | undefined;
	elementAtOrDefault(index:number, defaultValue:T):T;
	first():T;
	firstOrDefault():T | undefined;
	firstOrDefault(defaultValue:T):T;
	single():T;
	singleOrDefault():T | undefined;
	singleOrDefault(defaultValue:T):T;
	any():boolean;
	isEmpty():boolean;
	traverseDepthFirst(childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined):ILinqEnumerable<T>;
	traverseDepthFirst<TNode>(childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined):ILinqEnumerable<TNode>;
	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	flatten<TFlat>():IInfiniteEnumerable<TFlat>;
	flatten():IInfiniteEnumerable<any>;
	pairwise<TSelect>(selector:(prev:T, current:T) => TSelect):IInfiniteEnumerable<TSelect>;
	scan(func:(a:T, b:T) => T, seed?:T):this;
	select<TResult>(selector:SelectorWithIndex<T, TResult>):IInfiniteEnumerable<TResult>;
	map<TResult>(selector:SelectorWithIndex<T, TResult>):IInfiniteEnumerable<TResult>;
	selectMany<TResult>(collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>):IInfiniteEnumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):IInfiniteEnumerable<TResult>;
	choose():IInfiniteEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):IInfiniteEnumerable<TResult>;
	where(predicate:PredicateWithIndex<T>):this;
	filter(predicate:PredicateWithIndex<T>):this;
	nonNull():this;
	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):IInfiniteEnumerable<TType>;
	except(second:ForEachEnumerable<T>, compareSelector?:HashSelector<T>):this;
	distinct(compareSelector?:HashSelector<T>):this
	distinctUntilChanged(compareSelector?:HashSelector<T>):this
	defaultIfEmpty(defaultValue?:T):this;
	zip<TSecond, TResult>(
		second:ForEachEnumerable<TSecond>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):ILinqEnumerable<TResult>;
	zipMultiple<TSecond, TResult>(
		second:ArrayLike<ForEachEnumerable<TSecond>>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):ILinqEnumerable<TResult>;
	join<TInner, TKey, TResult>(
		inner:ForEachEnumerable<TInner>,
		outerKeySelector:Selector<T, TKey>, innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector?:HashSelector<TKey>):ILinqEnumerable<TResult>;
	groupJoin<TInner, TKey, TResult>(
		inner:ForEachEnumerable<TInner>,
		outerKeySelector:Selector<T, TKey>, innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[] | null) => TResult,
		compareSelector?:HashSelector<TKey>):ILinqEnumerable<TResult>;
	merge(enumerables:ArrayLike<ForEachEnumerable<T>>):this;
	concat(...enumerables:Array<ForEachEnumerable<T>>):this;
	union(second:ForEachEnumerable<T>, compareSelector?:HashSelector<T>):this;
	insertAt(index:number, other:ForEachEnumerable<T>):this;
	alternateMultiple(sequence:ForEachEnumerable<T>):this;
	alternateSingle(value:T):this;
	alternate(...sequence:T[]):this;
	catchError(handler:(e:any) => void):this;
	finallyAction(action:Closure):this;
	buffer(size:number):IInfiniteEnumerable<T[]>;
	share():this;
	memoize():IInfiniteEnumerable<T>
}
export interface ILinqEnumerable<T> extends IInfiniteEnumerable<T>
{
	skip(count:number):ILinqEnumerable<T>;
	skipWhile(predicate:PredicateWithIndex<T>):ILinqEnumerable<T>;
	takeWhile(predicate:PredicateWithIndex<T>):ILinqEnumerable<T>;
	takeUntil(predicate:PredicateWithIndex<T>, includeUntilValue?:boolean):ILinqEnumerable<T>;
	forEach(action:ActionWithIndex<T>, max?:number):number;
	forEach(action:PredicateWithIndex<T>, max?:number):number;
	toArray(predicate?:PredicateWithIndex<T>):T[];
	copyTo(target:T[], index?:number, count?:number):T[];
	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector?:SelectorWithIndex<T, TValue>,
		compareSelector?:HashSelector<TKey>):ILookup<TKey, TValue>;
	toMap<TResult>(
		keySelector:HashSelector<T>,
		elementSelector:Selector<T, TResult>):IMap<TResult>;
	toDictionary<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey> | Selector<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue> | Selector<T, TValue>,
		compareSelector?:HashSelector<TKey>):IDictionary<TKey, TValue>;
	toJoinedString(separator?:string, selector?:Selector<T, string>):string;
	takeExceptLast(count?:number):ILinqEnumerable<T>;
	skipToLast(count:number):ILinqEnumerable<T>;
	select<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	map<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	selectMany<TResult>(collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>):ILinqEnumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):ILinqEnumerable<TResult>;
	choose():ILinqEnumerable<T>;
	choose<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	reverse():ILinqEnumerable<T>;
	shuffle():ILinqEnumerable<T>;
	count(predicate?:PredicateWithIndex<T>):number;
	all(predicate:PredicateWithIndex<T>):boolean;
	every(predicate:PredicateWithIndex<T>):boolean;
	any(predicate?:PredicateWithIndex<T>):boolean;
	some(predicate?:PredicateWithIndex<T>):boolean;
	contains(value:T, compareSelector?:Selector<T, any>):boolean;
	indexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number;
	lastIndexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number;
	intersect(second:ForEachEnumerable<T>, compareSelector?:HashSelector<T>):ILinqEnumerable<T>;
	sequenceEqual(second:ForEachEnumerable<T>, equalityComparer?:EqualityComparison<T>):boolean;
	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):ILinqEnumerable<TType>;
	traverseBreadthFirst(childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined):ILinqEnumerable<T>;
	traverseBreadthFirst<TNode>(childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined):ILinqEnumerable<TNode>;
	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):ILinqEnumerable<TResult>;
	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;
	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;
	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;
	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;
	buffer(size:number):ILinqEnumerable<T[]>;
	groupBy<TKey>(keySelector:SelectorWithIndex<T, TKey>):ILinqEnumerable<IGrouping<TKey, T>>;
	groupBy<TKey>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, T>,
		compareSelector?:HashSelector<TKey>):ILinqEnumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TElement>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TElement>,
		compareSelector?:HashSelector<TKey>):ILinqEnumerable<IGrouping<TKey, TElement>>;
	partitionBy<TKey>(keySelector:Selector<T, TKey>):ILinqEnumerable<IGrouping<TKey, T>>;
	partitionBy<TKey, TElement>(
		keySelector:Selector<T,TKey>,
		elementSelector?:Selector<T,TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>,
		compareSelector?:HashSelector<TKey>):ILinqEnumerable<IGrouping<TKey, TElement>>;
	flatten<TFlat>():IInfiniteEnumerable<TFlat>
	flatten():IInfiniteEnumerable<any>
	pairwise<TSelect>(selector:(prev:T, current:T) => TSelect):ILinqEnumerable<TSelect>;
	aggregate(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;
	aggregate<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;
	reduce(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;
	reduce<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;
	average(selector:Selector<T, number>):number;
	average(selector?:SelectorWithIndex<T, number>):number;
	max():T | undefined;
	min():T | undefined;
	maxBy(keySelector?:Selector<T, Primitive>):T | undefined;
	minBy(keySelector?:Selector<T, Primitive>):T | undefined;
	sum(selector?:SelectorWithIndex<T, number>):number;
	product(selector?:SelectorWithIndex<T, number>):number;
	quotient(selector?:SelectorWithIndex<T, number>):number;
	last():T;
	lastOrDefault():T | undefined;
	lastOrDefault(defaultValue:T):T;
	throwWhenEmpty():NotEmptyEnumerable<T>;
	memoize():ILinqEnumerable<T>
}

export interface NotEmptyEnumerable<T> extends ILinqEnumerable<T>
{
	aggregate(
		reduction:(previous:T, current:T, index?:number) => T):T;
	reduce(
		reduction:(previous:T, current:T, index?:number) => T):T;

	max():T
	min():T
	maxBy(keySelector?:Selector<T, Primitive>):T
	minBy(keySelector?:Selector<T, Primitive>):T
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
	get(key:TKey):TElement[]|null;
	contains(key:TKey):boolean;
}
export interface IOrderedEnumerable<T> extends IFiniteEnumerable<T>
{
	thenBy(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenByDescending(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;
	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;
}