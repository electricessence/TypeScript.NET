/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual as areEqualValues, compare as compareValues} from "../System/Compare";
import copy from "../System/Collections/Array/copy";
import * as Arrays from "../System/Collections/Array/Compare";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";
import {
	isEnumerable,
	isEnumerator,
	isIterator,
	throwIfEndless
} from "../System/Collections/Enumeration/Enumerator";
import EmptyEnumerator from "../System/Collections/Enumeration/EmptyEnumerator";
import {Type} from "../System/Types";
import Integer from "../System/Integer";
import {Functions as BaseFunctions} from "../System/Functions";
import ArrayEnumerator from "../System/Collections/Enumeration/ArrayEnumerator";
import {
	EndlessEnumeratorBase,
	EnumeratorBase,
	FiniteEnumeratorBase
} from "../System/Collections/Enumeration/EnumeratorBase";
import Dictionary from "../System/Collections/Dictionaries/Dictionary";
import Queue from "../System/Collections/Queue";
import {dispose, using} from "../System/Disposable/dispose";
import DisposableBase from "../System/Disposable/DisposableBase";
import UnsupportedEnumerableException
	from "../System/Collections/Enumeration/UnsupportedEnumerableException";
import ObjectDisposedException from "../System/Disposable/ObjectDisposedException";
import KeySortedContext from "../System/Collections/Sorting/KeySortedContext";
import ArgumentNullException from "../System/Exceptions/ArgumentNullException";
import ArgumentOutOfRangeException from "../System/Exceptions/ArgumentOutOfRangeException";
import {FiniteIEnumerator, IEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import {FiniteIEnumerable, IEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {
	Action,
	ActionWithIndex,
	Closure,
	Comparison,
	EqualityComparison,
	Func,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../System/FunctionTypes";
import {IDictionary, IMap} from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";
import IComparer from "../System/IComparer";
import KeyValuePair from "../System/KeyValuePair";
import Order from "../System/Collections/Sorting/Order";
import EnumerableAction from "./EnumerableAction";
import IndexEnumerator from "../System/Collections/Enumeration/IndexEnumerator";
import Primitive from "../System/Primitive";
import IteratorEnumerator from "../System/Collections/Enumeration/IteratorEnumerator";
import initialize from "../System/Collections/Array/initialize";
import Random from "../System/Random";
import {
	EndlessEnumerator,
	InfiniteValueFactory
} from "../System/Collections/Enumeration/EndlessEnumerator";
import LazyList from "../System/Collections/LazyList";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";

import __extendsImport from "../extends";
import EnumerableOrArrayLike from "../System/Collections/EnumerableOrArrayLike";
import IEnumerateEach from "../System/Collections/Enumeration/IEnumerateEach";
import disposeSingle = dispose.single;
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;


// #region Local Constants.

const INVALID_DEFAULT:any = {}; // create a private unique instance for referencing.
const VOID0:undefined = void 0;
const NULL:any = null;

function BREAK():EnumerableAction
{
	return EnumerableAction.Break;
}

function RETURN():EnumerableAction
{
	return EnumerableAction.Return;
}

function isNotNullOrUndefined(e:any):boolean
{
	return e!=null;
}


// Leave internal to avoid accidental overwriting.
class LinqFunctions
	extends BaseFunctions
{
	// noinspection JSMethodCanBeStatic
	Greater<T>(a:T, b:T)
	{
		return a>b ? a : b;
	}


	// noinspection JSMethodCanBeStatic
	Lesser<T>(a:T, b:T)
	{
		return a<b ? a : b;
	}
}

const Functions = Object.freeze(new LinqFunctions());

// For re-use as a factory.
function getEmptyEnumerator():FiniteIEnumerator<any>
{
	return EmptyEnumerator;
}

// #endregion

function createEnumerable<T>(
	enumeratorFactory:Func<IEnumerator<T>>,
	finalizer:Closure | null | undefined,
	isEndless:true):EndlessLinqEnumerable<T>;
function createEnumerable<T>(
	enumeratorFactory:Func<IEnumerable<T>>,
	finalizer:Closure | null | undefined,
	isEndless:false):FiniteLinqEnumerable<T>;
function createEnumerable<T>(
	enumeratorFactory:Func<IEnumerator<T>>,
	finalizer:Closure | null | undefined,
	isEndless:boolean | null | undefined):LinqEnumerable<T> | FiniteLinqEnumerable<T> | EndlessLinqEnumerable<T>;
function createEnumerable<T>(
	enumeratorFactory:Func<any>,
	finalizer:Closure | null | undefined,
	isEndless:boolean | null | undefined):any
{
	if(isEndless)
		return new EndlessLinqEnumerable(enumeratorFactory, finalizer);
	else if(isEndless===false)
		return new FiniteLinqEnumerable(enumeratorFactory, finalizer);

	return new LinqEnumerable(enumeratorFactory, finalizer, isEndless || undefined);
}




/**
 * This base class allows for reducing the method signature
 * to only ones that don't require specific enumerable types,
 * or methods that use LinqEnumerable<T> as a return type.
 */
abstract class IndeterminateLinqEnumerableBase<T>
	extends DisposableBase
	implements IEnumerable<T>
{
	protected constructor(
		protected _enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null)
	{
		super("IndeterminateLinqEnumerableBase", finalizer);
	}

	abstract readonly isEndless?:boolean;

	// #region IEnumerable<T> Implementation...
	getEnumerator():IEnumerator<T>
	{
		this.throwIfDisposed();
		return this._enumeratorFactory();
	}

	// #endregion

	// #region IDisposable override...
	protected _onDispose():void
	{
		super._onDispose(); // Just in case.
		// @ts-ignore
		this._enumeratorFactory = null;
	}

	protected _createEnumerable<T>(
		enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null):any
	{
		return new LinqEnumerable<T>(enumeratorFactory, finalizer, this.isEndless || undefined);
	}

	protected _filterSelected(
		selector:SelectorWithIndex<T, any> = <any>Functions.Identity,
		filter?:PredicateWithIndex<any>):any
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		if(!selector)
			throw new ArgumentNullException("selector");

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let index:number = 0;


				return new EnumeratorBase<any>(
					() => {
						throwIfDisposed(!selector);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwIfDisposed(disposed);

						while(enumerator.moveNext())
						{
							let i = index++;
							let result = selector(enumerator.current!, i);
							if(!filter || filter(result, i++))
								return yielder.yieldReturn(result);
						}

						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
					},

					_.isEndless
				);
			},

			() => {
				disposed = false;
			}
		);
	}

	protected _selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector?:(collection:T, element:TElement) => TResult):any
	{
		const _ = this;
		_.throwIfDisposed();

		if(!collectionSelector)
			throw new ArgumentNullException("collectionSelector");

		const isEndless = _.isEndless; // Do second enumeration, it will be indeterminate if false.
		if(!resultSelector)
			resultSelector = (a:T, b:any) => <TResult>b;

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let middleEnumerator:IEnumerator<any> | null | undefined;
				let index:number = 0;

				return new EnumeratorBase<TResult>(
					() => {
						throwIfDisposed(!collectionSelector);
						enumerator = _.getEnumerator();
						middleEnumerator = VOID0;
						index = 0;
					},

					(yielder) => {
						throwIfDisposed(!collectionSelector);
						// Just started, and nothing to enumerate? End.
						if(middleEnumerator===VOID0 && !enumerator.moveNext())
							return false;

						// moveNext has been called at least once...
						do
						{

							// Initialize middle if there isn't one.
							if(!middleEnumerator)
							{
								let middleSeq = collectionSelector(<T>enumerator.current, index++);

								// Collection is null?  Skip it...
								if(!middleSeq)
									continue;

								middleEnumerator = enumUtil.from(middleSeq);
							}

							if(middleEnumerator.moveNext())
								return yielder.yieldReturn(
									resultSelector!(
										<T>enumerator.current, <TElement>middleEnumerator.current
									)
								);

							// else no more in this middle?  Then clear and reset for next...

							middleEnumerator.dispose();
							middleEnumerator = null;

						}
						while(enumerator.moveNext());

						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
						disposeSingle(middleEnumerator);
						enumerator = NULL;
						middleEnumerator = null;
					},

					isEndless
				);
			},
			() => {
				collectionSelector = NULL;
			}
		);
	}

	/**
	 * Similar to forEach, but executes an action for each time a value is enumerated.
	 * If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
	 * If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
	 * This also automatically handles disposing the enumerator.
	 * @param action
	 * @param initializer
	 * @param isEndless Special case where isEndless can be null in order to negate inheritance.
	 * @param onComplete Executes just before the enumerator releases when there is no more entries.
	 * @returns {any}
	 */

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer:Closure | null,
		isEndless:true,
		onComplete?:Action<number>):EndlessLinqEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer:Closure | null,
		isEndless:false,
		onComplete?:Action<number>):FiniteLinqEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure | null,
		isEndless?:boolean | null,
		onComplete?:Action<number>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T> | LinqEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure | null,
		isEndless:boolean | null | undefined = this.isEndless,
		onComplete?:Action<number>):any
	{

		const _ = this;
		_.throwIfDisposed();
		isEndless = isEndless || undefined; // In case it's null.
		if(!action) throw new ArgumentNullException("action");

		function enumerableFactory()
		{
			let enumerator:IEnumerator<T>;
			let index:number = 0;

			return new EnumeratorBase<T>(
				() => {
					throwIfDisposed(!action);

					if(initializer) initializer();
					index = 0;
					enumerator = _.getEnumerator();
					// May need a way to propagate isEndless
				},

				(yielder) => {
					throwIfDisposed(!action);

					while(enumerator.moveNext())
					{
						let c = enumerator.current!;
						let actionResult = <any>action(c, index++);

						if(actionResult===false || actionResult===EnumerableAction.Break)
							return yielder.yieldBreak();

						if(actionResult!==EnumerableAction.Skip) // || !== 2
							return yielder.yieldReturn(c);

						// If actionResult===2, then a signal for skip is received.
					}
					if(onComplete) onComplete(index);
					return false;
				},

				() => {
					if(enumerator) enumerator.dispose();
				},

				<boolean | undefined>isEndless
			);

		}

		// Using a finalizer value reduces the chance of a circular reference
		// since we could simply reference the enumeration and check e.wasDisposed.
		function finalizer()
		{
			action = NULL;
		}

		return _._createEnumerable(enumerableFactory, finalizer);
	}


	force():void
	{
		this.throwIfDisposed();
		this.doAction(BREAK)
			.getEnumerator()
			.moveNext();

	}


	take(count:number):FiniteLinqEnumerable<T>
	{
		if(!(count>0)) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count))
			throw new ArgumentOutOfRangeException('count', count, 'Must be finite.');

		Integer.assert(count, "count");

		// Once action returns false, the enumeration will stop.
		return _.doAction((element, index) => index<count, null, false);
	}


	// #region Single Value Return...

	elementAt(index:number):T
	{
		const v = this.elementAtOrDefault(index, INVALID_DEFAULT);
		if(v===INVALID_DEFAULT) throw new ArgumentOutOfRangeException('index', index, "is greater than or equal to the number of elements in source");
		return <T>v;
	}

	elementAtOrDefault(index:number):T | undefined
	elementAtOrDefault(index:number, defaultValue:T):T
	elementAtOrDefault(index:number, defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		Integer.assertZeroOrGreater(index, 'index');
		const n:number = index;

		return using(
			this.getEnumerator(),
			e => {
				let i = 0;
				while(e.moveNext())
				{
					if(i==n) return e.current;
					i++;
				}

				return defaultValue;
			});
	}

	/* Note: Unlike previous implementations, you could pass a predicate into these methods.
	 * But since under the hood it ends up calling .where(predicate) anyway,
	 * it may be better to remove this to allow for a cleaner signature/override.
	 * JavaScript/TypeScript does not easily allow for a strict method interface like C#.
	 * Having to write extra override logic is error prone and confusing to the consumer.
	 * Removing the predicate here may also cause the consumer of this method to think more about how they structure their query.
	 * The end all difference is that the user must declare .where(predicate) before .first(), .single(), or .last().
	 * Otherwise there would need to be much more code to handle these cases (.first(predicate), etc);
	 * */

	first():T
	{
		const v = this.firstOrDefault(INVALID_DEFAULT);
		if(v===INVALID_DEFAULT) throw new Error("first:The sequence is empty.");
		return <T>v;
	}

	firstOrDefault():T | undefined
	firstOrDefault(defaultValue:T):T
	firstOrDefault(defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e => e.moveNext() ? e.current : defaultValue
		);
	}


	single():T
	{
		const _ = this;
		_.throwIfDisposed();

		return <T>using(
			this.getEnumerator(),
			e => {
				if(e.moveNext())
				{
					let value = e.current;
					if(!e.moveNext()) return value;
					throw new Error("single:sequence contains more than one element.");
				}
				throw new Error("single:The sequence is empty.");
			}
		);
	}

	singleOrDefault():T | undefined
	singleOrDefault(defaultValue:T):T
	singleOrDefault(defaultValue?:T):T | undefined
	{

		const _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e => {
				if(e.moveNext())
				{
					let value = e.current;
					if(!e.moveNext()) return value;
				}
				return defaultValue;
			}
		);
	}

	any():boolean
	{
		const _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e => e.moveNext()
		);
	}

	isEmpty():boolean
	{
		return !this.any();
	}

	// #endregion


	// #region Projection and Filtering Methods
	traverseDepthFirst(
		childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined):LinqEnumerable<T>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined):LinqEnumerable<TNode>;

	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => EnumerableOrArrayLike<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T | TNode) => EnumerableOrArrayLike<TNode> | null | undefined,
		resultSelector:(
			element:TNode,
			nestLevel:number) => any = <any>Functions.Identity):LinqEnumerable<any>
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		const isEndless = _.isEndless; // Is endless is not affirmative if false.

		return new LinqEnumerable<any>(
			() => {
				// Dev Note: May want to consider using an actual stack and not an array.
				let enumeratorStack:IEnumerator<any>[];
				let enumerator:IEnumerator<any>;
				let len:number;  // Avoid using push/pop since they query .length every time and can be slower.

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
						enumeratorStack = [];
						len = 0;
					},

					(yielder) => {
						throwIfDisposed(disposed);
						while(true)
						{
							if(enumerator.moveNext())
							{
								let value = resultSelector(<TNode>enumerator.current, len);
								enumeratorStack[len++] = enumerator;
								let c = childrenSelector(<T | TNode>enumerator.current);
								let e = !Type.isString(c) && Enumerable.fromAny(c);
								enumerator = e ? e.getEnumerator() : EmptyEnumerator;
								return yielder.yieldReturn(value);
							}

							if(len==0) return false;

							enumerator.dispose();
							enumerator = enumeratorStack[--len];
							enumeratorStack.length = len;
						}
					},

					() => {
						try
						{
							if(enumerator) enumerator.dispose();
						}
						finally
						{
							if(enumeratorStack)
							{
								dispose.these.noCopy(enumeratorStack);
								enumeratorStack.length = 0;
								enumeratorStack = NULL;
							}
						}
					},

					isEndless
				);
			},
			() => {
				disposed = true;
			},
			isEndless
		);
	}


	flatten<TFlat>():LinqEnumerable<TFlat>
	flatten():LinqEnumerable<any>
	flatten():LinqEnumerable<any>
	{
		return this._selectMany(entry => {
			let e = !Type.isString(entry) && Enumerable.fromAny(entry);
			return e ? e.flatten() : [entry];
		});
	}


	pairwise<TSelect>(
		selector:(
			previous:T, current:T,
			index:number) => TSelect):LinqEnumerable<TSelect>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!selector)
			throw new ArgumentNullException("selector");

		let previous:T;
		return this._filterSelected((value, i) => {
			const result:any = i ? selector(previous!, value, i) : NULL;
			previous = value;
			return result;
		}).skip(1);
	}
	// #endregion

	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TResult> | null | undefined>):LinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):LinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, EnumerableOrArrayLike<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):LinqEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	ofType<TType>(type:{ new(...params:any[]):TType }):LinqEnumerable<TType>;
	ofType<TType>(type:any):LinqEnumerable<TType>
	{
		let typeName:string;
		switch(<any>type)
		{
			case Number:
				typeName = Type.NUMBER;
				break;
			case String:
				typeName = Type.STRING;
				break;
			case Boolean:
				typeName = Type.BOOLEAN;
				break;
			case Function:
				typeName = Type.FUNCTION;
				break;
			default:
				return this
					._filterSelected(x => x instanceof type);
		}
		return this
			._filterSelected(x => isNotNullOrUndefined(x) && typeof x===typeName);
	}

	/**
	 * Alternates values between this and the second set until either runs out.
	 * @param second
	 * @param resultSelector
	 */
	zip<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<TSecond>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):FiniteLinqEnumerable<TResult>
	{
		const _ = this;
		_.throwIfDisposed();

		return new FiniteLinqEnumerable<TResult>(
			() => {
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<TSecond>;
				let index:number = 0;

				return new FiniteEnumeratorBase<TResult>(
					() => {
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumUtil.from(second);
					},

					(yielder) => firstEnumerator.moveNext()
						&& secondEnumerator.moveNext()
						&& yielder.yieldReturn(resultSelector(<T>firstEnumerator.current, <TSecond>secondEnumerator.current, index++)),

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						firstEnumerator = NULL;
						secondEnumerator = NULL;
					}
				);
			}
		);
	}

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
			index:number) => TResult):FiniteLinqEnumerable<TResult>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!second || Type.isArrayLike(second) && !second.length)
			return Enumerable.empty<TResult>();

		return new FiniteLinqEnumerable<TResult>(
			() => {
				let secondTemp:Queue<any>;
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<TSecond>;
				let index:number = 0;

				return new FiniteEnumeratorBase<TResult>(
					() => {
						secondTemp = new Queue<any>(second);
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = NULL;
					},

					(yielder) => {
						if(firstEnumerator.moveNext())
						{
							while(true)
							{
								while(!secondEnumerator)
								{
									if(secondTemp.count)
									{
										let next = secondTemp.dequeue();
										if(next) // In case by chance next is null, then try again.
											secondEnumerator = enumUtil.from<TSecond>(next);
									}
									else
										return yielder.yieldBreak();
								}

								if(secondEnumerator.moveNext())
									return yielder.yieldReturn(
										resultSelector(<T>firstEnumerator.current, <TSecond>secondEnumerator.current, index++)
									);

								secondEnumerator.dispose();
								secondEnumerator = NULL;
							}
						}

						return yielder.yieldBreak();
					},

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						if(secondTemp) secondTemp.dispose();
						firstEnumerator = NULL;
						secondEnumerator = NULL;
						secondTemp = NULL;
					}
				);
			}
		);
	}

	join<TInner, TKey, TResult>(
		inner:FiniteEnumerableOrArrayLike<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector:HashSelector<TKey> = <any>Functions.Identity):LinqEnumerable<TResult>
	{

		const _ = this;
		return _._createEnumerable(
			() => {
				let outerEnumerator:IEnumerator<T>;
				let lookup:Lookup<TKey, TInner>;
				let innerElements:TInner[] | null;
				let innerCount:number = 0;

				return new EnumeratorBase<TResult>(
					() => {
						outerEnumerator = _.getEnumerator();
						lookup = Enumerable.from(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},

					(yielder) => {
						while(true)
						{
							if(innerElements)
							{
								let innerElement = innerElements[innerCount++];
								if(innerElement!==VOID0)
									return yielder.yieldReturn(resultSelector(<T>outerEnumerator.current, innerElement));

								innerElements = null;
								innerCount = 0;
							}

							if(outerEnumerator.moveNext())
							{
								let key = outerKeySelector(<T>outerEnumerator.current);
								innerElements = lookup.get(key);
							}
							else
							{
								return yielder.yieldBreak();
							}
						}
					},

					() => {
						if(outerEnumerator) outerEnumerator.dispose();
						innerElements = null;
						outerEnumerator = NULL;
						lookup = NULL;
					}
				);
			}
		);
	}

	groupJoin<TInner, TKey, TResult>(
		inner:FiniteEnumerableOrArrayLike<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[] | null) => TResult,
		compareSelector:HashSelector<TKey> = <any>Functions.Identity):LinqEnumerable<TResult>
	{
		const _ = this;

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let lookup:Lookup<TKey, TInner>;

				return new EnumeratorBase<TResult>(
					() => {
						enumerator = _.getEnumerator();
						lookup = Enumerable.from(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},

					(yielder) =>
						enumerator.moveNext()
						&& yielder.yieldReturn(
						resultSelector(
							<T>enumerator.current,
							lookup.get(outerKeySelector(<T>enumerator.current))
						)
						),

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						lookup = NULL;
					}
				);
			}
		);
	}

}

