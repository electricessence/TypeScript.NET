/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {forEach} from "./Enumeration/Enumerator";
import {areEqual} from "../Compare";
import {ArgumentNullException} from "../Exceptions/ArgumentNullException";
import {InvalidOperationException} from "../Exceptions/InvalidOperationException";
import {DisposableBase} from "../Disposable/DisposableBase";
import {ICollection} from "./ICollection";
import {IEnumerator} from "./Enumeration/IEnumerator";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";
import {EqualityComparison, Predicate, Action, Comparison, Selector} from "../FunctionTypes";
import {IEnumerableOrArray} from "./IEnumerableOrArray";
import {IArray} from "./Array/IArray";
import {Type} from "../Types";
import {IEnumerable} from "./Enumeration/IEnumerable";
import {Comparable} from "../IComparable";
import {IDictionary, IMap} from "./Dictionaries/IDictionary";

//noinspection SpellCheckingInspection
const NAME      = "CollectionBase",
      CMDC      = "Cannot modify a disposed collection.",
      CMRO      = "Cannot modify a read-only collection.",
      RESOLVE   = "resolve",
      LINQ_PATH = "../../System.Linq/Linq";

export abstract class CollectionBase<T>
extends DisposableBase implements ICollection<T>, IEnumerateEach<T>
{

	constructor(
		source?:IEnumerableOrArray<T>,
		protected _equalityComparer:EqualityComparison<T> = areEqual)
	{
		super();
		var _ = this;
		_._disposableObjectName = NAME;
		_._importEntries(source);
		_._updateRecursion = 0;
		_._modifiedCount = 0;
		_._version = 0;
	}


	protected abstract getCount():number;

	get count():number
	{
		return this.getCount();
	}

	protected getIsReadOnly():boolean
	{
		return false;
	}

	get isReadOnly():boolean
	{
		return this.getIsReadOnly();
	}

	protected assertModifiable():void
	{
		this.throwIfDisposed(CMDC);
		if(this.getIsReadOnly())
			throw new InvalidOperationException(CMRO);
	}

	protected _version:number; // Provides an easy means of tracking changes and invalidating enumerables.
	assertVersion(version:number):void
	{
		if(version!=this._version)
			throw new InvalidOperationException("Collection was modified.");
	}

	/*
	 * Note: Avoid changing modified count by any means but ++;
	 * If setting modified count by the result of a closure it may be a negative number or NaN and ruin the pattern.
	 */
	private _modifiedCount:number;
	private _updateRecursion:number;

	protected _onModified():void {}

	protected _signalModification(increment?:boolean):boolean
	{
		var _ = this;
		if(increment) _._modifiedCount++;
		if(_._modifiedCount && !this._updateRecursion)
		{
			_._modifiedCount = 0;
			_._version++;
			try
			{
				_._onModified();
			}
			catch(ex)
			{
				// Avoid fatal errors which may have been caused by consumer.
				console.error(ex);
			}
			return true;
		}
		return false;
	}

	protected _incrementModified():void { this._modifiedCount++; }

	get isUpdating():boolean { return this._updateRecursion!=0; }

	/**
	 * Takes a closure that if returning true will propagate an update signal.
	 * Multiple update operations can be occurring at once or recursively and the onModified signal will only occur once they're done.
	 * @param closure
	 * @returns {boolean}
	 */
	handleUpdate(closure?:() => boolean):boolean
	{
		if(!closure) return false;
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;
		var updated:boolean = false;

		try
		{
			if(updated = closure())
				_._modifiedCount++;
		}
		finally
		{
			_._updateRecursion--;
		}

		_._signalModification();

		return updated;
	}

	protected abstract _addInternal(entry:T):boolean;

	/*
	 * Note: for a slight amount more code, we avoid creating functions/closures.
	 * Calling handleUpdate is the correct pattern, but if possible avoid creating another function scope.
	 */

	add(entry:T):void
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		try
		{ if(_._addInternal(entry)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
	}

	protected abstract _removeInternal(entry:T, max?:number):number;

	remove(entry:T, max:number = Infinity):number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._removeInternal(entry, max)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
		return n;
	}

	protected abstract _clearInternal():number;

	clear():number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._clearInternal()) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();

		return n;
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._clearInternal();
		this._version = 0;
		this._updateRecursion = 0;
		this._modifiedCount = 0;
		var l = this._linq;
		this._linq = null;
		if(l) l.dispose();
	}

	protected _importEntries(entries:IEnumerableOrArray<T>):number
	{
		var added = 0;
		if(entries)
		{
			if(Array.isArray(entries))
			{
				// Optimize for avoiding a new closure.
				for(let e of entries)
				{
					if(this._addInternal(e)) added++;
				}
			}
			else
			{
				forEach(entries, e=>
				{
					if(this._addInternal(e)) added++;
				});
			}
		}
		return added;
	}

	importEntries(entries:IEnumerableOrArray<T>):number
	{
		var _ = this;
		_.assertModifiable();
		_._updateRecursion++;

		var n:number;
		try
		{ if(n = _._importEntries(entries)) _._modifiedCount++; }
		finally
		{ _._updateRecursion--; }

		_._signalModification();
		return n;
	}

	// Fundamentally the most important part of the collection.
	abstract getEnumerator():IEnumerator<T>;

	contains(entry:T):boolean
	{
		if(!this.getCount()) return false;
		var found:boolean = false, equals = this._equalityComparer;
		this.forEach(e => !(found = equals(entry, e)));
		return found;
	}

	forEach(action:Predicate<T>|Action<T>, useCopy?:boolean):number
	{
		if(useCopy)
		{
			var a = this.toArray();
			try
			{
				return forEach(a, action);
			}
			finally
			{
				a.length = 0;
			}
		}
		else
		{
			return forEach(this.getEnumerator(), action);
		}
	}

	copyTo<TTarget extends IArray<T>>(
		target:TTarget,
		index:number = 0):TTarget
	{
		if(!target) throw new ArgumentNullException('target');

		var count = this.getCount(), newLength = count + index;
		if(target.length<newLength) target.length = newLength;

		var e = this.getEnumerator();
		while(e.moveNext()) // Disposes when finished.
		{
			target[index++] = e.current;
		}
		return target;
	}

	toArray():T[]
	{
		var count = this.getCount();
		return this.copyTo(count>65536 ? new Array<T>(count) : []);
	}

	private _linq:Enumerable<T>;
	get linq():Enumerable<T>
	{
		if(Type.hasMember(require, RESOLVE) && require.length==1)
		{
			var e = this._linq;
			if(!e) this._linq = e = require(LINQ_PATH).default.from(this);
			return e;
		}
		else
		{
			throw ".linq currently only supported within CommonJS.\nImport System.Linq/Linq and use Enumerable.from(e) instead.";
		}
	}

}

