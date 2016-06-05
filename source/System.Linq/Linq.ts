/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import * as Values from "../System/Compare";
import * as Arrays from "../System/Collections/Array/Compare";
import * as ArrayUtility from "../System/Collections/Array/Utility";
import {
	from as enumeratorFrom,
	forEach,
	toArray,
	map,
	isEnumerable,
	throwIfEndless
} from "../System/Collections/Enumeration/Enumerator";
import {EmptyEnumerator} from "../System/Collections/Enumeration/EmptyEnumerator";
import {Type} from "../System/Types";
import {Integer} from "../System/Integer";
import {Functions as BaseFunctions} from "../System/Functions";
import {ArrayEnumerator} from "../System/Collections/Enumeration/ArrayEnumerator";
import {EnumeratorBase} from "../System/Collections/Enumeration/EnumeratorBase";
import {Dictionary} from "../System/Collections/Dictionaries/Dictionary";
import {Queue} from "../System/Collections/Queue";
import {dispose, using} from "../System/Disposable/dispose";
import {DisposableBase} from "../System/Disposable/DisposableBase";
import {UnsupportedEnumerableException} from "../System/Collections/Enumeration/UnsupportedEnumerableException";
import {ObjectDisposedException} from "../System/Disposable/ObjectDisposedException";
import {KeySortedContext} from "../System/Collections/Sorting/KeySortedContext";
import {ArgumentNullException} from "../System/Exceptions/ArgumentNullException";
import {ArgumentOutOfRangeException} from "../System/Exceptions/ArgumentOutOfRangeException";
import {IEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import {IEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {Action, Predicate, Selector, EqualityComparison, Comparison} from "../System/FunctionTypes";
import {IEnumerableOrArray} from "../System/Collections/IEnumerableOrArray";
import {IArray} from "../System/Collections/Array/IArray";
import {IMap, IDictionary} from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";
import {IComparer} from "../System/IComparer";
import {IKeyValuePair} from "../System/KeyValuePair";
import {Order} from "../System/Collections/Sorting/Order";
import {
	IInfiniteEnumerable,
	ILinqEnumerable,
	IFiniteEnumerable,
	ILookup,
	IOrderedEnumerable,
	IGrouping,
	EnumerableAction
} from "./Enumerable";
import __extendsImport from "../extends";
const __extends = __extendsImport;


// #region Local Constants.

const INVALID_DEFAULT:any = {}; // create a private unique instance for referencing.
const VOID0:any = void 0;
const BREAK:(e:any)=>EnumerableAction = element => EnumerableAction.Break;

// Leave internal to avoid accidental overwriting.
class LinqFunctions extends BaseFunctions
{
	Greater<T>(a:T, b:T)
	{
		return a>b ? a : b;
	}

	Lesser<T>(a:T, b:T)
	{
		return a<b ? a : b;
	}
}

var Functions = new LinqFunctions();
Object.freeze(Functions);

// For re-use as a factory.
function getEmptyEnumerator():IEnumerator<any>
{
	return EmptyEnumerator;
}

// #endregion



/*
 * NOTE: About InfiniteEnumerable<T> and Enumerable<T>.
 * There may seem like there's extra overrides here and they may seem unnecessary.
 * But after closer inspection you'll see the type chain is retained and
 * infinite enumerables are prevented from having features that finite ones have.
 *
 * I'm not sure if it's the best option to just use overrides, but it honors the typing properly.
 */

export class InfiniteEnumerable<T>
extends DisposableBase implements IInfiniteEnumerable<T>
{
	constructor(
		protected _enumeratorFactory:() => IEnumerator<T>,
		finalizer?:() => void)
	{
		super(finalizer);
		this._isEndless = true;
	}

	protected _isEndless:boolean;
	get isEndless():boolean
	{
		return this._isEndless;
	}

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
		this._enumeratorFactory = null;
	}

	// #endregion

	// Return a default (unfiltered) enumerable.
	asEnumerable():InfiniteEnumerable<T>
	{
		var _ = this;
		_.throwIfDisposed();
		return new InfiniteEnumerable<T>(() => _.getEnumerator());
	}


	/**
	 * Similar to forEach, but executes an action for each time a value is enumerated.
	 * If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
	 * If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
	 * This also automatically handles disposing the enumerator.
	 */
	doAction(
		action:Action<T> | Predicate<T> | Selector<T, number> | Selector<T, EnumerableAction>,
		initializer?:()=>void,
		isEndless:boolean = this.isEndless):InfiniteEnumerable<T>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);

						if(initializer) initializer();
						index = 0;
						enumerator = _.getEnumerator();
						// May need a way to propagate isEndless
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						while(enumerator.moveNext())
						{
							var actionResult = <any>action(enumerator.current, index++);

							if(actionResult===false || actionResult===EnumerableAction.Break)
								return yielder.yieldBreak();

							if(actionResult!==EnumerableAction.Skip) // || !== 2
								return yielder.yieldReturn(enumerator.current);

							// If actionResult===2, then a signal for skip is received.
						}
						return false;
					},

					() =>
					{
						dispose(enumerator);
					},

					isEndless
				);

			},
			// Using a finalizer value reduces the chance of a circular reference
			// since we could simply reference the enumeration and check e.wasDisposed.
			() =>
			{
				disposed = true;
			},

			isEndless
		);
	}


	force():void
	{
		this.throwIfDisposed();
		this.doAction(BREAK)
			.getEnumerator()
			.moveNext();

	}

	// #region Indexing/Paging methods.
	skip(count:number):InfiniteEnumerable<T>
	{
		var _ = this;
		_.throwIfDisposed();

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return Enumerable.empty<T>();

		Integer.assert(count, "count");

		return this.doAction(
			(element:T, index?:number) =>
				index<count
					? EnumerableAction.Skip
					: EnumerableAction.Return
		);
	}


	take(count:number):FiniteEnumerable<T>
	{
		if(!(count>0)) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		var _ = this;
		_.throwIfDisposed();

		if(!isFinite(count))
			throw new ArgumentOutOfRangeException('count', count, 'Must be finite.');

		Integer.assert(count, "count");

		// Once action returns false, the enumeration will stop.
		return <Enumerable<T>>_.doAction((element:T, index?:number) => index<count, null, false);
	}

	// #region Single Value Return...

	elementAt(index:number):T
	{
		var v = this.elementAtOrDefault(index, INVALID_DEFAULT);
		if(v===INVALID_DEFAULT) throw new ArgumentOutOfRangeException('index', index, "is greater than or equal to the number of elements in source");
		return v;
	}

	elementAtOrDefault(index:number, defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		Integer.assertZeroOrGreater(index, 'index');
		var n:number = index;

		return using(
			this.getEnumerator(),
			e=>
			{
				var i = 0;
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
	 * */

	first():T
	{
		var v = this.firstOrDefault(INVALID_DEFAULT);
		if(v===INVALID_DEFAULT) throw new Error("first:The sequence is empty.");
		return v;
	}

	firstOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e=> e.moveNext() ? e.current : defaultValue
		);
	}


	single():T
	{
		var _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e=>
			{
				if(e.moveNext())
				{
					var value = e.current;
					if(!e.moveNext()) return value;
					throw new Error("single:sequence contains more than one element.");
				}
				throw new Error("single:The sequence is empty.");
			}
		);
	}

	singleOrDefault(defaultValue:T = null):T
	{

		var _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e=>
			{
				if(e.moveNext())
				{
					var value = e.current;
					if(!e.moveNext()) return value;
				}
				return defaultValue;
			}
		);
	}

	any():boolean
	{
		var _ = this;
		_.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e=> e.moveNext()
		);
	}

	isEmpty():boolean
	{
		return !this.any();
	}

	// #endregion


	// #region Projection and Filtering Methods

	traverseBreadthFirst(
		childrenSelector:(element:T) => IEnumerableOrArray<T>):Enumerable<T>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>):Enumerable<TNode>;

	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):Enumerable<TResult>;

	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):Enumerable<TResult>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>,
		resultSelector:(
			element:TNode,
			nestLevel?:number) => any = Functions.Identity):Enumerable<any>
	{
		var _ = this, isEndless = _._isEndless || null; // Is endless is not affirmative if false.


		return new Enumerable<any>(
			() =>
			{
				var enumerator:IEnumerator<any>;
				var nestLevel:number = 0;
				var buffer:any[], len:number;

				return new EnumeratorBase<any>(
					() =>
					{
						nestLevel = 0;
						buffer = [];
						len = 0;
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						while(true)
						{
							if(enumerator.moveNext())
							{
								buffer[len++] = enumerator.current;
								return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							if(!len)
								return yielder.yieldBreak();

							var next = Enumerable
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

					() =>
					{
						dispose(enumerator);
						buffer.length = 0;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}


	traverseDepthFirst(
		childrenSelector:(element:T) => IEnumerableOrArray<T>):Enumerable<T>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>):Enumerable<TNode>;

	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => IEnumerableOrArray<T>,
		resultSelector?:(element:T, nestLevel?:number) => TResult):Enumerable<TResult>;

	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>,
		resultSelector?:(element:TNode, nestLevel?:number) => TResult):Enumerable<TResult>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T|TNode) => IEnumerableOrArray<TNode>,
		resultSelector:(
			element:TNode,
			nestLevel?:number) => any = Functions.Identity):Enumerable<any>
	{
		var _ = this, isEndless = _._isEndless || null; // Is endless is not affirmative if false.

		return new Enumerable<any>(
			() =>
			{
				// Dev Note: May want to consider using an actual stack and not an array.
				var enumeratorStack:IEnumerator<any>[] = [];
				var enumerator:IEnumerator<any>;
				var len:number;  // Avoid using push/pop since they query .length every time and can be slower.

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						len = 0;
					},

					(yielder)=>
					{
						while(true)
						{
							if(enumerator.moveNext())
							{
								let value = resultSelector(enumerator.current, len);
								enumeratorStack[len++] = enumerator;
								let e = Enumerable.fromAny<any>(childrenSelector(enumerator.current));
								enumerator = e ? e.getEnumerator() : EmptyEnumerator;
								return yielder.yieldReturn(value);
							}

							if(len==0) return false;

							enumerator.dispose();
							enumerator = enumeratorStack[--len];
							enumeratorStack.length = len;
						}
					},

					() =>
					{
						try
						{
							dispose(enumerator);
						}
						finally
						{
							dispose.these(enumeratorStack);
						}
					},

					isEndless
				);
			},
			null,
			isEndless
		);
	}


	flatten():Enumerable<any>
	{
		var _ = this, isEndless = _._isEndless || null; // Is endless is not affirmative if false.;

		return new Enumerable<any>(
			() =>
			{
				var enumerator:IEnumerator<any>;
				var middleEnumerator:IEnumerator<any> = null;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						while(true)
						{
							if(middleEnumerator)
							{
								if(middleEnumerator.moveNext())
								{
									return yielder.yieldReturn(middleEnumerator.current);
								}
								else
								{
									middleEnumerator.dispose();
									middleEnumerator = null;
								}
							}

							if(enumerator.moveNext())
							{
								var c = enumerator.current;
								// Because strings are enumerable, we can get stuck in an infinite loop.
								// Treat strings as primitives here.
								var e = !Type.isString(c) && Enumerable.fromAny(c);
								if(e)
								{
									middleEnumerator
										= e
										.selectMany(Functions.Identity)
										.flatten()
										.getEnumerator();
									continue;
								}
								else
								{
									return yielder.yieldReturn(c);
								}
							}

							return yielder.yieldBreak();
						}
					},

					() =>
					{
						dispose(enumerator, middleEnumerator);
					},

					isEndless
				);
			},
			null,
			isEndless
		);
	}


	pairwise<TSelect>(selector:(prev:T, current:T) => TSelect):Enumerable<TSelect>
	{
		var _ = this;

		return new Enumerable<TSelect>(
			() =>
			{
				var enumerator:IEnumerator<T>;

				return new EnumeratorBase<TSelect>(
					() =>
					{
						enumerator = _.getEnumerator();
						enumerator.moveNext();
					},

					(yielder)=>
					{
						var prev = enumerator.current;
						return enumerator.moveNext()
							&& yielder.yieldReturn(selector(prev, enumerator.current));
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},
			null,

			_._isEndless
		);
	}

	scan(func:(a:T, b:T) => T, seed?:T):Enumerable<T>
	{

		var isUseSeed = seed!==VOID0; // For now...
		var _ = this;

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var value:T;
				var isFirst:boolean;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						isFirst = true;
					},

					(yielder)=>
					{
						if(isFirst)
						{
							isFirst = false;
							//noinspection JSUnusedAssignment
							return isUseSeed
								? yielder.yieldReturn(value = seed)
								: enumerator.moveNext() && yielder.yieldReturn(value
								= enumerator.current);
						}

						return (enumerator.moveNext())
							? yielder.yieldReturn(value = func(value, enumerator.current))
							: false;
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},
			null,

			_._isEndless
		);
	}

	// #endregion

	select<TResult>(selector:Selector<T, TResult>):InfiniteEnumerable<TResult>
	{
		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<TResult>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						throwIfDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						return enumerator.moveNext()
							? yielder.yieldReturn(selector(enumerator.current, index++))
							: yielder.yieldBreak();
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			_._isEndless
		);
	}

	/*
	public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
		this IEnumerable<TSource> source,
		Func<TSource, IEnumerable<TCollection>> collectionSelector,
		Func<TSource, TCollection, TResult> resultSelector)
	 */

	protected _selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector?:(collection:T, element:TElement) => TResult):Enumerable<TResult>
	{
		var _ = this, isEndless = _._isEndless || null; // Do second enumeration, it will be indeterminate if false.
		if(!resultSelector)
			resultSelector = (a:T, b:any) => <TResult>b;

		return new Enumerable<TResult>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var middleEnumerator:IEnumerator<any>;
				var index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						enumerator = _.getEnumerator();
						middleEnumerator = undefined;
						index = 0;
					},

					(yielder)=>
					{

						// Just started, and nothing to enumerate? End.
						if(middleEnumerator===VOID0 && !enumerator.moveNext())
							return false;

						// moveNext has been called at least once...
						do
						{

							// Initialize middle if there isn't one.
							if(!middleEnumerator)
							{
								var middleSeq = collectionSelector(enumerator.current, index++);

								// Collection is null?  Skip it...
								if(!middleSeq)
									continue;

								middleEnumerator = enumeratorFrom(middleSeq);
							}

							if(middleEnumerator.moveNext())
								return yielder.yieldReturn(
									resultSelector(
										enumerator.current, middleEnumerator.current
									)
								);

							// else no more in this middle?  Then clear and reset for next...

							middleEnumerator.dispose();
							middleEnumerator = null;

						}
						while(enumerator.moveNext());

						return false;
					},

					() =>
					{
						dispose(enumerator, middleEnumerator);
						enumerator = null;
						middleEnumerator = null;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}

	selectMany<TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):InfiniteEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement) => TResult):InfiniteEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<any>>,
		resultSelector?:(collection:T, element:any) => TResult):InfiniteEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	protected _choose<TResult>(selector:Selector<T, TResult>):Enumerable<TResult>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<TResult>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						throwIfDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						while(enumerator.moveNext())
						{
							var result = selector(enumerator.current, index++);
							if(result!==null && result!==VOID0)
								return yielder.yieldReturn(result);
						}

						return false;
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			_._isEndless
		);
	}

	/**
	 * Returns selected values that are not null or undefined.
	 */
	choose():InfiniteEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):InfiniteEnumerable<TResult>
	choose(selector:Selector<T, any> = Functions.Identity):InfiniteEnumerable<any>
	{
		return this._choose(selector)
	}

	where(predicate:Predicate<T>):InfiniteEnumerable<T>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						while(enumerator.moveNext())
						{
							if(predicate(enumerator.current, index++))
								return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			_._isEndless
		);

	}

	ofType<TType>(type:{ new (...params:any[]):TType }):InfiniteEnumerable<TType>;
	ofType<TType>(type:any):InfiniteEnumerable<TType>
	{
		var typeName:string;
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
				return <Enumerable<any>>this
					.where(x=>x instanceof type);
		}
		return <Enumerable<any>>this
			.choose()
			.where(x=>(typeof x)===typeName);
	}

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):InfiniteEnumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var keys:Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new Dictionary<T, boolean>(compareSelector);
						if(second)
							forEach(second, key => { keys.addByKeyValue(key, true) });
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);
						while(enumerator.moveNext())
						{
							var current = enumerator.current;
							if(!keys.containsKey(current))
							{
								keys.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},

					() =>
					{
						dispose(enumerator);
						keys.clear();
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			_._isEndless
		);
	}

	distinct(compareSelector?:(value:T) => T):InfiniteEnumerable<T>
	{
		return this.except(null, compareSelector);
	}

	// [0,0,0,1,1,1,2,2,2,0,0,0,1,1] results in [0,1,2,0,1];
	distinctUntilChanged<TCompare>(compareSelector:Selector<T, TCompare> = Functions.Identity):InfiniteEnumerable<T>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var compareKey:TCompare;
				var initial:boolean = true;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);
						while(enumerator.moveNext())
						{
							var key = compareSelector(enumerator.current);

							if(initial)
							{
								initial = false;
							}
							else if(Values.areEqual(compareKey, key))
							{
								continue;
							}

							compareKey = key;
							return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			_._isEndless
		);
	}


	/**
	 * Returns a single default value if empty.
	 * @param defaultValue
	 * @returns {Enumerable}
	 */
	defaultIfEmpty(defaultValue:T = null):Enumerable<T>
	{
		var _ = this, disposed:boolean = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var isFirst:boolean;

				return new EnumeratorBase<T>(
					() =>
					{
						isFirst = true;
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						if(enumerator.moveNext())
						{
							isFirst = false;
							return yielder.yieldReturn(enumerator.current);
						}
						else if(isFirst)
						{
							isFirst = false;
							return yielder.yieldReturn(defaultValue);
						}
						return false;
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},
			null,

			_._isEndless
		);
	}

	zip<TSecond, TResult>(
		second:IEnumerableOrArray<TSecond>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>
	{
		var _ = this;
		_.throwIfDisposed();


		return new Enumerable<TResult>(
			() =>
			{
				var firstEnumerator:IEnumerator<T>;
				var secondEnumerator:IEnumerator<TSecond>;
				var index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumeratorFrom<TSecond>(second);
					},

					(yielder)=> firstEnumerator.moveNext()
					&& secondEnumerator.moveNext()
					&& yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++)),

					() =>
					{
						dispose(firstEnumerator, secondEnumerator);
					}
				);
			}
		);
	}


	zipMultiple<TSecond, TResult>(
		second:IArray<IEnumerableOrArray<TSecond>>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>
	{
		var _ = this;
		_.throwIfDisposed();

		if(!second.length)
			return Enumerable.empty<TResult>();

		return new Enumerable<TResult>(
			() =>
			{
				var secondTemp:Queue<any>;
				var firstEnumerator:IEnumerator<T>;
				var secondEnumerator:IEnumerator<TSecond>;
				var index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						secondTemp = new Queue<any>(second);
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = null;
					},

					(yielder)=>
					{
						if(firstEnumerator.moveNext())
						{
							while(true)
							{
								while(!secondEnumerator)
								{
									if(secondTemp.count)
									{
										var next = secondTemp.dequeue();
										if(next) // In case by chance next is null, then try again.
											secondEnumerator = enumeratorFrom<TSecond>(next);
									}
									else
										return yielder.yieldBreak();
								}

								if(secondEnumerator.moveNext())
									return yielder.yieldReturn(
										resultSelector(firstEnumerator.current, secondEnumerator.current, index++)
									);

								secondEnumerator.dispose();
								secondEnumerator = null;
							}
						}

						return yielder.yieldBreak();
					},

					() =>
					{
						dispose(firstEnumerator, secondTemp);
					}
				);
			}
		);
	}


	// #region Join Methods

	join<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector:Selector<TKey, TCompare> = Functions.Identity):Enumerable<TResult>
	{

		var _ = this;
		return new Enumerable<TResult>(
			() =>
			{
				var outerEnumerator:IEnumerator<T>;
				var lookup:ILookup<TKey,TInner>;
				var innerElements:TInner[] = null;
				var innerCount:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						outerEnumerator = _.getEnumerator();
						lookup = Enumerable.from(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},

					(yielder)=>
					{
						while(true)
						{
							if(innerElements!=null)
							{
								var innerElement = innerElements[innerCount++];
								if(innerElement!==VOID0)
									return yielder.yieldReturn(resultSelector(outerEnumerator.current, innerElement));

								innerElement = null;
								innerCount = 0;
							}

							if(outerEnumerator.moveNext())
							{
								var key = outerKeySelector(outerEnumerator.current);
								innerElements = lookup.get(key);
							}
							else
							{
								return yielder.yieldBreak();
							}
						}
					},

					() =>
					{
						dispose(outerEnumerator);
					}
				);
			}
		);
	}

	groupJoin<TInner, TKey, TResult, TCompare>(
		inner:IEnumerableOrArray<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[]) => TResult,
		compareSelector:Selector<TKey, TCompare> = Functions.Identity):Enumerable<TResult>
	{
		var _ = this;

		return new Enumerable<TResult>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var lookup:ILookup<TKey, TInner> = null;

				return new EnumeratorBase<TResult>(
					() =>
					{
						enumerator = _.getEnumerator();
						lookup = Enumerable.from(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},

					(yielder)=>
					enumerator.moveNext()
					&& yielder.yieldReturn(
						resultSelector(
							enumerator.current,
							lookup.get(outerKeySelector(enumerator.current))
						)
					),

					() =>
					{
						dispose(enumerator);
					}
				);
			}
		);
	}


	merge(enumerables:IArray<IEnumerableOrArray<T>>):InfiniteEnumerable<T>
	{
		var _ = this, isEndless = _._isEndless || null;

		if(!enumerables || enumerables.length==0)
			return _;

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var queue:Queue<IEnumerableOrArray<T>>;

				return new EnumeratorBase<T>(
					() =>
					{
						// 1) First get our values...
						enumerator = _.getEnumerator();
						queue = new Queue<IEnumerableOrArray<T>>(enumerables);
					},

					(yielder) =>
					{
						while(true)
						{

							while(!enumerator && queue.count)
							{
								enumerator = enumeratorFrom<T>(queue.dequeue()); // 4) Keep going and on to step 2.  Else fall through to yieldBreak().
							}

							if(enumerator && enumerator.moveNext()) // 2) Keep returning until done.
								return yielder.yieldReturn(enumerator.current);

							if(enumerator) // 3) Dispose and reset for next.
							{
								enumerator.dispose();
								enumerator = null;
								continue;
							}

							return yielder.yieldBreak();
						}
					},

					() =>
					{
						dispose(enumerator, queue); // Just in case this gets disposed early.
					},

					isEndless
				);
			},
			null,
			isEndless
		);
	}

	concat(...enumerables:Array<IEnumerableOrArray<T>>):InfiniteEnumerable<T>
	{
		return this.merge(enumerables);
	}


	union<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector:Selector<T, TCompare> = Functions.Identity):Enumerable<T>
	{
		var _ = this, isEndless = _._isEndless || null;
		return new Enumerable<T>(
			() =>
			{
				var firstEnumerator:IEnumerator<T>;
				var secondEnumerator:IEnumerator<T>;
				var keys:Dictionary<T, any>;

				return new EnumeratorBase<T>(
					() =>
					{
						firstEnumerator = _.getEnumerator();
						keys = new Dictionary<T, any>(compareSelector); // Acting as a HashSet.
					},

					(yielder)=>
					{
						var current:T;
						if(secondEnumerator===VOID0)
						{
							while(firstEnumerator.moveNext())
							{
								current = firstEnumerator.current;
								if(!keys.containsKey(current))
								{
									keys.addByKeyValue(current, null);
									return yielder.yieldReturn(current);
								}
							}
							secondEnumerator = enumeratorFrom(second);
						}
						while(secondEnumerator.moveNext())
						{
							current = secondEnumerator.current;
							if(!keys.containsKey(current))
							{
								keys.addByKeyValue(current, null);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},

					() =>
					{
						dispose(firstEnumerator, secondEnumerator);
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}

	insertAt(index:number, other:IEnumerableOrArray<T>):Enumerable<T>
	{
		Integer.assertZeroOrGreater(index, 'index');
		var n:number = index;

		var _ = this, isEndless = _._isEndless || null;
		_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{

				var firstEnumerator:IEnumerator<T>;
				var secondEnumerator:IEnumerator<T>;

				var count:number = 0;
				var isEnumerated:boolean = false;

				return new EnumeratorBase<T>(
					() =>
					{
						count = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumeratorFrom<T>(other);
						isEnumerated = false;
					},

					(yielder) =>
					{
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

					() =>
					{
						dispose(firstEnumerator, secondEnumerator);
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}


	alternateMultiple(sequence:IEnumerableOrArray<T>):Enumerable<T>
	{
		var _ = this;

		return new Enumerable<T>(
			() =>
			{
				var buffer:T,
				    mode:EnumerableAction,
				    enumerator:IEnumerator<T>,
				    alternateEnumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						// Instead of recalling getEnumerator every time, just reset the existing one.
						alternateEnumerator = new ArrayEnumerator(
							Enumerable.toArray<T>(sequence)
						); // Freeze

						enumerator = _.getEnumerator();

						var hasAtLeastOne = enumerator.moveNext();
						mode = hasAtLeastOne
							? EnumerableAction.Return
							: EnumerableAction.Break;

						if(hasAtLeastOne)
							buffer = enumerator.current;
					},

					(yielder)=>
					{
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

						var latest = buffer;

						// Set up the next round...

						// Is there another one?  Set the buffer and setup instruct for the next one to be the alternate.
						var another = enumerator.moveNext();
						mode = another
							? EnumerableAction.Skip
							: EnumerableAction.Break;

						if(another)
							buffer = enumerator.current;

						return yielder.yieldReturn(latest);

					},

					() =>
					{
						dispose(enumerator, alternateEnumerator);
					},

					_._isEndless
				);
			},
			null,

			_._isEndless
		);
	}

	alternateSingle(value:T):Enumerable<T>
	{
		return this.alternateMultiple(Enumerable.make(value));
	}

	alternate(...sequence:T[]):Enumerable<T>
	{
		return this.alternateMultiple(sequence);
	}


	// #region Error Handling
	catchError(handler:(e:any) => void):InfiniteEnumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();
		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
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

					(yielder)=>
					{
						try
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

					() =>
					{
						dispose(enumerator);
					}
				);
			}
		);
	}

	finallyAction(action:() => void):InfiniteEnumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: false;
					},

					() =>
					{
						try
						{
							dispose(enumerator);
						}
						finally
						{
							action();
						}
					}
				);
			}
		);
	}


	buffer(size:number):InfiniteEnumerable<T[]>
	{
		if(size<1 || !isFinite(size))
			throw new Error("Invalid buffer size.");

		Integer.assert(size, "size");

		var _ = this, len:number;

		return new Enumerable<T[]>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				return new EnumeratorBase<T[]>(
					() =>
					{
						enumerator = _.getEnumerator();
					},

					(yielder)=>
					{
						var array:T[] = ArrayUtility.initialize<T>(size);
						len = 0;
						while(len<size && enumerator.moveNext())
						{
							array[len++] = enumerator.current;
						}

						array.length = len;
						return len && yielder.yieldReturn(array);
					},

					() =>
					{
						dispose(enumerator);
					},

					_._isEndless
				);
			},
			null,

			_._isEndless
		);
	}


	share():InfiniteEnumerable<T>
	{
		var _ = this;
		_.throwIfDisposed();

		var sharedEnumerator:IEnumerator<T>;
		return new Enumerable<T>(
			() =>
			{
				return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
			},

			() =>
			{
				dispose(sharedEnumerator);
			},

			_._isEndless
		);
	}


}