abstract class LinqEnumerableBase<T, TThis extends IEnumerable<T>>
	extends IndeterminateLinqEnumerableBase<T>
{
	protected constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:Closure | null)
	{
		super(enumeratorFactory, finalizer);
		// @ts-ignore
		this._disposableObjectName = "LinqEnumerableBase";
	}

	protected abstract _createEnumerable<T>(
		enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null):any;

	// Return a default (unfiltered) enumerable.
	abstract asEnumerable():TThis;

	// #region Indexing/Paging methods.
	skip(count:number):TThis
	{
		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return <any> new EndlessLinqEnumerable<T>(getEmptyEnumerator);

		Integer.assert(count, "count");

		return this.where((element, index) => index>=count);
	}
	// #endregion

	// #region Projection and Filtering Methods
	scan(func:(previous:T, current:T, index:number) => T, seed?:T):TThis
	{
		const _ = this;
		_.throwIfDisposed();

		if(!func)
			throw new ArgumentNullException("func");

		return seed===VOID0
			? this._filterSelected((value, i) => seed = i ? func(seed!, value, i) : value)
			: this.select((value, i) => seed = func(seed!, value, i));
	}
	// #endregion

	where(predicate:PredicateWithIndex<T>):TThis
	{
		return this._filterSelected(Functions.Identity, predicate);
	}

	filter(predicate:PredicateWithIndex<T>):TThis
	{
		return this._filterSelected(Functions.Identity, predicate);
	}

	nonNull():TThis
	{
		return this._filterSelected(isNotNullOrUndefined);
	}

	except(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector?:HashSelector<T>):TThis
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		const isEndless = _.isEndless;

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let keys:Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new Dictionary<T, boolean>(compareSelector);
						if(second)
							enumUtil.forEach(second, key => { keys.addByKeyValue(key, true) });
					},

					(yielder) => {
						throwIfDisposed(disposed);
						while(enumerator.moveNext())
						{
							let current = <T>enumerator.current;
							if(!keys.containsKey(current))
							{
								keys.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
						keys.clear();
					},

					isEndless
				);
			},

			() => {
				disposed = true;
			}
		);
	}


	insertAt(index:number, other:FiniteIEnumerable<T>):TThis
	{
		Integer.assertZeroOrGreater(index, 'index');
		const n:number = index;

		const _ = this;
		_.throwIfDisposed();
		const isEndless = _.isEndless;

		return _._createEnumerable(
			() => {

				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<T>;

				let count:number = 0;
				let isEnumerated:boolean = false;

				return new EnumeratorBase<T>(
					() => {
						count = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumUtil.from<T>(other);
						isEnumerated = false;
					},

					(yielder) => {
						if(count==n)
						{ // Inserting?
							isEnumerated = true;
							if(secondEnumerator.moveNext())
								return yielder.yieldReturn(secondEnumerator.current);
						}

						if(firstEnumerator.moveNext())
						{
							count++;
							return yielder.yieldReturn(firstEnumerator.current);
						}

						return !isEnumerated
							&& secondEnumerator.moveNext()
							&& yielder.yieldReturn(secondEnumerator.current);
					},

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						firstEnumerator = NULL;
						if(secondEnumerator) secondEnumerator.dispose();
						secondEnumerator = NULL;
					},

					isEndless
				);
			}
		);
	}


	alternateMultiple(sequence:FiniteEnumerableOrArrayLike<T>):TThis
	{
		const _ = this;
		const isEndless = _.isEndless;

		return _._createEnumerable(
			() => {
				let buffer:T,
				    mode:EnumerableAction,
				    enumerator:IEnumerator<T>,
				    alternateEnumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						// Instead of recalling getEnumerator every time, just reset the existing one.
						alternateEnumerator = new ArrayEnumerator(
							Enumerable.toArray<T>(sequence)
						); // Freeze

						enumerator = _.getEnumerator();

						let hasAtLeastOne = enumerator.moveNext();
						mode = hasAtLeastOne
							? EnumerableAction.Return
							: EnumerableAction.Break;

						if(hasAtLeastOne)
							buffer = <T>enumerator.current;
					},

					(yielder) => {
						switch(mode)
						{
							case EnumerableAction.Break: // We're done?
								return yielder.yieldBreak();

							case EnumerableAction.Skip:
								if(alternateEnumerator.moveNext())
									return yielder.yieldReturn(alternateEnumerator.current);
								alternateEnumerator.reset();
								mode = EnumerableAction.Return;
								break;
						}

						let latest = buffer;

						// Set up the next round...

						// Is there another one?  Set the buffer and setup instruct for the next one to be the alternate.
						let another = enumerator.moveNext();
						mode = another
							? EnumerableAction.Skip
							: EnumerableAction.Break;

						if(another)
							buffer = <T>enumerator.current;

						return yielder.yieldReturn(latest);

					},

					() => {
						if(enumerator) enumerator.dispose();
						if(alternateEnumerator) alternateEnumerator.dispose();
						enumerator = NULL;
						alternateEnumerator = NULL;
					},

					isEndless
				);
			}
		);
	}

	alternateSingle(value:T):TThis
	{
		return this.alternateMultiple(Enumerable.make(value));
	}

	alternate(...sequence:T[]):TThis
	{
		return this.alternateMultiple(sequence);
	}


	// #region Error Handling
	catchError(handler:(e:any) => void):TThis
	{
		const _ = this;
		const isEndless = _.isEndless;
		const disposed = !_.throwIfDisposed();
		return <any> createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						try
						{
							throwIfDisposed(disposed);
							enumerator = _.getEnumerator();
						}
						catch(e)
						{
							// Don't init...
						}
					},

					(yielder) => {
						if(enumerator) try
						{
							throwIfDisposed(disposed);
							if(enumerator.moveNext())
								return yielder.yieldReturn(enumerator.current);
						}
						catch(e)
						{
							handler(e);
						}
						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
					}
				);
			},
			null,
			isEndless
		);
	}

	finallyAction(action:Closure):TThis
	{
		const _ = this;
		const disposed = !_.throwIfDisposed();

		return <any> createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwIfDisposed(disposed);
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: false;
					},

					() => {
						try
						{
							if(enumerator) enumerator.dispose();
							enumerator = NULL;
						}
						finally
						{
							action();
						}
					}
				);
			},
			null,
			_.isEndless
		);
	}

	// #endregion

	buffer(size:number):EndlessLinqEnumerable<T[]>
	{
		if(size<1 || !isFinite(size))
			throw new Error("Invalid buffer size.");

		Integer.assert(size, "size");

		const _ = this;
		const isEndless = _.isEndless;
		let len:number;

		return <any>createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				return new EnumeratorBase<T[]>(
					() => {
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						let array:T[] = initialize<T>(size);
						len = 0;
						while(len<size && enumerator.moveNext())
						{
							array[len++] = <T>enumerator.current;
						}

						array.length = len;
						return !!len && yielder.yieldReturn(array);
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
					},

					isEndless
				);
			},
			null,
			isEndless);
	}

	share():TThis
	{
		const _ = this;
		_.throwIfDisposed();

		let sharedEnumerator:IEnumerator<T>;
		return <any> createEnumerable(
			() => {
				return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
			},

			() => {
				if(sharedEnumerator) sharedEnumerator.dispose();
				sharedEnumerator = NULL;
			},

			_.isEndless
		);
	}

	memoize():TThis
	{
		let source = new LazyList(this);
		return <any>createEnumerable(() => source.getEnumerator(), () => {
			source.dispose();
			source = <any>null
		}, this.isEndless);
	}

}