declare var require:any;

export default CollectionBase;

export declare const enum EnumerableAction {
	Break  = 0,
	Return = 1,
	Skip   = 2,
}
export declare class InfiniteEnumerable<T> extends DisposableBase implements IEnumerable<T>
{
	isEndless:boolean;

	getEnumerator():IEnumerator<T>;

	asEnumerable():InfiniteEnumerable<T>;

	doAction(
		action:Action<T> | Predicate<T> | Selector<T, number> | Selector<T, EnumerableAction>,
		initializer?:() => void,
		isEndless?:boolean):InfiniteEnumerable<T>;

	force():void;

	skip(count:number):InfiniteEnumerable<T>;

	take(count:number):FiniteEnumerable<T>;

	elementAt(index:number):T;

	elementAtOrDefault(index:number, defaultValue?:T):T;

	first():T;

	firstOrDefault(defaultValue?:T):T;

	single():T;

	singleOrDefault(defaultValue?:T):T;

	any():boolean;

	isEmpty():boolean;

	traverseBreadthFirst(childrenSelector:(element:T) => IEnumerableOrArray<T>):Enumerable<T>;
	traverseBreadthFirst<TNode>(childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>):Enumerable<TNode>;
	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):Enumerable<TResult>;
	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):Enumerable<TResult>;

	traverseDepthFirst(childrenSelector:(element:T) => IEnumerableOrArray<T>):Enumerable<T>;
	traverseDepthFirst<TNode>(childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>):Enumerable<TNode>;
	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):Enumerable<TResult>;
	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):Enumerable<TResult>;

	flatten():Enumerable<any>;

	pairwise<TSelect>(selector:(prev:T, current:T) => TSelect):Enumerable<TSelect>;

	scan(func:(a:T, b:T) => T, seed?:T):Enumerable<T>;

	select<TResult>(selector:Selector<T, TResult>):InfiniteEnumerable<TResult>;

	selectMany<TResult>(collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):InfiniteEnumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement) => TResult):InfiniteEnumerable<TResult>;

	choose():InfiniteEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):InfiniteEnumerable<TResult>;

	where(predicate:Predicate<T>):InfiniteEnumerable<T>;

	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):InfiniteEnumerable<TType>;

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):InfiniteEnumerable<T>;

	distinct(compareSelector?:(value:T) => T):InfiniteEnumerable<T>;

	distinctUntilChanged<TCompare>(compareSelector?:Selector<T, TCompare>):InfiniteEnumerable<T>;

	defaultIfEmpty(defaultValue?:T):Enumerable<T>;

	zip<TSecond, TResult>(
		second:IEnumerableOrArray<TSecond>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>;

	zipMultiple<TSecond, TResult>(
		second:IArray<IEnumerableOrArray<TSecond>>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>;

	join<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<TResult>;

	groupJoin<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[]) => TResult,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<TResult>;

	merge(enumerables:IArray<IEnumerableOrArray<T>>):InfiniteEnumerable<T>;

	concat(...enumerables:Array<IEnumerableOrArray<T>>):InfiniteEnumerable<T>;

	union<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>;

	insertAt(index:number, other:IEnumerableOrArray<T>):Enumerable<T>;

	alternateMultiple(sequence:IEnumerableOrArray<T>):Enumerable<T>;

	alternateSingle(value:T):Enumerable<T>;

	alternate(...sequence:T[]):Enumerable<T>;

	catchError(handler:(e:any) => void):InfiniteEnumerable<T>;

	finallyAction(action:() => void):InfiniteEnumerable<T>;

	buffer(size:number):InfiniteEnumerable<T[]>;

	share():InfiniteEnumerable<T>;
}
export declare class Enumerable<T> extends InfiniteEnumerable<T>
{
	doAction(
		action:Action<T> | Predicate<T> | Selector<T, number> | Selector<T, EnumerableAction>,
		initializer?:() => void,
		isEndless?:boolean):Enumerable<T>;