/**
 * Enumerable<T> is a wrapper class that allows more primitive enumerables to exhibit LINQ behavior.
 *
 * In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
 * In this case, we use Enumerable<T> as the underlying class that is being chained.
 */
export class Enumerable<T>
extends InfiniteEnumerable<T> implements ILinqEnumerable<T>
{

	constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:() => void,
		isEndless:boolean = null)
	{
		super(enumeratorFactory, finalizer);
		this._isEndless = isEndless;
	}

	/**
	 * Universal method for converting a primitive enumerables into a LINQ enabled ones.
	 *
	 * Is not limited to TypeScript usages.
	 */
	static from<T>(source:IEnumerableOrArray<T>):Enumerable<T>
	{
		var e = Enumerable.fromAny(source);
		if(!e) throw new UnsupportedEnumerableException();
		return e;
	}

	static fromAny(
		source:any):Enumerable<any>

	static fromAny<T>(
		source:IEnumerableOrArray<T>,
		defaultEnumerable?:Enumerable<T>):Enumerable<T>

	static fromAny<T>(
		source:any,
		defaultEnumerable?:Enumerable<T>):Enumerable<T>

	static fromAny<T>(
		source:any,
		defaultEnumerable:Enumerable<T> = null):Enumerable<T>
	{
		if(Type.isObject(source) || Type.isString(source))
		{
			if(source instanceof Enumerable)
				return source;

			if(Type.isArrayLike<T>(source))
				return new ArrayEnumerable<T>(source);

			if(isEnumerable<T>(source))
				return new Enumerable<T>(
					()=>source.getEnumerator(),
					null, source.isEndless);
		}

		return defaultEnumerable;
	}

	static fromOrEmpty<T>(source:IEnumerableOrArray<T>):Enumerable<T>
	{
		return Enumerable.fromAny(source) || Enumerable.empty<T>();
	}

	/**
	 * Static helper for converting enumerables to an array.
	 * @param source
	 * @returns {any}
	 */
	static toArray<T>(source:IEnumerableOrArray<T>):T[]
	{
		if(source instanceof Enumerable)
			return source.toArray();

		return toArray(source);
	}


	//////////////////////////////////////////
	// #region Static Methods...
	static choice<T>(values:IArray<T>):InfiniteEnumerable<T>
	{
		var len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		return new InfiniteEnumerable<T>(
			() => new EnumeratorBase<T>(
				null,
				(yielder)=>
					yielder.yieldReturn(Integer.random.select(values)),
				true // Is endless!
			)
		);
	}

	static chooseFrom<T>(...args:T[]):InfiniteEnumerable<T>
	{
		return Enumerable.choice(args);
	}

	static cycle<T>(values:IArray<T>):InfiniteEnumerable<T>
	{
		var len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		return new InfiniteEnumerable<T>(
			() =>
			{
				var index:number = 0;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
					}, // Reinitialize the value just in case the enumerator is restarted.
					(yielder)=>
					{
						if(index>=values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					},
					true // Is endless!
				);
			}
		);
	}

	static cycleThrough<T>(...args:T[]):InfiniteEnumerable<T>
	{
		return Enumerable.cycle(args);
	}

	static empty<T>():FiniteEnumerable<T>
	{
		// Could be single static instance, but for safety, we'll make a new one.
		return new FiniteEnumerable<T>(getEmptyEnumerator);
	}

	static repeat<T>(element:T):InfiniteEnumerable<T>;
	static repeat<T>(element:T, count:number):FiniteEnumerable<T>;
	static repeat<T>(element:T, count:number = Infinity):Enumerable<T>
	{
		if(!(count>0))
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			? new FiniteEnumerable<T>(
			() =>
			{
				var c:number = count;
				var index:number = 0;

				return new EnumeratorBase<T>(
					() => { index = 0; },
					(yielder)=> (index++<c) && yielder.yieldReturn(element),
					null,
					false
				);
			}
		)
			: new Enumerable<T>(
			() =>
				new EnumeratorBase<T>(
					null,
					(yielder)=> yielder.yieldReturn(element),
					true // Is endless!
				)
		);
	}

	// Note: this enumeration is endless but can be disposed/cancelled and finalized.
	static repeatWithFinalize<T>(
		initializer:() => T,
		finalizer:(element:T) => void):InfiniteEnumerable<T>
	{

		return new InfiniteEnumerable<T>(
			() =>
			{
				var element:T;
				return new EnumeratorBase<T>(
					() =>
					{
						element = initializer();
					},

					(yielder)=> yielder.yieldReturn(element),

					() =>
					{
						finalizer(element);
					},

					true // Is endless!

				);
			}
		);
	}

	/**
	 * Creates an enumerable of one element.
	 * @param element
	 * @returns {FiniteEnumerable<T>}
	 */
	static make<T>(element:T):FiniteEnumerable<T>
	{
		return Enumerable.repeat<T>(element, 1);
	}

	// start and step can be other than integer.

	static range(
		start:number,
		count:number,
		step:number = 1):FiniteEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!(count>0))
			return Enumerable.empty<number>();

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		Integer.assert(count, "count");

		return new FiniteEnumerable<number>(
			() =>
			{
				var value:number;
				var c:number = count; // Force integer evaluation.
				var index:number = 0;

				return new EnumeratorBase<number>(
					() =>
					{
						index = 0;
						value = start;
					},

					(yielder)=>
					{
						var result:boolean =
							    index++<c
							    && yielder.yieldReturn(value);

						if(result && index<count)
							value += step;

						return result;
					},

					false
				);
			});
	}

	static rangeDown(
		start:number,
		count:number,
		step:number = 1):FiniteEnumerable<number>
	{
		step = Math.abs(step)* -1;

		return Enumerable.range(start, count, step);
	}

	// step = -1 behaves the same as toNegativeInfinity;
	static toInfinity(
		start:number = 0,
		step:number = 1):InfiniteEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		return new InfiniteEnumerable<number>(
			() =>
			{
				var value:number;

				return new EnumeratorBase<number>(
					() =>
					{
						value = start;
					},

					(yielder)=>
					{
						var current:number = value;
						value += step;
						return yielder.yieldReturn(current);
					},

					true // Is endless!
				);
			}
		);
	}

	static toNegativeInfinity(
		start:number = 0,
		step:number = 1):InfiniteEnumerable<number>
	{
		return Enumerable.toInfinity(start, -step);
	}

	static rangeTo(
		start:number,
		to:number,
		step:number = 1):FiniteEnumerable<number>
	{
		if(isNaN(to) || !isFinite(to))
			throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");

		if(step && !isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");

		// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
		step = Math.abs(step);

		return new FiniteEnumerable<number>(
			() =>
			{
				var value:number;

				return new EnumeratorBase<number>(() => { value = start; },
					start<to
						?
						yielder=>
						{
							var result:boolean = value<=to && yielder.yieldReturn(value);

							if(result)
								value += step;

							return result;
						}
						:
						yielder=>
						{
							var result:boolean = value>=to && yielder.yieldReturn(value);

							if(result)
								value -= step;

							return result;
						}
					, false);
			}
		);
	}

	static matches(input:string, pattern:any, flags:string = ""):FiniteEnumerable<RegExpExecArray>
	{
		if(input===null || input===VOID0)
			throw new ArgumentNullException("input");
		var type = typeof input;
		if(type!=Type.STRING)
			throw new Error("Cannot exec RegExp matches of type '" + type + "'.");

		if(pattern instanceof RegExp)
		{
			flags += (pattern.ignoreCase) ? "i" : "";
			flags += (pattern.multiline) ? "m" : "";
			pattern = pattern.source;
		}

		if(flags.indexOf("g")=== -1) flags += "g";

		return new FiniteEnumerable<RegExpExecArray>(
			() =>
			{
				var regex:RegExp;
				return new EnumeratorBase<RegExpExecArray>(
					() =>
					{
						regex = new RegExp(pattern, flags);
					},

					(yielder)=>
					{
						// Calling regex.exec consecutively on the same input uses the lastIndex to start the next match.
						var match = regex.exec(input);
						return (match!==null) ? yielder.yieldReturn(match) : false;
					}
				);
			}
		);
	}

	static generate<T>(factory:(index?:number) => T):InfiniteEnumerable<T>;
	static generate<T>(factory:(index?:number) => T, count:number):FiniteEnumerable<T>;
	static generate<T>(factory:(index?:number) => T, count:number = Infinity):InfiniteEnumerable<T>
	{

		if(isNaN(count) || count<=0)
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			?
			new FiniteEnumerable<T>(
				() =>
				{
					var c:number = count;
					var index:number = 0;

					return new EnumeratorBase<T>(
						() =>
						{
							index = 0;
						},

						(yielder)=>
						{
							var current:number = index++;
							return current<c && yielder.yieldReturn(factory(current));
						},

						false
					);
				})
			:
			new InfiniteEnumerable<T>(
				() =>
				{
					var index:number = 0;
					return new EnumeratorBase<T>(
						() =>
						{
							index = 0;
						},

						(yielder)=> yielder.yieldReturn(factory(index++)),

						true // Is endless!
					);
				});
	}

	static unfold<T>(
		seed:T,
		valueFactory:Selector<T, T>,
		skipSeed:Boolean = false):InfiniteEnumerable<T>
	{
		return new InfiniteEnumerable<T>(
			() =>
			{
				var index:number = 0;
				var value:T;
				var isFirst:boolean;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
						value = seed;
						isFirst = !skipSeed;
					},

					(yielder)=>
					{
						var i = index++;
						if(isFirst)
							isFirst = false;
						else
							value = valueFactory(value, i);
						return yielder.yieldReturn(value);
					},

					true // Is endless!
				);
			}
		);
	}

	static forEach<T>(
		enumerable:IEnumerableOrArray<T>,
		action:(element:T, index?:number) => any,
		max:number = Infinity):number
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return forEach(enumerable, action, max);
	}

	static map<T,TResult>(
		enumerable:IEnumerableOrArray<T>,
		selector:Selector<T,TResult>):TResult[]
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return map(enumerable, selector);

	}

	// Slightly optimized versions for numbers.
	static max(values:FiniteEnumerable<number>):number
	{
		return values
			.takeUntil(v=> v== +Infinity, true)
			.aggregate(Functions.Greater);
	}

	static min(values:FiniteEnumerable<number>):number
	{
		return values
			.takeUntil(v=> v== -Infinity, true)
			.aggregate(Functions.Lesser);
	}


	/**
	 * Takes any set of collections of the same type and weaves them together.
	 * @param enumerables
	 * @returns {Enumerable<T>}
	 */
	static weave<T>(
		enumerables:IEnumerableOrArray<IEnumerableOrArray<T>>):Enumerable<T>
	{
		if(!enumerables)
			throw new ArgumentNullException('enumerables');

		return new Enumerable<T>(
			() =>
			{
				var queue:Queue<IEnumerator<T>>;
				var mainEnumerator:IEnumerator<IEnumerableOrArray<T>>;
				var index:number;

				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
						queue = new Queue<IEnumerator<T>>();
						mainEnumerator = enumeratorFrom(enumerables);
					},

					(yielder)=>
					{
						let e:IEnumerator<T>;

						// First pass...
						if(mainEnumerator)
						{
							while(!e && mainEnumerator.moveNext())
							{
								let c = mainEnumerator.current;
								e = nextEnumerator(queue, c && enumeratorFrom(c));
							}

							if(!e)
								mainEnumerator = null;
						}

						while(!e && queue.count)
						{
							e = nextEnumerator(queue, queue.dequeue());
						}

						return e
							? yielder.yieldReturn(e.current)
							: yielder.yieldBreak();

					},

					() =>
					{
						dispose.these(queue.dump());
						dispose(mainEnumerator, queue);
						mainEnumerator = null;
						queue = null;
					}
				);
			}
		);
	}

	// #endregion

	doAction(
		action:Action<T>|Predicate<T>|Selector<T, number>|Selector<T, EnumerableAction>,
		initializer?:()=>void,
		isEndless:boolean = this.isEndless):Enumerable<T>
	{
		return <Enumerable<T>>super.doAction(action, initializer, isEndless);
	}