/**
 * Enumerable<T> is a wrapper class that allows more primitive enumerables to exhibit LINQ behavior.
 *
 * In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
 * In this case, we use Enumerable<T> as the underlying class that is being chained.
 */
export class LinqEnumerable<T>
	extends LinqEnumerableBase<T, LinqEnumerable<T>>
	implements IEnumerable<T>
{

	constructor(
		enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null,
		isEndless?:boolean)
	{
		super(enumeratorFactory, finalizer);
		this._isEndless = isEndless;
		// @ts-ignore
		this._disposableObjectName = "LinqEnumerable";
	}

	private readonly _isEndless?:boolean;
	get isEndless():boolean | undefined { return this._isEndless; }

	// Return a default (unfiltered) enumerable.
	asEnumerable():this
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new LinqEnumerable<T>(() => _.getEnumerator());
	}

// #region Indexing/Paging methods.

	skipWhile(predicate:PredicateWithIndex<T>):LinqEnumerable<T>
	{
		this.throwIfDisposed();
		return this.doAction(
			(element:T, index:number) =>
				predicate(element, index)
					? EnumerableAction.Skip
					: EnumerableAction.Return
		);
	}




	// Since an infinite enumerable will always end up traversing breadth first, we have this only here for regular enumerable.
	traverseBreadthFirst(
		childrenSelector:(element:T) => FiniteIEnumerable<T> | null | undefined):LinqEnumerable<T>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T | TNode) => FiniteIEnumerable<TNode> | null | undefined):LinqEnumerable<TNode>;

	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => FiniteIEnumerable<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => FiniteIEnumerable<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T | TNode) => FiniteIEnumerable<TNode> | null | undefined,
		resultSelector:(
			element:TNode,
			nestLevel:number) => any = Functions.Identity):LinqEnumerable<any>
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		const isEndless = _.isEndless; // Is endless is not affirmative if false.


		return new LinqEnumerable<any>(
			() => {
				let enumerator:IEnumerator<any>;
				let nestLevel:number = 0;
				let buffer:any[], len:number;

				return new EnumeratorBase<any>(
					() => {
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();

						nestLevel = 0;
						buffer = [];
						len = 0;
					},

					(yielder) => {
						throwIfDisposed(disposed);

						while(true)
						{
							if(enumerator.moveNext())
							{
								buffer[len++] = enumerator.current;
								return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							if(!len)
								return yielder.yieldBreak();

							let next = Enumerable
								.from(buffer)
								.selectMany(childrenSelector);

							if(!next.any())
							{
								return yielder.yieldBreak();
							}
							else
							{
								nestLevel++;
								buffer = [];
								len = 0;
								enumerator.dispose();
								enumerator = next.getEnumerator();
							}
						}
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						buffer.length = 0;
					},

					isEndless
				);
			},
			() => {
				disposed = true;
			},

			isEndless
		);
	}





	takeExceptLast(count:number = 1):this
	{
		const _ = this;

		if(!(count>0)) // Out of bounds?
			return _;

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return <any> Enumerable.empty<T>();

		Integer.assert(count, "count");
		const c = count;

		return <any> new LinqEnumerable<T>(
			() => {
				let enumerator:IEnumerator<T>;
				let q:Queue<T>;

				return new EnumeratorBase<T>(
					() => {
						enumerator = _.getEnumerator();
						q = new Queue<T>();
					},

					(yielder) => {
						while(enumerator.moveNext())
						{
							// Add the next one to the queue.
							q.enqueue(<T>enumerator.current);

							// Did we reach our quota?
							if(q.count>c)
							// Okay then, start returning results.
								return yielder.yieldReturn(q.dequeue());
						}
						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						if(q) q.dispose();
						q = NULL;
					}
				);
			}
		);
	}

	skipToLast(count:number):this
	{
		if(!(count>0)) // Out of bounds? Empty.
			return <any> Enumerable.empty<T>();

		const _ = this;

		if(!isFinite(count)) // Infinity means return all.
			return _;

		Integer.assert(count, "count");

		// This sets up the query so nothing is done until move next is called.
		return <any> _.reverse()
			.take(count)
			.reverse();
	}

	// To help with type guarding.

	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return <LinqEnumerable<TResult>>super.select(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return <LinqEnumerable<TResult>>super.select(selector);
	}

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteIEnumerable<TResult> | null | undefined>):LinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteIEnumerable<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):LinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteIEnumerable<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):LinqEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	choose():LinqEnumerable<T>;
	choose<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	choose(selector:SelectorWithIndex<T, any> = Functions.Identity):LinqEnumerable<any>
	{
		return this._filterSelected(selector, isNotNullOrUndefined);
	}

	reverse():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		throwIfEndless(_.isEndless); // Cannot reverse an endless collection...

		return <any> new LinqEnumerable<T>(
			() => {
				let buffer:T[];
				let index:number = 0;

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						_.throwIfDisposed();
						buffer = _.toArray();
						index = buffer.length;
					},

					(yielder) => !!index && yielder.yieldReturn(buffer[--index]),

					() => {
						buffer.length = 0;
					}
				);
			},

			() => {
				disposed = true;
			}
		);
	}

	shuffle():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		throwIfEndless(_.isEndless); // Cannot shuffle an endless collection...

		return <any> new LinqEnumerable<T>(
			() => {
				let buffer:T[];
				let capacity:number;
				let len:number;

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						buffer = _.toArray();
						capacity = len = buffer.length;
					},

					(yielder) => {
						// Avoid using major array operations like .slice();
						if(!len)
							return yielder.yieldBreak();

						let selectedIndex = Random.integer(len);
						let selectedValue = buffer[selectedIndex];

						buffer[selectedIndex] = buffer[--len]; // Take the last one and put it here.
						buffer[len] = NULL; // clear possible reference.

						if(len%32==0) // Shrink?
							buffer.length = len;

						return yielder.yieldReturn(selectedValue);
					},

					() => {
						buffer.length = 0;
					}
				);
			},

			() => {
				disposed = true;
			}
		);
	}

	count(predicate?:PredicateWithIndex<T>):number
	{
		let count:number = 0;
		this.forEach(
			predicate

				? (x, i) => {
					if(predicate(x, i)) ++count;
				}

				: () => {
					++count;
				}
		);

		return count;
	}

	// Akin to '.every' on an array.
	all(predicate:PredicateWithIndex<T>):boolean
	{
		if(!predicate)
			throw new ArgumentNullException("predicate");

		let result = true;
		this.forEach((x, i) => {
			if(!predicate(x, i))
			{
				result = false;
				return false; // break
			}
		});
		return result;
	}

	// 'every' has been added here for parity/compatibility with an array.
	every(predicate:PredicateWithIndex<T>):boolean
	{
		return this.all(predicate);
	}

	// Akin to '.some' on an array.
	any(predicate?:PredicateWithIndex<T>):boolean
	{
		if(!predicate)
			return super.any();

		let result = false;
		// Splitting the forEach up this way reduces iterative processing.
		// forEach handles the generation and disposal of the enumerator.
		this.forEach(
			(x, i) => {
				result = predicate(x, i); // false = not found and therefore it should continue.  true = found and break;
				return !result;
			});
		return result;

	}

	// 'some' has been added here for parity/compatibility with an array.
	some(predicate?:PredicateWithIndex<T>):boolean
	{
		return this.any(predicate);
	}


	contains(value:T, compareSelector?:Selector<T, any>):boolean
	{
		if(compareSelector)
		{
			const s = compareSelector(value);
			return this.any(v => areEqualValues(compareSelector(v), s));
		}
		return this.any(v => areEqualValues(v, value));
	}

	// Originally has an overload for a predicate,
	// but that's a bad idea since this could be an enumeration of functions and therefore fail the intent.
	// Better to chain a where statement first to be more explicit.
	indexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number
	{
		let found:number = -1;
		this.forEach(
			compareSelector
				? (element:T, i:number) => {
					if(areEqualValues(compareSelector(element, i), compareSelector(value, i), true))
					{
						found = i;
						return false;
					}
				}
				: (element:T, i:number) => {
					// Why?  Because NaN doesn't equal NaN. :P
					if(areEqualValues(element, value, true))
					{
						found = i;
						return false;
					}
				});


		return found;
	}

	lastIndexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number
	{
		let result:number = -1;
		this.forEach(
			compareSelector
				? (element:T, i:number) => {
					if(areEqualValues(compareSelector(element, i), compareSelector(value, i), true)) result
						= i;
				}

				: (element:T, i:number) => {
					if(areEqualValues(element, value, true)) result = i;
				});

		return result;
	}


	intersect(
		second:FiniteIEnumerable<T>,
		compareSelector?:HashSelector<T>):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!second)
			throw new ArgumentNullException("second");

		const isEndless = _.isEndless;

		return <any> new LinqEnumerable<T>(
			() => {
				let enumerator:IEnumerator<T>;
				let keys:Dictionary<T, boolean>;
				let outs:Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() => {
						throwIfDisposed(!second);
						enumerator = _.getEnumerator();

						keys = new Dictionary<T, boolean>(compareSelector);
						outs = new Dictionary<T, boolean>(compareSelector);

						enumUtil.forEach(second, key => {
							keys.addByKeyValue(key, true);
						});
					},

					(yielder) => {
						while(enumerator.moveNext())
						{
							let current = <T>enumerator.current;
							if(!outs.containsKey(current) && keys.containsKey(current))
							{
								outs.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return yielder.yieldBreak();
					},

					() => {
						if(enumerator) enumerator.dispose();
						if(keys) enumerator.dispose();
						if(outs) enumerator.dispose();
						enumerator = NULL;
						keys = NULL;
						outs = NULL;
					},
					isEndless
				);
			},
			() => {
				second = NULL;
			},
			isEndless
		);
	}

	sequenceEqual(
		second:FiniteIEnumerable<T>,
		equalityComparer:EqualityComparison<T> = areEqualValues):boolean
	{
		this.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e1 => using(
				enumUtil.from(second),
				e2 => {
					// if both are endless, this will never evaluate.
					throwIfEndless(e1.isEndless && e2.isEndless);

					while(e1.moveNext())
					{
						if(!e2.moveNext() || !equalityComparer(<T>e1.current, <T>e2.current))
							return false;
					}

					return !e2.moveNext();
				}
			)
		);
	}

	//isEquivalent(second:ForEachEnumerable<T>,
	//	equalityComparer:EqualityComparison<T> = valuesAreEqual):boolean
	//{
	//	return this
	//		.orderBy(keySelector)
	//		.sequenceEqual(Enumerable.from(second).orderBy(keySelector))
	//}


	// #endregion


	ofType<TType>(type:{ new(...params:any[]):TType }):LinqEnumerable<TType>;
	ofType<TType>(type:any):LinqEnumerable<TType>
	{
		this.throwIfDisposed();
		return <LinqEnumerable<TType>>super.ofType(type);
	}