	skip(count:number):Enumerable<T>;

	skipWhile(predicate:Predicate<T>):Enumerable<T>;

	takeWhile(predicate:Predicate<T>):Enumerable<T>;

	takeUntil(predicate:Predicate<T>, includeUntilValue?:boolean):Enumerable<T>;

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

	takeExceptLast(count?:number):Enumerable<T>;

	skipToLast(count:number):Enumerable<T>;

	where(predicate:Predicate<T>):Enumerable<T>;

	select<TResult>(selector:Selector<T, TResult>):Enumerable<TResult>;

	selectMany<TResult>(collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):Enumerable<TResult>;
	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement) => TResult):Enumerable<TResult>;

	choose():Enumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):Enumerable<TResult>;

	reverse():Enumerable<T>;

	shuffle():Enumerable<T>;

	count(predicate?:Predicate<T>):number;

	all(predicate:Predicate<T>):boolean;

	every(predicate:Predicate<T>):boolean;

	any(predicate?:Predicate<T>):boolean;

	some(predicate:Predicate<T>):boolean;

	contains<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):boolean;

	indexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number;

	lastIndexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number;

	merge(enumerables:IArray<IEnumerableOrArray<T>>):Enumerable<T>;

	concat(...enumerables:Array<IEnumerableOrArray<T>>):Enumerable<T>;

	intersect<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>;

	sequenceEqual(second:IEnumerableOrArray<T>, equalityComparer?:EqualityComparison<T>):boolean;

	ofType<TType>(
		type:{
			new (...params:any[]):TType;
		}):Enumerable<TType>;

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>;

	distinct(compareSelector?:(value:T) => T):Enumerable<T>;

	distinctUntilChanged<TCompare>(compareSelector?:Selector<T, TCompare>):Enumerable<T>;

	orderBy<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;

	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;

	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;

	orderByDescending<TKey extends Comparable>(keySelector?:Selector<T, TKey>):IOrderedEnumerable<T>;

	buffer(size:number):Enumerable<T[]>;

	groupBy<TKey>(keySelector:Selector<T, TKey>):Enumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, T>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, T>>;

	partitionBy<TKey>(keySelector:Selector<T, TKey>):Enumerable<IGrouping<TKey, T>>;
	partitionBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, TElement>>;

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

	share():Enumerable<T>;

	catchError(handler:(e:any) => void):Enumerable<T>;

	finallyAction(action:() => void):Enumerable<T>;

	memoize():Enumerable<T>;
}
export declare class FiniteEnumerable<T> extends Enumerable<T>
{

}
export declare interface IGrouping<TKey, TElement> extends Enumerable<TElement>
{
	key:TKey;
}
export declare interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>>
{
	count:number;
	get(key:TKey):TElement[];
	contains(key:TKey):boolean;
}
export declare interface IOrderedEnumerable<T> extends FiniteEnumerable<T>
{
	thenBy(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenByDescending(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;
	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;
}