// #region Indexing/Paging methods.

	skip(count:number):Enumerable<T>
	{
		return <Enumerable<T>>super.skip(count);
	}

	skipWhile(predicate:Predicate<T>):Enumerable<T>
	{
		this.throwIfDisposed();
		return this.doAction(
			(element:T, index?:number) =>
				predicate(element, index)
					? EnumerableAction.Skip
					: EnumerableAction.Return
		);
	}

	takeWhile(predicate:Predicate<T>):Enumerable<T>
	{
		this.throwIfDisposed();

		if(!predicate)
			throw new ArgumentNullException('predicate');

		return this.doAction(
			(element:T, index?:number) =>
				predicate(element, index)
					? EnumerableAction.Return
					: EnumerableAction.Break,
			null,
			null // We don't know the state if it is endless or not.
		);
	}

	// Is like the inverse of take While with the ability to return the value identified by the predicate.
	takeUntil(predicate:Predicate<T>, includeUntilValue?:boolean):Enumerable<T>
	{
		this.throwIfDisposed();

		if(!predicate)
			throw new ArgumentNullException('predicate');

		if(!includeUntilValue)
			return this.doAction(
				(element:T, index?:number) =>
					predicate(element, index)
						? EnumerableAction.Break
						: EnumerableAction.Return,
				null,
				null // We don't know the state if it is endless or not.
			);

		var found:boolean = false;
		return this.doAction(
			(element:T, index?:number) =>
			{
				if(found)
					return EnumerableAction.Break;

				found = predicate(element, index);
				return EnumerableAction.Return;
			},
			()=>
			{
				found = false;
			},
			null // We don't know the state if it is endless or not.
		);
	}


	forEach(action:Predicate<T> | Action<T>):void
	{

		var _ = this;
		_.throwIfDisposed();
		throwIfEndless(_.isEndless);

		var index:number = 0;
		// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
		using(
			_.getEnumerator(), e=>
			{
				throwIfEndless(e.isEndless);

				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while(_.throwIfDisposed() && e.moveNext())
				{
					if(action(e.current, index++)===false)
						break;
				}
			}
		);
	}

	// #region Conversion Methods
	toArray(predicate?:Predicate<T>):T[]
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

		// If not exposing an action that could cause dispose, then use forEach utility instead.
		forEach<T>(this, (x, i)=>
		{
			target[i + index] = x
		}, count);

		return target;
	}

	toLookup<TKey, TValue, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TValue> = Functions.Identity,
		compareSelector:Selector<TKey, TCompare> = Functions.Identity):ILookup<TKey, TValue>
	{
		var dict:Dictionary<TKey, TValue[]> = new Dictionary<TKey, TValue[]>(compareSelector);
		this.forEach(
			x=>
			{
				var key = keySelector(x);
				var element = elementSelector(x);

				var array = dict.getValue(key);
				if(array!==VOID0) array.push(element);
				else dict.addByKeyValue(key, [element]);
			}
		);
		return new Lookup<TKey, TValue>(dict);
	}

	toMap<TResult>(
		keySelector:Selector<T, string>,
		elementSelector:Selector<T, TResult>):IMap<TResult>
	{
		var obj:IMap<TResult> = {};
		this.forEach((x, i)=>
		{
			obj[keySelector(x, i)] = elementSelector(x, i);
		});
		return obj;
	}

	toDictionary<TKey, TValue, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TValue>,
		compareSelector:Selector<TKey, TCompare> = Functions.Identity):IDictionary<TKey, TValue>
	{
		var dict:Dictionary<TKey, TValue> = new Dictionary<TKey, TValue>(compareSelector);
		this.forEach((x, i)=> dict.addByKeyValue(keySelector(x, i), elementSelector(x, i)));
		return dict;
	}

	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		return this.select(selector).toArray().join(separator);
	}

	// #endregion


	takeExceptLast(count:number = 1):Enumerable<T>
	{
		var _ = this;

		if(!(count>0)) // Out of bounds?
			return _;

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return Enumerable.empty<T>();

		Integer.assert(count, "count");
		var c = count;

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var q:Queue<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						q = new Queue<T>();
					},

					(yielder)=>
					{
						while(enumerator.moveNext())
						{
							// Add the next one to the queue.
							q.enqueue(enumerator.current);

							// Did we reach our quota?
							if(q.count>c)
							// Okay then, start returning results.
								return yielder.yieldReturn(q.dequeue());
						}
						return false;
					},

					() =>
					{
						dispose(enumerator, q);
					}
				);
			}
		);
	}

	skipToLast(count:number):Enumerable<T>
	{
		if(!(count>0)) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		var _ = this;

		if(!isFinite(count)) // Infinity means return all.
			return _;

		Integer.assert(count, "count");

		// This sets up the query so nothing is done until move next is called.
		return _.reverse()
			.take(count)
			.reverse();
	}

	// To help with type guarding.

	where(predicate:Predicate<T>):Enumerable<T>
	{
		return <Enumerable<T>>super.where(predicate);
	}

	select<TResult>(selector:Selector<T, TResult>):Enumerable<TResult>
	{
		return <Enumerable<TResult>>super.select(selector);
	}

	selectMany<TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TResult>>):Enumerable<TResult>;


	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<TElement>>,
		resultSelector:(collection:T, element:TElement)=>TResult):Enumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:Selector<T, IEnumerableOrArray<any>>,
		resultSelector?:(collection:T, element:any)=>TResult):Enumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	choose():Enumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):Enumerable<TResult>
	choose(selector:Selector<T, any> = Functions.Identity):Enumerable<any>
	{
		return this._choose(selector);
	}

	reverse():Enumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();
		throwIfEndless(_._isEndless); // Cannot reverse an endless collection...

		return new Enumerable<T>(
			() =>
			{
				var buffer:T[];
				var index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						buffer = _.toArray();
						index = buffer.length;
					},

					(yielder)=> index && yielder.yieldReturn(buffer[--index]),

					() =>
					{
						buffer.length = 0;
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}

	shuffle():Enumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();
		throwIfEndless(_._isEndless); // Cannot shuffle an endless collection...

		return new Enumerable<T>(
			() =>
			{
				var buffer:T[];
				var capacity:number;
				var len:number;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						buffer = _.toArray();
						capacity = len = buffer.length;
					},

					(yielder)=>
					{
						// Avoid using major array operations like .slice();
						if(!len)
							return yielder.yieldBreak();

						var selectedIndex = Integer.random(len);
						var selectedValue = buffer[selectedIndex];

						buffer[selectedIndex] = buffer[--len]; // Take the last one and put it here.
						buffer[len] = null; // clear possible reference.

						if(len%32==0) // Shrink?
							buffer.length = len;

						return yielder.yieldReturn(selectedValue);
					},

					() =>
					{
						buffer.length = 0;
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}

	count(predicate?:Predicate<T>):number
	{
		var count:number = 0;
		this.forEach(
			predicate

				?
				(x, i) =>
				{
					if(predicate(x, i))++count;
				}

				:
				() =>
				{
					++count;
				}
		);

		return count;
	}

	// Akin to '.every' on an array.
	all(predicate:Predicate<T>):boolean
	{
		if(!predicate)
			throw new ArgumentNullException("predicate");

		var result = true;
		this.forEach((x, i) =>
		{
			if(!predicate(x, i))
			{
				result = false;
				return false; // break
			}
		});
		return result;
	}

	// 'every' has been added here for parity/compatibility with an array.
	every(predicate:Predicate<T>):boolean
	{
		return this.all(predicate);
	}

	// Akin to '.some' on an array.
	any(predicate?:Predicate<T>):boolean
	{
		if(!predicate)
			return super.any();

		var result = false;
		// Splitting the forEach up this way reduces iterative processing.
		// forEach handles the generation and disposal of the enumerator.
		this.forEach(
			(x, i) =>
			{
				result = predicate(x, i); // false = not found and therefore it should continue.  true = found and break;
				return !result;
			});
		return result;

	}

	// 'some' has been added here for parity/compatibility with an array.
	some(predicate:Predicate<T>):boolean
	{
		return this.any(predicate);
	}


	contains<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):boolean
	{
		return compareSelector
			? this.any(v=> compareSelector(v)===compareSelector(value))
			: this.any(v=> v===value);
	}

	// Originally has an overload for a predicate,
	// but that's a bad idea since this could be an enumeration of functions and therefore fail the intent.
	// Better to chain a where statement first to be more explicit.
	indexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number
	{
		var found:number = -1;
		this.forEach(
			compareSelector
				?
				(element:T, i?:number) =>
				{
					if(Values.areEqual(compareSelector(element, i), compareSelector(value, i), true))
					{
						found = i;
						return false;
					}
				}
				:
				(element:T, i?:number) =>
				{
					// Why?  Because NaN doesn't equal NaN. :P
					if(Values.areEqual(element, value, true))
					{
						found = i;
						return false;
					}
				});


		return found;
	}

	lastIndexOf<TCompare>(value:T, compareSelector?:Selector<T, TCompare>):number
	{
		var result:number = -1;
		this.forEach(
			compareSelector
				?
				(element:T, i?:number) =>
				{
					if(Values.areEqual(compareSelector(element, i), compareSelector(value, i), true)) result
						= i;
				}

				:
				(element:T, i?:number) =>
				{
					if(Values.areEqual(element, value, true)) result = i;
				});

		return result;
	}

	merge(enumerables:IArray<IEnumerableOrArray<T>>):Enumerable<T>
	{
		return <Enumerable<T>>super.merge(enumerables);
	}

	concat(...enumerables:Array<IEnumerableOrArray<T>>):Enumerable<T>
	{
		return this.merge(enumerables);
	}


	intersect<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>
	{
		var _ = this;

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var keys:Dictionary<T,boolean>;
				var outs:Dictionary<T,boolean>;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();

						keys = new Dictionary<T, boolean>(compareSelector);
						outs = new Dictionary<T, boolean>(compareSelector);

						forEach(second, key=>
						{
							keys.addByKeyValue(key, true);
						});
					},

					(yielder)=>
					{
						while(enumerator.moveNext())
						{
							var current = enumerator.current;
							if(!outs.containsKey(current) && keys.containsKey(current))
							{
								outs.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return yielder.yieldBreak();
					},

					() =>
					{
						dispose(enumerator, keys, outs);
					},
					_._isEndless
				);
			},
			null,
			_._isEndless
		);
	}

	sequenceEqual(
		second:IEnumerableOrArray<T>,
		equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	{
		return using(
			this.getEnumerator(),
			e1=> using(
				enumeratorFrom(second),
				e2=>
				{
					// if both are endless, this will never evaluate.
					throwIfEndless(e1.isEndless && e2.isEndless);

					while(e1.moveNext())
					{
						if(!e2.moveNext() || !equalityComparer(e1.current, e2.current))
							return false;
					}

					return !e2.moveNext();
				}
			)
		);
	}

	//isEquivalent(second:IEnumerableOrArray<T>,
	//	equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	//{
	//	return this
	//		.orderBy(keySelector)
	//		.sequenceEqual(Enumerable.from(second).orderBy(keySelector))
	//}


	// #endregion


	ofType<TType>(type:{ new (...params:any[]):TType }):Enumerable<TType>;
	ofType<TType>(type:any):Enumerable<TType>
	{
		return <Enumerable<TType>>super.ofType(type);
	}

	except<TCompare>(
		second:IEnumerableOrArray<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>
	{
		return <Enumerable<T>>super.except(second, compareSelector);
	}

	distinct(compareSelector?:(value:T)=>T):Enumerable<T>
	{
		return <Enumerable<T>>super.distinct(compareSelector);
	}

	distinctUntilChanged<TCompare>(compareSelector:Selector<T, TCompare> = Functions.Identity):Enumerable<T>
	{
		return <Enumerable<T>>super.distinctUntilChanged(compareSelector);
	}

// #region Ordering Methods

	orderBy<TKey extends Comparable>(keySelector:Selector<T, TKey> = Functions.Identity):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,TKey>(this, keySelector, Order.Ascending);
	}

	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,any>(this, null, Order.Ascending, null, comparison);
	}

	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,any>(this, null, Order.Descending, null, comparison);
	}

	orderByDescending<TKey extends Comparable>(keySelector:Selector<T, TKey> = Functions.Identity):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,TKey>(this, keySelector, Order.Descending);
	}

	/*
		 weightedSample(weightSelector) {
		 weightSelector = Utils.createLambda(weightSelector);
		 var source = this;

		 return new Enumerable<T>(() => {
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

	buffer(size:number):Enumerable<T[]>
	{
		return <Enumerable<T[]>>super.buffer(size);
	}

	// #region Grouping Methods

	// Originally contained a result selector (not common use), but this could be done simply by a select statement after.


	groupBy<TKey>(keySelector:Selector<T, TKey>):Enumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, T>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, TElement>>
	{
		if(!elementSelector) elementSelector = Functions.Identity; // Allow for 'null' and not just undefined.
		return new Enumerable<IGrouping<TKey, TElement>>(
			() => this.toLookup(keySelector, elementSelector, compareSelector)
				.getEnumerator()
		);
	}

	partitionBy<TKey>(keySelector:Selector<T, TKey>):Enumerable<IGrouping<TKey, T>>;
	partitionBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, TElement>>;
	partitionBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		resultSelector:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>
			= (key:TKey, elements:TElement[]) => new Grouping<TKey, TElement>(key, elements),
		compareSelector:Selector<TKey, TCompare>
			= Functions.Identity):Enumerable<IGrouping<TKey, T>>|Enumerable<IGrouping<TKey, TElement>>
	{

		var _ = this;
		if(!elementSelector) elementSelector = Functions.Identity; // Allow for 'null' and not just undefined.
		return new Enumerable<IGrouping<TKey, TElement>>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var key:TKey;
				var compareKey:TCompare;
				var group:TElement[];
				var len:number;

				return new EnumeratorBase<IGrouping<TKey, TElement>>(
					() =>
					{
						enumerator = _.getEnumerator();
						if(enumerator.moveNext())
						{
							key = keySelector(enumerator.current);
							compareKey = compareSelector(key);
							group = [elementSelector(enumerator.current)];
							len = 1;
						}
						else
							group = null;
					},

					(yielder)=>
					{
						if(!group)
							return yielder.yieldBreak();

						var hasNext:boolean, c:T;
						while((hasNext = enumerator.moveNext()))
						{
							c = enumerator.current;
							if(compareKey===compareSelector(keySelector(c)))
								group[len++] = elementSelector(c);
							else
								break;
						}

						var result:IGrouping<TKey, TElement>
							    = resultSelector(key, group);

						if(hasNext)
						{
							c = enumerator.current;
							key = keySelector(c);
							compareKey = compareSelector(key);
							group = [elementSelector(c)];
							len = 1;
						}
						else
						{
							group = null;
						}

						return yielder.yieldReturn(result);
					},

					() =>
					{
						dispose(enumerator);
						group = null;
					}
				);
			}
		);
	}

	// #endregion

	// #region Aggregate Methods

	aggregate(
		func:(a:T, b:T) => T,
		seed?:T):T
	{
		return this.scan(func, seed).lastOrDefault();
	}

	average(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var count = 0;
		var sum = this.sum((e, i)=>
		{
			count++;
			return selector(e, i);
		});

		return (isNaN(sum) || !count)
			? NaN
			: (sum/count);
	}

	// If using numbers, it may be useful to call .takeUntil(v=>v==Infinity,true) before calling max. See static versions for numbers.
	max():T
	{
		return this.aggregate(Functions.Greater);
	}

	min():T
	{
		return this.aggregate(Functions.Lesser);
	}

	maxBy<TCompare>(keySelector:Selector<T, TCompare> = Functions.Identity):T
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)>keySelector(b)) ? a : b);
	}

	minBy<TCompare>(keySelector:Selector<T, TCompare> = Functions.Identity):T
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)<keySelector(b)) ? a : b);
	}

	// Addition...  Only works with numerical enumerations.
	sum(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var sum = 0;

		// This allows for infinity math that doesn't destroy the other values.
		var sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

		this.forEach(
			x=>
			{
				var value = selector(x);
				if(isNaN(value))
				{
					sum = NaN;
					return false;
				}
				if(isFinite(value))
					sum += value;
				else
					sumInfinite +=
						value>0 ?
							(+1) :
							(-1);
			}
		);

		return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite*Infinity) : sum);
	}

	// Multiplication...
	product(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var result = 1, exists:boolean = false;

		this.forEach(
			(x, i)=>
			{
				exists = true;
				var value = selector(x, i);
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
	quotient(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var count = 0;
		var result:number = NaN;

		this.forEach(
			(x, i)=>
			{
				var value = selector(x, i);
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
		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found:boolean = false;
		_.forEach(
			x =>
			{
				found = true;
				value = x;
			}
		);

		if(!found) throw new Error("last:No element satisfies the condition.");
		return value;
	}

	lastOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found:boolean = false;
		_.forEach(
			x=>
			{
				found = true;
				value = x;
			}
		);
		return (!found) ? defaultValue : value;
	}

	// #endregion

	share():Enumerable<T>
	{
		return <Enumerable<T>>super.share();
	}


	catchError(handler:(e:any)=>void):Enumerable<T>
	{
		return <Enumerable<T>>super.catchError(handler);
	}


	finallyAction(action:()=>void):Enumerable<T>
	{
		return <Enumerable<T>>super.finallyAction(action);
	}

	memoize():Enumerable<T>
	{
		var _ = this, disposed:boolean = !_.throwIfDisposed();

		var cache:T[];
		var enumerator:IEnumerator<T>;

		return new Enumerable<T>(
			() =>
			{

				var index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						if(!enumerator)
							enumerator = _.getEnumerator();
						if(!cache)
							cache = [];
						index = 0;
					},

					(yielder)=>
					{
						throwIfDisposed(disposed);

						var i = index++;

						if(i>=cache.length)
						{
							return (enumerator.moveNext())
								? yielder.yieldReturn(cache[i] = enumerator.current)
								: false;
						}

						return yielder.yieldReturn(cache[i]);
					}
				);
			},

			() =>
			{
				disposed = true;
				if(cache)
					cache.length = 0;
				cache = null;

				dispose(enumerator);
				enumerator = null;
			}
		);
	}


}


// Provided for type guarding.
export class FiniteEnumerable<T>
extends Enumerable<T> implements IFiniteEnumerable<T>
{
	constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:() => void)
	{
		super(enumeratorFactory, finalizer, false);
	}

}

class ArrayEnumerable<T>
extends FiniteEnumerable<T>
{
	private _source:IArray<T>;

	constructor(source:IArray<T>)
	{
		super(() =>
		{
			_.throwIfDisposed();
			return new ArrayEnumerator<T>(() =>
			{
				_.throwIfDisposed("The underlying ArrayEnumerable was disposed.", "ArrayEnumerator");

				return _._source; // Should never be null, but ArrayEnumerable if not disposed simply treats null as empty array.
			});
		});

		var _ = this;
		_._disposableObjectName = "ArrayEnumerable";
		_._source = source;

	}

	protected _onDispose():void
	{
		super._onDispose();
		this._source = <any>null;
	}

	get source():IArray<T>
	{
		return this._source;
	}

	toArray():T[]
	{
		var _ = this;
		_.throwIfDisposed();

		return toArray(_._source);
	}

	asEnumerable():ArrayEnumerable<T>
	{
		return new ArrayEnumerable<T>(this._source);
	}

	// Optimize forEach so that subsequent usage is optimized.
	forEach(action:Predicate<T> | Action<T>, max:number = Infinity):number
	{
		var _ = this;
		_.throwIfDisposed();

		return forEach(_._source, action, max);
	}

	// These methods should ALWAYS check for array length before attempting anything.

	any(predicate?:Predicate<T>):boolean
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source.length;
		return len && (!predicate || super.any(predicate));
	}

	count(predicate?:Predicate<T>):number
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source.length;
		return len && (predicate ? super.count(predicate) : len);
	}

	elementAtOrDefault(index:number, defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();
		Integer.assertZeroOrGreater(index, 'index');

		var source = _._source;
		return index<source.length
			? source[index]
			: defaultValue;
	}

	last():T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source.length;
		return (len)
			? source[len - 1]
			: super.last();
	}

	lastOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source.length;
		return len
			? source[len - 1]
			: defaultValue;
	}

	skip(count:number):Enumerable<T>
	{

		var _ = this;

		if(!(count>0))
			return _;

		return new Enumerable<T>(
			() => new ArrayEnumerator<T>(() => _._source, count)
		);
	}

	takeExceptLast(count:number = 1):Enumerable<T>
	{
		var _ = this;
		return _.take(_._source.length - count);
	}

	skipToLast(count:number):Enumerable<T>
	{
		if(!(count>0))
			return Enumerable.empty<T>();

		var _ = this;
		if(!isFinite(count))
			return _;

		var len = _._source
			? _._source.length
			: 0;

		return _.skip(len - count);
	}

	reverse():Enumerable<T>
	{
		var _ = this;

		return new Enumerable<T>(
			() => new ArrayEnumerator<T>(
				() => _._source, _._source
					? (_._source.length - 1)
					: 0, -1
			)
		);
	}

	memoize():ArrayEnumerable<T>
	{
		return this.asEnumerable();
	}

	sequenceEqual(
		second:IEnumerableOrArray<T>,
		equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	{
		if(Type.isArrayLike(second))
			return Arrays.areEqual(this.source, second, true, equalityComparer);

		if(second instanceof ArrayEnumerable)
			return second.sequenceEqual(this.source, equalityComparer);

		return super.sequenceEqual(second, equalityComparer);
	}


	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		var s = this._source;
		return !selector && Array.isArray(s)
			? (<Array<T>>s).join(separator)
			: super.toJoinedString(separator, selector);
	}

}

class Grouping<TKey, TElement>
extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement>
{

	constructor(private _groupKey:TKey, elements:TElement[])
	{
		super(elements);
	}

	get key():TKey
	{
		return this._groupKey;
	}
}

class Lookup<TKey, TElement>
implements ILookup<TKey, TElement>
{

	constructor(private _dictionary:IDictionary<TKey, TElement[]>)
	{
	}

	get count():number
	{
		return this._dictionary.count;
	}

	get(key:TKey):TElement[]
	{
		return this._dictionary.getValue(key);
	}

	contains(key:TKey):boolean
	{
		return this._dictionary.containsKey(key);
	}

	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
	{

		var _ = this;
		var enumerator:IEnumerator<IKeyValuePair<TKey, TElement[]>>;

		return new EnumeratorBase<Grouping<TKey, TElement>>(
			() =>
			{
				enumerator = _._dictionary.getEnumerator();
			},
			(yielder)=>
			{

				if(!enumerator.moveNext())
					return false;

				var current = enumerator.current;

				return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
			},
			() =>
			{
				dispose(enumerator);
			}
		);
	}

}


class OrderedEnumerable<T,TOrderBy extends Comparable>
extends FiniteEnumerable<T> implements IOrderedEnumerable<T>
{

	constructor(
		private source:IEnumerable<T>,
		public keySelector:(value:T) => TOrderBy,
		public order:Order,
		public parent?:OrderedEnumerable<T,any>,
		public comparer:Comparison<T> = Values.compare)
	{
		super(null);
		throwIfEndless(source && source.isEndless);
	}

	private createOrderedEnumerable(
		keySelector:(value:T) => TOrderBy,
		order:Order):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,TOrderBy>(this.source, keySelector, order, this);
	}

	thenBy(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Ascending);
	}

	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,any>(this.source, null, Order.Ascending, this, comparison);
	}

	thenByDescending(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Descending);
	}

	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T,any>(this.source, null, Order.Descending, this, comparison);
	}

	getEnumerator():EnumeratorBase<T>
	{
		var _ = this;
		var buffer:T[];
		var indexes:number[];
		var index:number = 0;

		return new EnumeratorBase<T>(
			() =>
			{
				index = 0;
				buffer = Enumerable.toArray(_.source);
				indexes = createSortContext(_).generateSortedIndexes(buffer);
			},

			(yielder)=>
			{
				return (index<indexes.length)
					? yielder.yieldReturn(buffer[indexes[index++]])
					: false;
			},

			() =>
			{
				if(buffer)
					buffer.length = 0;
				buffer = null;
				if(indexes)
					indexes.length = 0;
				indexes = null;
			},

			false
		);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this.source = null;
		this.keySelector = null;
		this.order = null;
		this.parent = null;
	}

}

// A private static helper for the weave function.
function nextEnumerator<T>(queue:Queue<IEnumerator<T>>, e:IEnumerator<T>):IEnumerator<T>
{
	if(e)
	{
		if(e.moveNext())
		{
			queue.enqueue(e);
		}
		else
		{
			dispose(e);
			e = null;
		}
	}
	return e;
}

/**
 * Recursively builds a SortContext chain.
 * @param orderedEnumerable
 * @param currentContext
 * @returns {any}
 */
function createSortContext<T, TOrderBy extends Comparable>(
	orderedEnumerable:OrderedEnumerable<T,TOrderBy>,
	currentContext:IComparer<T> = null):KeySortedContext<T, TOrderBy>
{

	var context = new KeySortedContext<T, TOrderBy>(
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
function throwIfDisposed(disposed:boolean):void
{
	if(disposed) throw new ObjectDisposedException("Enumerable");
}
// #endregion

export default Enumerable;