// #region Ordering Methods

	orderBy<TKey extends Comparable>(keySelector:Selector<T, TKey> = <any>Functions.Identity):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TKey>(this, keySelector, Order.Ascending);
	}

	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, any>(this, null, Order.Ascending, null, comparison);
	}

	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, any>(this, null, Order.Descending, null, comparison);
	}

	orderByDescending<TKey extends Comparable>(keySelector:Selector<T, TKey> = <any>Functions.Identity):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TKey>(this, keySelector, Order.Descending);
	}

	/*
		 weightedSample(weightSelector) {
		 weightSelector = Utils.createLambda(weightSelector);
		 var source = this;

		 return new LinqEnumerable<T>(() => {
		 var sortedByBound;
		 var totalWeight = 0;

		 return new EnumeratorBase<T>(
		 () => {
		 sortedByBound = source
		 .choose(function (x) {
		 var weight = weightSelector(x);
		 if (weight <= 0) return null; // ignore 0

		 totalWeight += weight;
		 return { value: x, bound: totalWeight }
		 })
		 .toArray();
		 },
		 () => {
		 if (sortedByBound.length > 0) {
		 var draw = (Math.random() * totalWeight) + 1;

		 var lower = -1;
		 var upper = sortedByBound.length;
		 while (upper - lower > 1) {
		 var index = ((lower + upper) / 2);
		 if (sortedByBound[index].bound >= draw) {
		 upper = index;
		 }
		 else {
		 lower = index;
		 }
		 }

		 return (<any>this).yieldReturn(sortedByBound[upper].value);
		 }

		 return (<any>this).yieldBreak();
		 },
		 Functions.Blank);
		 });
		 }
		 */

	// #endregion

	buffer(size:number):LinqEnumerable<T[]>
	{
		return <LinqEnumerable<T[]>>super.buffer(size);
	}

	// #region Grouping Methods

	// Originally contained a result selector (not common use), but this could be done simply by a select statement after.

	groupBy<TKey>(keySelector:SelectorWithIndex<T, TKey>):LinqEnumerable<Grouping<TKey, T>>;

	groupBy<TKey>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, T>,
		compareSelector?:HashSelector<TKey>):LinqEnumerable<Grouping<TKey, T>>;

	groupBy<TKey, TElement>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TElement>,
		compareSelector?:HashSelector<TKey>):LinqEnumerable<Grouping<TKey, TElement>>


	groupBy<TKey, TElement>(
		keySelector:SelectorWithIndex<T, TKey> | Selector<T, TKey>,
		elementSelector?:SelectorWithIndex<T, TElement> | Selector<T, TElement>,
		compareSelector?:HashSelector<TKey>):LinqEnumerable<Grouping<TKey, TElement>>
	{
		if(!elementSelector) elementSelector = <any>Functions.Identity; // Allow for 'null' and not just undefined.
		return new LinqEnumerable<Grouping<TKey, TElement>>(
			() => this
				.toLookup(keySelector, elementSelector, compareSelector)
				.getEnumerator()
		);
	}

	partitionBy<TKey>(keySelector:Selector<T, TKey>):LinqEnumerable<Grouping<TKey, T>>;
	partitionBy<TKey, TElement>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => Grouping<TKey, TElement>,
		compareSelector?:Selector<TKey, any>):LinqEnumerable<Grouping<TKey, TElement>>;
	partitionBy<TKey, TElement>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		resultSelector:(key:TKey, element:TElement[]) => Grouping<TKey, TElement>
			= (key:TKey, elements:TElement[]) => new Grouping<TKey, TElement>(key, elements),
		compareSelector:Selector<TKey, any>
			= <any>Functions.Identity):LinqEnumerable<Grouping<TKey, T>> | LinqEnumerable<Grouping<TKey, TElement>>
	{

		const _ = this;
		if(!elementSelector) elementSelector = <any>Functions.Identity; // Allow for 'null' and not just undefined.
		return new LinqEnumerable<Grouping<TKey, TElement>>(
			() => {
				let enumerator:IEnumerator<T>;
				let key:TKey;
				let compareKey:any;
				let group:TElement[] | null;
				let len:number;

				return new EnumeratorBase<Grouping<TKey, TElement>>(
					() => {
						throwIfDisposed(!elementSelector);
						enumerator = _.getEnumerator();
						if(enumerator.moveNext())
						{
							let v = <T>enumerator.current;
							key = keySelector(v);
							compareKey = compareSelector(key);
							group = [elementSelector!(v)];
							len = 1;
						}
						else
							group = null;
					},

					(yielder) => {
						throwIfDisposed(!elementSelector);

						if(!group)
							return yielder.yieldBreak();

						let hasNext:boolean, c:T;
						while((hasNext = enumerator.moveNext()))
						{
							c = <T>enumerator.current;
							if(areEqualValues(compareKey, compareSelector(keySelector(c))))
								group[len++] = elementSelector!(c);
							else
								break;
						}

						let result:Grouping<TKey, TElement>
							    = resultSelector(key, group);

						if(hasNext)
						{
							c = <T>enumerator.current;
							key = keySelector(c);
							compareKey = compareSelector(key);
							group = [elementSelector!(c)];
							len = 1;
						}
						else
						{
							group = null;
						}

						return yielder.yieldReturn(result);
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						group = null;
					}
				);
			},
			() => {
				elementSelector = NULL;
			}
		);
	}

	// #endregion

	// #region Aggregate Methods

	flatten<TFlat>():LinqEnumerable<TFlat>
	flatten():LinqEnumerable<any>
	flatten():LinqEnumerable<any>
	{
		return <any>super.flatten();
	}

	pairwise<TSelect>(
		selector:(
			previous:T, current:T,
			index:number) => TSelect):LinqEnumerable<TSelect>
	{
		return <any>super.pairwise(selector);
	}

	aggregate(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;

	aggregate<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;

	aggregate<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue?:U):U | undefined
	{
		if(initialValue==VOID0)
		{
			this.forEach((value, i) => {
				initialValue = i
					? reduction(initialValue!, value, i)
					: <any>value
			});
		}
		else
		{

			this.forEach((value, i) => {
				initialValue = reduction(initialValue!, value, i)
			});

		}
		return initialValue;
	}

	reduce<T>(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;

	reduce<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;

	/**
	 * Provided as an analog for array.reduce.  Simply a shortcut for aggregate.
	 * @param reduction
	 * @param initialValue
	 */
	reduce<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue?:U):U | undefined
	{
		//@ts-ignore
		return this.aggregate(reduction, initialValue);
	}

	average(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let count = 0;
		const sum = this.sum((e, i) => {
			count++;
			return selector(e, i);
		});

		return (isNaN(sum) || !count)
			? NaN
			: (sum/count);
	}

	// If using numbers, it may be useful to call .takeUntil(v=>v==Infinity,true) before calling max. See static versions for numbers.
	max():T | undefined
	{
		return this.aggregate(Functions.Greater);
	}

	min():T | undefined
	{
		return this.aggregate(Functions.Lesser);
	}

	maxBy(keySelector:Selector<T, Primitive> = <any>Functions.Identity):T | undefined
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)>keySelector(b)) ? a : b);
	}

	minBy(keySelector:Selector<T, Primitive> = <any>Functions.Identity):T | undefined
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)<keySelector(b)) ? a : b);
	}

	// Addition...  Only works with numerical enumerations.
	sum(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let sum = 0;

		// This allows for infinity math that doesn't destroy the other values.
		let sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

		this.forEach(
			(x, i) => {
				let value = selector(x, i);
				if(isNaN(value))
				{
					sum = NaN;
					return false;
				}
				if(isFinite(value))
					sum += value;
				else
					sumInfinite +=
						value>0 ? (+1) : (-1);
			}
		);

		return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite*Infinity) : sum);
	}

	// Multiplication...
	product(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let result = 1, exists:boolean = false;

		this.forEach(
			(x, i) => {
				exists = true;
				let value = selector(x, i);
				if(isNaN(value))
				{
					result = NaN;
					return false;
				}

				if(value==0)
				{
					result = 0; // Multiplying by zero will always end in zero.
					return false;
				}

				// Multiplication can never recover from infinity and simply must retain signs.
				// You could cancel out infinity with 1/infinity but no available representation exists.
				result *= value;
			}
		);

		return (exists && isNaN(result)) ? NaN : result;
	}

	/**
	 * Takes the first number and divides it by all following.
	 * @param selector
	 * @returns {number}
	 */
	quotient(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let count = 0;
		let result:number = NaN;

		this.forEach(
			(x, i) => {
				let value = selector(x, i);
				count++;

				if(count===1)
				{
					result = value;
				}
				else
				{
					if(isNaN(value) || value===0 || !isFinite(value))
					{
						result = NaN;
						return false;
					}

					result /= value;
				}

			}
		);

		if(count===1)
			result = NaN;

		return result;
	}

	// #endregion

	// #region Single Value Return...

	last():T
	{
		const _ = this;
		_.throwIfDisposed();

		let value:T | undefined = VOID0;
		let found:boolean = false;
		_.forEach(
			x => {
				found = true;
				value = x;
			}
		);

		if(!found) throw new Error("last:No element satisfies the condition.");
		return <any>value;
	}

	lastOrDefault():T | undefined
	lastOrDefault(defaultValue:T):T
	lastOrDefault(defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		let value:T | undefined = VOID0;
		let found:boolean = false;
		_.forEach(
			x => {
				found = true;
				value = x;
			}
		);
		return (!found) ? defaultValue : value;
	}

	// #endregion



	throwWhenEmpty():NotEmptyEnumerable<T>
	{
		return <any>this.doAction(RETURN, null, this.isEndless, count => {
			if(!count) throw "Collection is empty.";
		});
	}
}

export interface NotEmptyEnumerable<T>
	extends FiniteLinqEnumerable<T>
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

// Provided for type guarding.
export class FiniteLinqEnumerable<T>
	extends LinqEnumerableBase<T, FiniteLinqEnumerable<T>>
	implements FiniteIEnumerable<T>, IEnumerateEach<T>
{
	constructor(
		enumeratorFactory:() => FiniteIEnumerator<T>,
		finalizer?:Closure | null)
	{
		super(enumeratorFactory, finalizer);
		// @ts-ignore
		this._disposableObjectName = "FiniteLinqEnumerable";
	}

	protected _createEnumerable<T>(
		enumeratorFactory:Func<FiniteIEnumerator<T>>,
		finalizer?:Closure | null | undefined):any
	{
		return new FiniteLinqEnumerable<T>(enumeratorFactory, finalizer);
	}

	get isEndless():false
	{
		return false;
	}

	getEnumerator():FiniteIEnumerator<T>
	{
		return <any>super.getEnumerator();
	}

	asEnumerable():FiniteLinqEnumerable<T>
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new FiniteLinqEnumerable<T>(() => _.getEnumerator());
	}

	select<TResult>(selector:SelectorWithIndex<T, TResult>):FiniteLinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):FiniteLinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TResult> | null | undefined>):FiniteLinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):FiniteLinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):FiniteLinqEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}


	merge(enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
	{
		const _ = this;
		if(!enumerables || Type.isArrayLike(enumerables) && !enumerables.length)
			return <any>_;

		return new FiniteLinqEnumerable<T>(
			() => {
				let enumerator:IEnumerator<T>;
				let queue:Queue<FiniteEnumerableOrArrayLike<T>>;

				return new FiniteEnumeratorBase<T>(
					() => {
						// 1) First get our values...
						enumerator = _.getEnumerator();
						queue = new Queue<FiniteEnumerableOrArrayLike<T>>(enumerables);
					},

					(yielder) => {
						while(true)
						{

							while(!enumerator && queue.tryDequeue(value => {
								enumerator = enumUtil.from<T>(value); // 4) Keep going and on to step 2.  Else fall through to yieldBreak().
							}))
							{ }

							if(enumerator && enumerator.moveNext()) // 2) Keep returning until done.
								return yielder.yieldReturn(enumerator.current);

							if(enumerator) // 3) Dispose and reset for next.
							{
								enumerator.dispose();
								enumerator = NULL;
								continue;
							}

							return yielder.yieldBreak();
						}
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						if(queue) queue.dispose();
						queue = NULL;
					}
				);
			}
		);
	}

	concat(...enumerables:Array<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
	{
		return this.merge(enumerables);
	}

	union(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector:HashSelector<T> = <any>Functions.Identity):FiniteLinqEnumerable<T>
	{
		const _ = this;
		return new FiniteLinqEnumerable<T>(
			() => {
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<T>;
				let keys:Dictionary<T, any>;

				return new FiniteEnumeratorBase<T>(
					() => {
						firstEnumerator = _.getEnumerator();
						keys = new Dictionary<T, any>(compareSelector); // Acting as a HashSet.
					},

					(yielder) => {
						let current:T;
						if(secondEnumerator===VOID0)
						{
							while(firstEnumerator.moveNext())
							{
								current = <T>firstEnumerator.current;
								if(!keys.containsKey(current))
								{
									keys.addByKeyValue(current, null);
									return yielder.yieldReturn(current);
								}
							}
							secondEnumerator = enumUtil.from(second);
						}
						while(secondEnumerator.moveNext())
						{
							current = <T>secondEnumerator.current;
							if(!keys.containsKey(current))
							{
								keys.addByKeyValue(current, null);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						firstEnumerator = NULL;
						secondEnumerator = NULL;
					}
				);
			}
		);
	}


	// #region Conversion Methods
	toArray(predicate?:PredicateWithIndex<T>):T[]
	{
		return predicate
			? this.where(predicate).toArray()
			: this.copyTo([]);
	}

	copyTo(target:T[], index:number = 0, count:number = Infinity):T[]
	{
		this.throwIfDisposed();
		if(!target) throw new ArgumentNullException("target");
		Integer.assertZeroOrGreater(index);

		// If not exposing an action that could cause dispose, then use enumUtil.forEach utility instead.
		enumUtil.forEach<T>(this, (x, i) => {
			target[i + index] = x
		}, count);

		return target;
	}


	forEach(action:ActionWithIndex<T>, max?:number):number
	forEach(action:PredicateWithIndex<T>, max?:number):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, max:number = Infinity):number
	{
		const _ = this;
		_.throwIfDisposed();
		if(!action)
			throw new ArgumentNullException("action");
		throwIfEndless(_.isEndless);

		/*
		// It could be just as easy to do the following:
		return enumUtil.forEach(_, action, max);
		// But to be more active about checking for disposal, we use this instead:
		*/


		// Return value of action can be anything, but if it is (===) false then the enumUtil.forEach will discontinue.
		return max>0 ? using(
			_.getEnumerator(), e => {

				throwIfEndless(!isFinite(max) && e.isEndless);

				let i = 0;
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while(max>i && _.throwIfDisposed() && e.moveNext())
				{
					if(action(<T>e.current, i++)===false)
						break;
				}
				return i;
			}
		) : 0;
	}

	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue> = <any>Functions.Identity,
		compareSelector:HashSelector<TKey>           = <any>Functions.Identity):Lookup<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue[]> = new Dictionary<TKey, TValue[]>(compareSelector);
		this.forEach(
			(x, i) => {
				let key = keySelector(x, i);
				let element = elementSelector(x, i);

				let array = dict.getValue(key);
				if(array!==VOID0) array.push(element);
				else dict.addByKeyValue(key, [element]);
			}
		);
		return new Lookup<TKey, TValue>(dict);
	}

	toMap<TResult>(
		keySelector:SelectorWithIndex<T, string | number | symbol>,
		elementSelector:SelectorWithIndex<T, TResult>):IMap<TResult>
	{
		const obj:IMap<TResult> = {};
		this.forEach((x, i) => {
			//@ts-ignore
			obj[keySelector(x, i)] = elementSelector(x, i);
		});
		return obj;
	}


	toDictionary<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue>,
		compareSelector:HashSelector<TKey> = <any>Functions.Identity):IDictionary<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue> = new Dictionary<TKey, TValue>(compareSelector);
		this.forEach((x, i) => dict.addByKeyValue(keySelector(x, i), elementSelector(x, i)));
		return dict;
	}

	toJoinedString(separator:string = "", selector:Selector<T, string> = <any>Functions.Identity)
	{
		return this
			.select(selector)
			.toArray()
			.join(separator);
	}

	// #endregion

}

export interface IOrderedEnumerable<T>
	extends FiniteLinqEnumerable<T>
{
	thenBy(keySelector:(value:T) => any):IOrderedEnumerable<T>;

	thenByDescending(keySelector:(value:T) => any):IOrderedEnumerable<T>;

	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;

	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>;
}

export class ArrayEnumerable<T>
	extends FiniteLinqEnumerable<T>
{
	private _source:ArrayLike<T>;

	constructor(source:ArrayLike<T>)
	{
		super(() => {
			_.throwIfDisposed();
			return new ArrayEnumerator<T>(() => {
				_.throwIfDisposed("The underlying ArrayEnumerable was disposed.", "ArrayEnumerator");

				return _._source; // Should never be null, but ArrayEnumerable if not disposed simply treats null as empty array.
			});
		});

		const _ = this;
		// @ts-ignore
		this._disposableObjectName = "ArrayEnumerable";
		this._source = source;

	}

	protected _onDispose():void
	{
		super._onDispose();
		this._source = NULL;
	}

	get source():ArrayLike<T>
	{
		return this._source;
	}

	toArray():T[]
	{
		const _ = this;
		_.throwIfDisposed();

		return enumUtil.toArray(_._source);
	}

	asEnumerable():ArrayEnumerable<T>
	{
		const _ = this;
		_.throwIfDisposed();

		return new ArrayEnumerable<T>(this._source);
	}

	// Optimize forEach so that subsequent usage is optimized.
	forEach(action:ActionWithIndex<T>, max?:number):number
	forEach(action:PredicateWithIndex<T>, max?:number):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, max:number = Infinity):number
	{
		const _ = this;
		_.throwIfDisposed();

		return enumUtil.forEach(_._source, action, max);
	}

	// These methods should ALWAYS check for array length before attempting anything.

	any(predicate?:PredicateWithIndex<T>):boolean
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source;
		let len = source.length;
		return !!len && (!predicate || super.any(predicate));
	}

	count(predicate?:PredicateWithIndex<T>):number
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return len && (predicate ? super.count(predicate) : len);
	}

	elementAtOrDefault(index:number):T | undefined
	elementAtOrDefault(index:number, defaultValue:T):T
	elementAtOrDefault(index:number, defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();
		Integer.assertZeroOrGreater(index, 'index');

		const source = _._source;
		return index<source.length
			? source[index]
			: defaultValue;
	}

	last():T
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return (len)
			? source[len - 1]
			: super.last();
	}

	lastOrDefault():T | undefined
	lastOrDefault(defaultValue:T):T
	lastOrDefault(defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return len
			? source[len - 1]
			: defaultValue;
	}

	skip(count:number):this
	{

		const _ = this;
		_.throwIfDisposed();

		if(!(count>0))
			return _;

		return <any> new LinqEnumerable<T>(
			() => new ArrayEnumerator<T>(() => _._source, count)
		);
	}

	takeExceptLast(count:number = 1):this
	{
		const _ = this;
		_.throwIfDisposed();

		return <any> _.take(_._source.length - count);
	}

	skipToLast(count:number):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!(count>0))
			return <any> Enumerable.empty<T>();

		if(!isFinite(count))
			return _;

		const len = _._source
			? _._source.length
			: 0;

		return <any> _.skip(len - count);
	}

	reverse():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		return <any> new LinqEnumerable<T>(
			() => {
				_.throwIfDisposed();
				return new IndexEnumerator<T>(
					() => {
						let s = _._source;
						throwIfDisposed(disposed || !s);
						return {
							source: s,
							pointer: (s.length - 1),
							length: s.length,
							step: -1
						};
					}
				)
			},
			() => {
				disposed = true;
			}
		);
	}

	memoize():this
	{
		return this.asEnumerable();
	}

	sequenceEqual(
		second:FiniteIEnumerable<T>,
		equalityComparer:EqualityComparison<T> = areEqualValues):boolean
	{
		if(Type.isArrayLike(second))
			return Arrays.areEqual(this.source, second, true, equalityComparer);

		// noinspection SuspiciousInstanceOfGuard
		if(second instanceof ArrayEnumerable)
			return second.sequenceEqual(this.source, equalityComparer);

		return super.sequenceEqual(second, equalityComparer);
	}


	toJoinedString(separator:string = "", selector:Selector<T, string> = <any>Functions.Identity)
	{
		const s = this._source;
		return !selector && (s) instanceof (Array)
			? (<Array<T>>s).join(separator)
			: super.toJoinedString(separator, selector);
	}

}


export class Grouping<TKey, TElement>
	extends ArrayEnumerable<TElement>
{

	constructor(private _groupKey:TKey, elements:TElement[])
	{
		super(elements);
		// @ts-ignore
		this._disposableObjectName = "Grouping";
	}

	get key():TKey
	{
		return this._groupKey;
	}
}

export class Lookup<TKey, TElement>
{

	constructor(private _dictionary:IDictionary<TKey, TElement[]>)
	{
	}

	get count():number
	{
		return this._dictionary.count;
	}

	get(key:TKey):TElement[] | null
	{
		return this._dictionary.getValue(key) || null;
	}

	contains(key:TKey):boolean
	{
		return this._dictionary.containsKey(key);
	}

	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
	{

		const _ = this;
		let enumerator:IEnumerator<KeyValuePair<TKey, TElement[]>>;

		return new EnumeratorBase<Grouping<TKey, TElement>>(
			() => {
				enumerator = _._dictionary.getEnumerator();
			},
			(yielder) => {

				if(!enumerator.moveNext())
					return false;

				let current = <KeyValuePair<TKey, TElement[]>>enumerator.current;
				return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
			},
			() => {
				if(enumerator) enumerator.dispose();
				enumerator = NULL;
			}
		);
	}

}


export class OrderedEnumerable<T, TOrderBy extends Comparable>
	extends FiniteLinqEnumerable<T>
{

	constructor(
		private source:IEnumerable<T>,
		public keySelector:Selector<T, TOrderBy> | null,
		public order:Order,
		public parent?:OrderedEnumerable<T, any> | null,
		public comparer:Comparison<T> = compareValues)
	{
		super(NULL);
		throwIfEndless(source && source.isEndless);
		// @ts-ignore
		this._disposableObjectName = "OrderedEnumerable";
	}

	private createOrderedEnumerable(
		keySelector:Selector<T, TOrderBy>,
		order:Order):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TOrderBy>(this.source, keySelector, order, this);
	}

	thenBy(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Ascending);
	}

	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T, any>(this.source, null, Order.Ascending, this, comparison);
	}

	thenByDescending(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Descending);
	}

	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T, any>(this.source, null, Order.Descending, this, comparison);
	}

	getEnumerator():EnumeratorBase<T>
	{
		const _ = this;
		_.throwIfDisposed();

		let buffer:T[];
		let indexes:number[];
		let index:number = 0;

		return new EnumeratorBase<T>(
			() => {
				_.throwIfDisposed();
				index = 0;
				buffer = Enumerable.toArray(_.source);
				indexes = createSortContext(_)
					.generateSortedIndexes(buffer);
			},

			(yielder) => {
				_.throwIfDisposed();
				return (index<indexes.length)
					? yielder.yieldReturn(buffer[indexes[index++]])
					: false;
			},

			() => {
				if(buffer)
					buffer.length = 0;
				buffer = NULL;
				if(indexes)
					indexes.length = 0;
				indexes = NULL;
			},

			false
		);
	}

	protected _onDispose():void
	{
		const _:this = this;
		super._onDispose();
		_.source = NULL;
		_.keySelector = NULL;
		_.order = NULL;
		_.parent = NULL;
	}

}



/**
 * Recursively builds a SortContext chain.
 * @param orderedEnumerable
 * @param currentContext
 * @returns {any}
 */
function createSortContext<T, TOrderBy extends Comparable>(
	orderedEnumerable:OrderedEnumerable<T, TOrderBy>,
	currentContext:IComparer<T> | null = null):KeySortedContext<T, TOrderBy>
{

	const context = new KeySortedContext<T, TOrderBy>(
		currentContext,
		orderedEnumerable.keySelector,
		orderedEnumerable.order,
		orderedEnumerable.comparer);

	if(orderedEnumerable.parent)
		return createSortContext(orderedEnumerable.parent, context);

	return context;
}

// #region Helper Functions...
// This allows for the use of a boolean instead of calling this.throwIfDisposed()
// since there is a strong chance of introducing a circular reference.

function throwIfDisposed(disposed:true):true
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:false):never
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:boolean):true | never
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:boolean):true | never
{
	if(disposed) throw new ObjectDisposedException("Enumerable");
	return true;
}

// #endregion

export function Enumerable<T>(
	source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>
export function Enumerable<T>(
	source:FiniteEnumerableOrArrayLike<T>,
	...additional:Array<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
export function Enumerable<T>(
	source:FiniteEnumerableOrArrayLike<T> | InfiniteValueFactory<T>,
	...additional:Array<FiniteEnumerableOrArrayLike<T>>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T>
{
	return enumerableFrom(source, additional);
}

function enumerableFrom<T>(
	source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>
function enumerableFrom<T>(
	source:FiniteEnumerableOrArrayLike<T>,
	additional?:Array<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
function enumerableFrom<T>(
	source:FiniteEnumerableOrArrayLike<T> | InfiniteValueFactory<T>,
	additional?:Array<FiniteEnumerableOrArrayLike<T>>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T>
function enumerableFrom<T>(
	source:FiniteEnumerableOrArrayLike<T> | InfiniteValueFactory<T>,
	additional?:Array<FiniteEnumerableOrArrayLike<T>>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T>
{
	let e = Enumerable.fromAny<T>(<any>source);
	if(!e) throw new UnsupportedEnumerableException();

	return (additional && additional.length)
		? <any>e.merge(additional)
		: <any>e;
}

export module Enumerable
{
	/**
	 * Universal method for converting a primitive enumerables into a LINQ enabled ones.
	 *
	 * Is not limited to TypeScript usages.
	 */
	export function from<T>(source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>
	export function from<T>(
		source:FiniteEnumerableOrArrayLike<T>,
		...additional:Array<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
	export function from<T>(
		source:FiniteEnumerableOrArrayLike<T> | InfiniteValueFactory<T>,
		...additional:Array<FiniteEnumerableOrArrayLike<T>>):EndlessLinqEnumerable<T> | FiniteLinqEnumerable<T>
	{
		return enumerableFrom(source, additional);
	}

	export function fromAny<T>(
		source:InfiniteValueFactory<T>):EndlessLinqEnumerable<T>

	export function fromAny<T>(
		source:FiniteEnumerableOrArrayLike<T>):FiniteLinqEnumerable<T>

	export function fromAny(
		source:any):LinqEnumerable<any> | undefined

	export function fromAny<T>(
		source:FiniteIEnumerable<T>,
		defaultEnumerable:LinqEnumerable<T>):LinqEnumerable<T>

	export function fromAny<T>(
		source:any,
		defaultEnumerable?:LinqEnumerable<T>):LinqEnumerable<T> | EndlessLinqEnumerable<T> | undefined
	{
		if(Type.isObject(source) || Type.isString(source))
		{
			if(source instanceof EndlessLinqEnumerable)
				return source;

			if(Type.isArrayLike<T>(source))
				return new ArrayEnumerable<T>(source);

			if(isEnumerable<T>(source))
				return new LinqEnumerable<T>(
					() => source.getEnumerator(),
					null, source.isEndless);

			if(isEnumerator<T>(source))
				return new LinqEnumerable<T>(
					() => source, null, source.isEndless);

			if(isIterator<T>(source))
				return fromAny(new IteratorEnumerator(source));
		}
		else if(Type.isFunction(source))
		{
			return new EndlessLinqEnumerable<T>(
				() => new EndlessEnumerator<T>(source));
		}

		return defaultEnumerable;
	}

	export function fromThese<T>(sources:FiniteEnumerableOrArrayLike<T>[]):FiniteLinqEnumerable<T>
	{
		switch(sources ? sources.length : 0)
		{
			case 0:
				return empty<T>();
			case 1:
				// Allow for validation and throwing...
				return enumerableFrom(sources[0]);
			default:
				return empty<T>().merge(sources);
		}
	}

	export function fromOrEmpty<T>(source:FiniteEnumerableOrArrayLike<T>):LinqEnumerable<T>
	{
		return fromAny(source) || empty<T>();
	}

	/**
	 * Static helper for converting enumerables to an array.
	 * @param source
	 * @returns {any}
	 */
	export function toArray<T>(source:FiniteEnumerableOrArrayLike<T>):T[]
	{
		// noinspection SuspiciousInstanceOfGuard
		if(source instanceof LinqEnumerable)
			return source.toArray();

		return enumUtil.toArray(source);
	}


	function _choice<T>(values:T[]):EndlessLinqEnumerable<T>
	{
		return new EndlessLinqEnumerable<T>(
			() => new EndlessEnumeratorBase<T>(
				null,
				(yielder) => {
					throwIfDisposed(!values);
					return yielder.yieldReturn(Random.select.one(values));
				}
			),
			() => {
				values.length = 0;
				values = NULL;
			}
		);
	}

	export function choice<T>(values:ArrayLike<T>):EndlessLinqEnumerable<T>
	{
		let len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		return _choice(copy(values));
	}

	export function chooseFrom<T>(arg:T, ...args:T[]):EndlessLinqEnumerable<T>
	export function chooseFrom<T>(...args:T[]):EndlessLinqEnumerable<T>
	{
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!args.length)
			throw new ArgumentOutOfRangeException('length', length);

		return _choice(args);
	}


	/**
	 * DEPRECATED This method began to not make sense in so many ways.
	 * @deprecated since version 4.2
	 * @param initializer
	 * @param finalizer
	 */
	// Note: this enumeration is endless but can be disposed/cancelled and finalized.
	export function repeatWithFinalize<T>(
		initializer:() => T,
		finalizer:Closure):EndlessLinqEnumerable<T>
	export function repeatWithFinalize<T>(
		initializer:() => T,
		finalizer?:Action<T>):EndlessLinqEnumerable<T>
	export function repeatWithFinalize<T>(
		initializer:() => T,
		finalizer?:Action<T>):EndlessLinqEnumerable<T>
	{
		if(!initializer)
			throw new ArgumentNullException("initializer");

		return new EndlessLinqEnumerable<T>(
			() => {
				let element:T;
				return new EndlessEnumeratorBase<T>(
					() => {
						if(initializer)
							element = initializer();
					},

					(yielder) => {
						return initializer
							? yielder.yieldReturn(element)
							: yielder.yieldBreak();
					},

					() => {
						element = NULL;
						if(finalizer) finalizer(element);
					}
				);
			},
			() => {
				initializer = NULL;
				finalizer = VOID0;
			}
		);
	}

	/**
	 * Creates an enumerable of one element.
	 * @param element
	 * @returns {FiniteIEnumerable<T>}
	 */
	export function make<T>(element:T):FiniteLinqEnumerable<T>
	{
		return repeat<T>(element, 1);
	}


	export module random
	{
		export function floats(maxExclusive:number = 1):EndlessLinqEnumerable<number>
		{
			return generate(Random.generate(maxExclusive));
		}

		export function integers(boundary:number, inclusive?:boolean):EndlessLinqEnumerable<number>
		{
			return generate(Random.generate.integers(boundary, inclusive));
		}
	}

	export function unfold<T>(
		seed:T,
		valueFactory:SelectorWithIndex<T, T>,
		skipSeed:Boolean = false):EndlessLinqEnumerable<T>
	{
		if(!valueFactory)
			throw new ArgumentNullException("factory");

		return new EndlessLinqEnumerable<T>(
			() => {
				let index:number = 0;
				let value:T;
				let isFirst:boolean;
				return new EndlessEnumeratorBase<T>(
					() => {
						index = 0;
						value = seed;
						isFirst = !skipSeed;
					},

					(yielder) => {
						throwIfDisposed(!valueFactory);
						let i = index++;
						if(isFirst)
							isFirst = false;
						else
							value = valueFactory(value, i);
						return yielder.yieldReturn(value);
					}
				);
			},
			() => {
				valueFactory = NULL;
			}
		);
	}

	export function forEach<T>(
		e:FiniteEnumerableOrArrayLike<T>,
		action:ActionWithIndex<T>,
		max?:number):number

	export function forEach<T>(
		e:FiniteEnumerableOrArrayLike<T>,
		action:PredicateWithIndex<T>,
		max?:number):number

	export function forEach<T>(
		enumerable:FiniteEnumerableOrArrayLike<T>,
		action:ActionWithIndex<T> | PredicateWithIndex<T>,
		max:number = Infinity):number
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return enumUtil.forEach(enumerable, action, max);
	}

	export function map<T, TResult>(
		enumerable:FiniteEnumerableOrArrayLike<T>,
		selector:SelectorWithIndex<T, TResult>):TResult[]
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return enumUtil.map(enumerable, selector);
	}

// Slightly optimized versions for numbers.
	export function max(values:FiniteEnumerableOrArrayLike<number>):number
	{
		const v = from(values)
			.takeUntil(v => v== +Infinity, true)
			.aggregate(Functions.Greater);

		return v===VOID0 ? NaN : v;
	}

	export function min(values:FiniteEnumerableOrArrayLike<number>):number
	{
		const v = from(values)
			.takeUntil(v => v== -Infinity, true)
			.aggregate(Functions.Lesser);

		return v===VOID0 ? NaN : v;
	}



}

export default Enumerable;
