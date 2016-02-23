/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../System/Primitive.d.ts"/>
///<reference path="../System/FunctionTypes.d.ts"/>
///<reference path="../System/Collections/Array/IArray.d.ts"/>
///<reference path="../System/Collections/Enumeration/IEnumerator.d.ts"/>
///<reference path="../System/Collections/Enumeration/IEnumerable.d.ts"/>
///<reference path="../System/Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../System/IComparer.d.ts"/>
///<reference path="../System/Collections/Sorting/Order.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import * as Values from '../System/Compare';
import * as Arrays from '../System/Collections/Array/Compare';
import * as ArrayUtility from '../System/Collections/Array/Utility';
import {from as enumeratorFrom, forEach as enumeratorForEach, isEnumerable} from '../System/Collections/Enumeration/Enumerator';
import Type from '../System/Types';
import Integer from '../System/Integer';
import BaseFunctions from '../System/Functions';
import ArrayEnumerator from '../System/Collections/Enumeration/ArrayEnumerator';
import EnumeratorBase from '../System/Collections/Enumeration/EnumeratorBase';
import Dictionary from '../System/Collections/Dictionaries/Dictionary';
import Queue from '../System/Collections/Queue';
import {dispose, disposeThese, using} from '../System/Disposable/Utility';
import DisposableBase from '../System/Disposable/DisposableBase';
import Exception from "../System/Exception";
import ArgumentException from '../System/Exceptions/ArgumentException';
import ObjectDisposedException from '../System/Disposable/ObjectDisposedException';
import KeySortedContext from "../System/Collections/Sorting/KeySortedContext";
type Comparable = Primitive|IComparable<any>;

// #region Local Constants.

const VOID0:any = void 0;

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

// #endregion

class UnsupportedEnumerableException extends Exception
{
	constructor()
	{
		super("Unsupported enumerable.");
	}
}


/**
 * Defined values for doAction.
 */
export const enum EnumerableAction
{
	Break  = 0,
	Return = 1,
	Skip   = 2
}

/**
 * Enumerable<T> is a wrapper class that allows more primitive enumerables to exhibit LINQ behavior.
 *
 * In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
 * In this case, we use Enumerable<T> as the underlying class that is being chained.
 */
export class Enumerable<T>
extends DisposableBase implements IEnumerable<T>
{

	constructor(
		protected _enumeratorFactory:() => IEnumerator<T>,
		finalizer?:() => void)
	{
		super(finalizer);
	}

	/**
	 * Static shortcut for creating an ArrayEnumerable.
	 */
	static fromArray<T>(array:IArray<T>):Enumerable<T>
	{
		return new ArrayEnumerable<T>(array);
	}

	/**
	 * Universal method for converting a primitive enumerables into a LINQ enabled ones.
	 *
	 * Is not limited to TypeScript usages.
	 */
	static from<T>(source:IEnumerable<T> | IArray<T>):Enumerable<T>
	{
		if(Type.isObject(source))
		{
			if(source instanceof Enumerable)
				return source;

			if(Array.isArray(source))
				return new ArrayEnumerable<T>(source);

			if(isEnumerable<T>(source))
				return new Enumerable(()=>source.getEnumerator());

			if(Type.isArrayLike<T>(source))
				return new ArrayEnumerable<T>(source);
		}

		throw new UnsupportedEnumerableException();
	}

	static toArray<T>(source:IEnumerable<T> | IArray<T>):T[]
	{
		if(Type.isObject(source))
		{
			if(Array.isArray(source))
				return source.slice();

			if(Type.isArrayLike<T>(source))
				source = new ArrayEnumerable<T>(<IArray<T>>source);

			if(source instanceof  Enumerable)
				return source.toArray();

			if(isEnumerable<T>(source))
			{
				var result:T[] = [];
				enumeratorForEach<T>(
					source.getEnumerator(), (e, i) =>
					{
						result[i] = e;
					}
				);
				return result;
			}
		}

		throw new UnsupportedEnumerableException();
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

	//////////////////////////////////////////
	// #region Static Methods...
	static choice<T>(values:IArray<T>):Enumerable<T>
	{
		return new Enumerable<T>(
			() => new EnumeratorBase<T>(
				null,
				(yielder)=>
					yielder.yieldReturn(values[Integer.random(values.length)])
			)
		);
	}

	static cycle<T>(values:IArray<T>):Enumerable<T>
	{
		return new Enumerable<T>(
			() =>
			{
				var index:number = 0; // Let the compiler know this is an int.
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
					}, // Reinitialize the value just in case the enumerator is restarted.
					(yielder)=>
					{
						if(index>=values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					}
				);
			}
		);
	}

	static empty<T>():Enumerable<T>
	{
		return new Enumerable<T>(
			() => new EnumeratorBase<T>(
				null,
				Functions.False
			)
		);
	}

	static repeat<T>(element:T, count:number = Infinity):Enumerable<T>
	{
		if(isNaN(count) || count<=0)
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			? new Enumerable<T>(
			() =>
			{
				var c:number = count;
				var index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
					},

					(yielder)=> (index++<c) && yielder.yieldReturn(element)
				);
			}
		)
			: new Enumerable<T>(
			() =>
				new EnumeratorBase<T>(
					null,
					(yielder)=> yielder.yieldReturn(element)
				)
		);
	}

	// Note: this enumeration does not break.
	static repeatWithFinalize<T>(
		initializer:() => T,
		finalizer:(element:T) => void):Enumerable<T>
	{

		return new Enumerable<T>(
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
					}
				);
			}
		);
	}

	static make<T>(element:T):Enumerable<T>
	{
		return Enumerable.repeat<T>(element, 1);
	}

	// start and step can be other than integer.
	static range(
		start:number = 0,
		count:number = Infinity,
		step:number = 1):Enumerable<number>
	{

		if(!isFinite(start))
			throw new Error("Must have a valid 'start' value.");

		if(isNaN(count) || count<=0)
			return Enumerable.empty<number>();

		if(!isFinite(step))
			throw new Error("Must have a valid 'step' value.");

		return isFinite(count) && Integer.assert(count, "count")
			? new Enumerable<number>(
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
					}
				);
			})

			: new Enumerable<number>(
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
					}
				);
			}
		);
	}

	static rangeDown(
		start:number = 0,
		count:number = Infinity,
		step:number = 1):Enumerable<number>
	{
		step = Math.abs(step)* -1;

		return Enumerable.range(start, count, step);
	}

	// step = -1 behaves the same as toNegativeInfinity;
	static toInfinity(
		start:number = 0,
		step:number = 1):Enumerable<number>
	{
		return Enumerable.range(start, Infinity, step);
	}

	static toNegativeInfinity(
		start:number = 0,
		step:number = 1):Enumerable<number>
	{
		return Enumerable.rangeDown(start, Infinity, step);
	}

	static rangeTo(
		start:number = 0,
		to:number = Infinity,
		step:number = 1):Enumerable<number>
	{
		if(!isFinite(start))
			throw new Error("Must have a valid 'start' value.");

		if(isNaN(to))
			throw new Error("Must have a valid 'to' value.");

		if(!isFinite(step))
			throw new Error("Must have a valid 'step' value.");

		// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
		step = Math.abs(step);

		// Range to infinity has a more efficient mechanism.
		if(!isFinite(to))
			return Enumerable.range(start, Infinity, (start<to) ? (+step) : (-step));

		return new Enumerable<number>(
			() =>
			{
				var value:number;

				return start<to

					? new EnumeratorBase<number>(
					() =>
					{
						value = start;
					},

					(yielder)=>
					{
						var result:boolean = value<=to && yielder.yieldReturn(value);

						if(result)
							value += step;

						return result;
					})

					: new EnumeratorBase<number>(
					() =>
					{
						value = start;
					},

					(yielder)=>
					{
						var result:boolean = value>=to && yielder.yieldReturn(value);

						if(result)
							value -= step;

						return result;
					}
				);
			}
		);
	}

	static matches(input:string, pattern:any, flags:string = ""):Enumerable<RegExpExecArray>
	{

		var type = typeof input;
		if(type!=Type.STRING)
			throw new Error("Cannot exec RegExp matches of type '" + type + "'.");

		if(pattern instanceof  RegExp)
		{
			flags += (pattern.ignoreCase) ? "i" : "";
			flags += (pattern.multiline) ? "m" : "";
			pattern = pattern.source;
		}

		if(flags.indexOf("g")=== -1) flags += "g";

		return new Enumerable<RegExpExecArray>(
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

	static generate<T>(factory:(index?:number) => T, count:number = Infinity):Enumerable<T>
	{

		if(isNaN(count) || count<=0)
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")

			? new Enumerable<T>(
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
					}
				);
			})

			: new Enumerable<T>(
			() =>
			{
				var index:number = 0;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
					},

					(yielder)=> yielder.yieldReturn(factory(index++))
				);
			});
	}

	static unfold<T>(seed:T, valueFactory:Selector<T, T>, skipSeed:Boolean = false):Enumerable<T>
	{
		return new Enumerable<T>(
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
					}
				);
			}
		);
	}

	static defer<T>(enumerableFactory:() => IEnumerable<T>):Enumerable<T>
	{

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = enumerableFactory().getEnumerator();
					},

					(yielder)=> enumerator.moveNext() && yielder.yieldReturn(enumerator.current),
					() =>
					{
						dispose(enumerator);
					}
				);
			}
		);
	}

	static forEach<T>(
		enumerable:IEnumerable<T> | IArray<T>,
		action:(element:T, index?:number) => any):void
	{
		if(enumerable)
		{
			using(enumeratorFrom(enumerable), e=>
			{
				enumeratorForEach(e, action);
			});
		}
	}

	static map<T,TResult>(
		enumerable:IEnumerable<T> | IArray<T>,
		selector:Selector<T,TResult>):TResult[]
	{

		return enumerable && using(enumeratorFrom(enumerable), e=>
			{
				var result:TResult[] = [];
				enumeratorForEach(e, (e, i)=>
				{
					result[i] = selector(e);
				});
				return result;
			});

	}

	// Slightly optimized versions for numbers.
	static max(values:Enumerable<number>):number
	{
		return values
			.takeUntil(v=> v== +Infinity, true)
			.aggregate(Functions.Greater);
	}

	static min(values:Enumerable<number>):number
	{
		return values
			.takeUntil(v=> v== -Infinity, true)
			.aggregate(Functions.Lesser);
	}

	// #endregion

	//////////////////////////////////////////
	// #region Instance methods...

	forEach(action:Predicate<T> | Action<T>):void
	{

		var _ = this;
		_.throwIfDisposed();

		var index:number = 0;
		// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
		using(
			_.getEnumerator(), e=>
			{
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while(_.throwIfDisposed() && e.moveNext())
				{
					if(<any>action(e.current, index++)===false)
						break;
				}
			}
		);
	}

	// #region Conversion Methods
	toArray(predicate?:Predicate<T>):T[]
	{
		var result:T[] = [];

		if(predicate) return this.where(predicate).toArray();

		this.forEach((x, i)=>
		{
			result[i] = x
		});

		return result;
	}

	// Return a default (unfiltered) enumerable.
	asEnumerable():Enumerable<T>
	{
		var _ = this;
		return new Enumerable<T>(() => _.getEnumerator());
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
		this.forEach(x=>
		{
			obj[keySelector(x)] = elementSelector(x);
		});
		return obj;
	}

	toDictionary<TKey, TValue, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TValue>,
		compareSelector:Selector<TKey, TCompare> = Functions.Identity):Dictionary<TKey, TValue>
	{
		var dict:Dictionary<TKey, TValue> = new Dictionary<TKey, TValue>(compareSelector);
		this.forEach(x=> dict.addByKeyValue(keySelector(x), elementSelector(x)));
		return dict;
	}

	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		return this.select(selector).toArray().join(separator);
	}

	// #endregion


	/**
	 * Similar to forEach, but executes an action for each time a value is enumerated.
	 * If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
	 * If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
	 * This also automatically handles disposing the enumerator.
	 */
	doAction(
		action:Action<T> | Predicate<T> | Selector<T, number> | Selector<T, EnumerableAction>):Enumerable<T>
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
					}
				);

			},
			// Using a finalizer value reduces the chance of a circular reference
			// since we could simply reference the enumeration and check e.wasDisposed.
			() =>
			{
				disposed = true;
			}
		);
	}

	force(defaultAction:EnumerableAction = EnumerableAction.Break):void
	{

		this.throwIfDisposed();

		this.doAction(element => defaultAction);
	}

	// #region Indexing/Paging methods.
	skip(count:number):Enumerable<T>
	{
		var _ = this;

		_.throwIfDisposed();

		if(!count || isNaN(count) || count<0) // Out of bounds? Simply return this.
			return _;

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return Enumerable.empty<T>();

		Integer.assert(count, "count");

		var c:number = count;

		return this.doAction(
			(element:T, index?:number) =>
				index<c
					? EnumerableAction.Skip
					: EnumerableAction.Return
		);
	}

	skipWhile(predicate:Predicate<T>):Enumerable<T>
	{

		this.throwIfDisposed();

		var skipping:boolean = true;

		return this.doAction(
			(element:T, index?:number) =>
			{
				if(skipping)
					skipping = predicate(element, index);

				return skipping
					? EnumerableAction.Skip
					: EnumerableAction.Return;
			}
		);
	}

	take(count:number):Enumerable<T>
	{
		if(!count || isNaN(count) || count<0) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		var _ = this;
		_.throwIfDisposed();

		if(!isFinite(count)) // +Infinity equals no limit.
			return _;

		Integer.assert(count, "count");
		var c = count;

		// Once action returns false, the enumeration will stop.
		return _.doAction((element:T, index?:number) => index<c);
	}

	takeWhile(predicate:Predicate<T>):Enumerable<T>
	{

		this.throwIfDisposed();

		return this.doAction(
			(element:T, index?:number) =>
				predicate(element, index)
					? EnumerableAction.Return
					: EnumerableAction.Break
		);
	}

	// Is like the inverse of take While with the ability to return the value identified by the predicate.
	takeUntil(predicate:Predicate<T>, includeUntilValue?:boolean):Enumerable<T>
	{

		this.throwIfDisposed();

		if(!includeUntilValue)
			return this.doAction(
				(element:T, index?:number) =>
					predicate(element, index)
						? EnumerableAction.Break
						: EnumerableAction.Return
			);

		var found:boolean = false;
		return this.doAction(
			(element:T, index?:number) =>
			{
				if(found)
					return EnumerableAction.Break;

				found = predicate(element, index);

				return EnumerableAction.Return;
			}
		);
	}

	takeExceptLast(count:number = 1):Enumerable<T>
	{
		var _ = this;

		if(!count || isNaN(count) || count<=0) // Out of bounds? Empty.
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

	takeFromLast(count:number):Enumerable<T>
	{
		if(!count || isNaN(count) || count<=0) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		var _ = this;

		if(!isFinite(count)) // Infinity means return all in reverse.
			return _.reverse();

		Integer.assert(count, "count");

		return _.reverse().take(count);
	}

	// #endregion

	// #region Projection and Filtering Methods

	traverseBreadthFirst(
		func:(element:any) => IEnumerable<any>,
		resultSelector?:(element:any, nestLevel?:number) => any):Enumerable<any>
	{
		var _ = this;

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
								.fromArray<T>(buffer)
								.selectMany(func);

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
					}
				);
			}
		);
	}


	traverseDepthFirst(
		func:(element:any) => IEnumerable<any>,
		resultSelector?:(element:any, nestLevel?:number) => any):Enumerable<any>
	{
		var _ = this;

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
								var value = resultSelector(enumerator.current, len);
								enumeratorStack[len++] = enumerator;
								enumerator = func(enumerator.current).getEnumerator();
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
							disposeThese(enumeratorStack);
						}
					}
				);
			}
		);
	}


	flatten():Enumerable<any>
	{
		var _ = this;

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
							if(middleEnumerator!=null)
							{
								if(middleEnumerator.moveNext())
								{
									return yielder.yieldReturn(middleEnumerator.current);
								}
								else
								{
									middleEnumerator = null;
								}
							}

							if(enumerator.moveNext())
							{
								var c = enumerator.current;
								if(Array.isArray(c))
								{
									middleEnumerator.dispose();
									middleEnumerator = Enumerable.fromArray<any>(c)
										.selectMany(Functions.Identity)
										.flatten()
										.getEnumerator();
									continue;
								}
								else
								{
									return yielder.yieldReturn(enumerator.current);
								}
							}

							return false;
						}
					},

					() =>
					{
						dispose(enumerator, middleEnumerator);
					}
				);
			}
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
					}
				);
			}
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
					}
				);
			}
		);
	}

	// #endregion


	select<TResult>(selector:Selector<T, TResult>):Enumerable<TResult>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		if(selector.length<2)
			return new WhereSelectEnumerable(_, null, selector);

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
							: false;
					},

					() =>
					{
						dispose(enumerator);
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}


	selectMany<TResult>(collectionSelector:Selector<T, IEnumerable<TResult | IArray<TResult>>>):Enumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:Selector<T, IEnumerable<TElement> | IArray<TResult>> | Selector<T, IArray<TElement>>,
		resultSelector?:(collection:T, element:TElement) => TResult):Enumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:Selector<T, any>,
		resultSelector?:(collection:any, middle:any) => TResult):Enumerable<TResult>
	{
		var _ = this;
		if(!resultSelector)
			resultSelector = (a, b) => b;

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
					}
				);
			}
		);
	}

	choose<TResult>(selector:Selector<T, TResult>):Enumerable<TResult>
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
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}

	where(predicate:Predicate<T>):Enumerable<T>
	{

		var _ = this, disposed = !_.throwIfDisposed();

		if(predicate.length<2)
			return new WhereEnumerable(_, predicate);

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
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);

	}

	ofType<TType>(type:{ new (): TType }):Enumerable<TType>;
	ofType<TType>(type:any):Enumerable<TType>
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
					.where(x=>x instanceof  type);
		}
		return <Enumerable<any>>this
			.where(x=>typeof x===typeName);
	}

	except<TCompare>(
		second:IEnumerable<T>,
		compareSelector?:Selector<T, TCompare>):Enumerable<T>
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
							Enumerable.forEach(second, key => keys.addByKeyValue(key, true));
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
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}

	distinct(compareSelector?:(value:T) => T):Enumerable<T>
	{
		return this.except(null, compareSelector);
	}

	// [0,0,0,1,1,1,2,2,2,0,0,0] results in [0,1,2,0];
	distinctUntilChanged<TCompare>(compareSelector?:Selector<T, TCompare>):Enumerable<T>
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
							else if(compareKey===key)
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
					}
				);
			},

			() =>
			{
				disposed = true;
			}
		);
	}

	reverse():Enumerable<T>
	{
		var _ = this, disposed = !_.throwIfDisposed();

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

					(yielder)=>
					index>0
					&& yielder.yieldReturn(buffer[--index]),

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

		var _ = this;
		_.throwIfDisposed();

		var count:number = 0;
		if(predicate)
		{
			_.forEach((x, i) =>
			{
				if(predicate(x, i))++count;
			});
		}
		else
		{
			_.forEach(() =>
			{
				++count;
			});
		}

		return count;
	}

	// Akin to '.every' on an array.
	all(predicate:Predicate<T>):boolean
	{
		var result = true;
		this.forEach(x =>
		{
			if(!predicate(x))
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
		var result = false;

		// Splitting the forEach up this way reduces iterative processing.
		// forEach handles the generation and disposal of the enumerator.
		if(predicate)
		{
			this.forEach(x =>
			{
				result = predicate(x); // false = not found and therefore it should continue.  true = found and break;
				return !result;
			});
		}
		else
		{
			this.forEach(() =>
			{
				result = true;
				return false;
			});
		}
		return result;

	}

	// 'some' has been added here for parity/compatibility with an array.
	some(predicate:Predicate<T>):boolean
	{
		return this.any(predicate);
	}

	isEmpty():boolean
	{
		return !this.any();
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

		if(compareSelector)
			this.forEach((element:T, i?:number) =>
			{
				if(Values.areEqual(compareSelector(element), compareSelector(value), true))
				{
					found = i;
					return false;
				}
			});
		else
			this.forEach((element:T, i?:number) =>
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

		if(compareSelector)
			this.forEach((element:T, i?:number) =>
			{
				if(Values.areEqual(compareSelector(element), compareSelector(value), true)) result
					= i;
			});
		else
			this.forEach((element:T, i?:number) =>
			{
				if(Values.areEqual(element, value, true)) result = i;
			});

		return result;
	}

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
					}
				);
			}
		);
	}

	zip<TSecond, TResult>(
		second:IEnumerable<TSecond> | IArray<TSecond>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>
	{
		var _ = this;

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

					(yielder)=>
					firstEnumerator.moveNext() && secondEnumerator.moveNext()
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
		second:IArray<IEnumerable<TSecond> | IArray<TSecond>>,
		resultSelector:(first:T, second:TSecond, index?:number) => TResult):Enumerable<TResult>
	{
		var _ = this;

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
		inner:IEnumerable<TInner> | IArray<TInner>,
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
						lookup = Enumerable.from<TInner>(inner)
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
		inner:IEnumerable<TInner> | IArray<TInner>,
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
						lookup = Enumerable.from<TInner>(inner)
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

	concatWith(other:IEnumerable<T> | IArray<T>):Enumerable<T>
	{
		var _ = this;

		return new Enumerable<T>(
			() =>
			{
				var firstEnumerator:IEnumerator<T>;
				var secondEnumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						firstEnumerator = _.getEnumerator();
					},

					(yielder) =>
					{
						if(firstEnumerator!=null)
						{
							if(firstEnumerator.moveNext()) return yielder.yieldReturn(firstEnumerator.current);
							secondEnumerator = enumeratorFrom<T>(other);
							firstEnumerator.dispose();
							firstEnumerator = null;
						}
						if(secondEnumerator.moveNext()) return yielder.yieldReturn(secondEnumerator.current);
						return false;
					},

					() =>
					{
						dispose(firstEnumerator, secondEnumerator);
					}
				);
			}
		);
	}

	merge(enumerables:IArray<IEnumerable<T> | IArray<T>>):Enumerable<T>
	{
		var _ = this;

		if(!enumerables.length)
			return _;

		if(enumerables.length==1)
			return _.concatWith(enumerables[0]);

		return new Enumerable<T>(
			() =>
			{
				var enumerator:IEnumerator<T>;
				var queue:Queue<IEnumerable<T> | IArray<T>>;

				return new EnumeratorBase<T>(
					() =>
					{
						// 1) First get our values...
						enumerator = _.getEnumerator();
						queue = new Queue<IEnumerable<T> | IArray<T>>(enumerables);
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
					}
				);
			}
		);
	}

	concat(...enumerables:Array<IEnumerable<T> | IArray<T>>):Enumerable<T>
	{
		var _ = this;
		if(enumerables.length==0)
			return _;

		if(enumerables.length==1)
			return _.concatWith(enumerables[0]);

		return _.merge(enumerables);
	}


	insertAt(index:number, other:IEnumerable<T> | IArray<T>):Enumerable<T>
	{
		if(isNaN(index) || index<0 || !isFinite(index))
			throw new Error("'index' is invalid or out of bounds.");

		Integer.assert(index, "index");
		var n:number = index;

		var _ = this;
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
					}
				);
			}
		);
	}


	alternateMultiple(sequence:IEnumerable<T> | IArray<T>):Enumerable<T>
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
					}
				);
			}
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


	intersect<TCompare>(
		second:IEnumerable<T> | IArray<T>,
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

						Enumerable.from<T>(second)
							.forEach(key=>
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
						dispose(enumerator);
					}
				);  // Should Dictionary be IDisposable?
			}
		);
	}

	sequenceEqual(
		second:IEnumerable<T> | IArray<T>,
		equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	{
		return using(
			this.getEnumerator(),
			e1=> using(
				Enumerable.from<T>(second).getEnumerator(),
				e2=>
				{
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

	//isEquivalent(second:IEnumerable<T> | IArray<T>,
	//	equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	//{
	//	return this
	//		.orderBy(keySelector)
	//		.sequenceEqual(Enumerable.from(second).orderBy(keySelector))
	//}

	union<TCompare>(
		second:IEnumerable<T> | IArray<T>,
		compareSelector:Selector<T, TCompare> = Functions.Identity):Enumerable<T>
	{
		var _ = this;
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
						keys = new Dictionary<T, any>(compareSelector);
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
							secondEnumerator = Enumerable.from<T>(second).getEnumerator();
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
					}
				);
			}
		);
	}

	// #endregion

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

	// #region Grouping Methods

	// Originally contained a result selector (not common use), but this could be done simply by a select statement after.


	groupBy<TKey>(keySelector:Selector<T, TKey>):Enumerable<IGrouping<TKey, T>>;
	groupBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector:Selector<T, TElement>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, TElement>>;
	groupBy<TKey, TElement, TCompare>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		compareSelector?:Selector<TKey, TCompare>):Enumerable<IGrouping<TKey, T>>|Enumerable<IGrouping<TKey, TElement>>
	{
		var _ = this;
		if(!elementSelector) elementSelector = Functions.Identity; // Allow for 'null' and not just undefined.
		return new Enumerable<IGrouping<TKey, TElement>>(
			() => _.toLookup(keySelector, elementSelector, compareSelector)
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

	buffer(size:number):IEnumerable<T[]>
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
						while(len<size && enumerator.moveNext)
						{
							array[len++] = enumerator.current;
						}

						array.length = len;
						return len && yielder.yieldReturn(array);
					},

					() =>
					{
						dispose(enumerator);
					}
				);
			}
		);
	}

	// #region Aggregate Methods

	aggregate(
		func:(a:T, b:T) => T,
		seed?:T):T
	{
		return this.scan(func, seed).lastOrDefault();
	}

	average(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var sum = 0;
		// This allows for infinity math that doesn't destroy the other values.
		var sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

		var count = 0; // No need to make integer if the result could be a float.

		this.forEach(
			function(x)
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
					sumInfinite += value>0 ? (+1) : (-1);
				++count;
			}
		);

		if(sumInfinite) // Not zero?
			return sumInfinite*Infinity;

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
					sumInfinite += value>0 ? (+1) : (-1);
			}
		);

		return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite*Infinity) : sum);
	}

	// Multiplication...
	product(selector:Selector<T, number> = Type.numberOrNaN):number
	{
		var result = 1, exists:boolean = false;

		this.forEach(
			x=>
			{
				exists = true;
				var value = selector(x);
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

	// #endregion

	// #region Single Value Return...

	elementAt(index:number):T
	{
		if(isNaN(index) || index<0 || !isFinite(index))
			throw new Error("'index' is invalid or out of bounds.");

		Integer.assert(index, "index");
		var n:number = index;

		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found = false;
		_.forEach(
			(x:T, i:number) =>
			{
				if(i==n)
				{
					value = x;
					found = true;
					return false;
				}
			}
		);

		if(!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
		return value;
	}

	elementAtOrDefault(index:number, defaultValue:T = null):T
	{

		if(isNaN(index) || index<0 || !isFinite(index))
			throw new Error("'index' is invalid or out of bounds.");

		Integer.assert(index, "index");
		var n:number = index;

		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found = false;
		_.forEach(
			(x:T, i:number) =>
			{
				if(i==n)
				{
					value = x;
					found = true;
					return false;
				}
			}
		);

		return (!found) ? defaultValue : value;
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
		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found:boolean = false;
		_.forEach(
			x =>
			{
				value = x;
				found = true;
				return false;
			}
		);

		if(!found) throw new Error("first:No element satisfies the condition.");
		return value;
	}

	firstOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found = false;
		_.forEach(
			x =>
			{
				value = x;
				found = true;
				return false;
			}
		);
		return (!found) ? defaultValue : value;
	}

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

	single():T
	{
		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found:boolean = false;
		_.forEach(
			x=>
			{
				if(!found)
				{
					found = true;
					value = x;
				}
				else throw new Error("single:sequence contains more than one element.");
			}
		);

		if(!found) throw new Error("single:No element satisfies the condition.");
		return value;
	}

	singleOrDefault(defaultValue:T = null):T
	{

		var _ = this;
		_.throwIfDisposed();

		var value:T = undefined;
		var found:boolean = false;
		_.forEach(
			x=>
			{
				if(!found)
				{
					found = true;
					value = x;
				}
				else throw new Error("single:sequence contains more than one element.");
			}
		);

		return (!found) ? defaultValue : value;
	}

	// #endregion

	share():Enumerable<T>
	{
		var _ = this;
		_.throwIfDisposed();

		var sharedEnumerator:IEnumerator<T>;
		return new Enumerable<T>(
			() =>
			{
				return new EnumeratorBase<T>(
					() =>
					{
						// assertIsNotDisposed(disposed);  This doesn't need an assertion since disposing the underlying enumerable disposes the enumerator.

						if(!sharedEnumerator)
							sharedEnumerator = _.getEnumerator();
					},

					(yielder)=>
					sharedEnumerator.moveNext()
					&& yielder.yieldReturn(sharedEnumerator.current)
				);
			},

			() =>
			{
				dispose(sharedEnumerator);
			}
		);
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

	// #region Error Handling
	catchError(handler:(e:Error) => void):Enumerable<T>
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

	finallyAction(action:() => void):Enumerable<T>
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

}


class ArrayEnumerable<T>
extends Enumerable<T>
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

				return _._source; // Could possibly be null, but ArrayEnumerable if not disposed simply treats null as empty array.
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
		var s = this.source;
		if(!s)
			return [];

		if(Array.isArray(s))
			return (<any>s).slice();

		var len = s.length, result:T[] = ArrayUtility.initialize<T>(len);
		for(let i = 0; i<len; ++i)
		{
			result[i] = s[i];
		}

		return result;
	}

	asEnumerable():ArrayEnumerable<T>
	{
		return new ArrayEnumerable<T>(this._source);
	}

	// Optimize forEach so that subsequent usage is optimized.
	forEach(action:Predicate<T> | Action<T>):void
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source;
		if(source)
		{

			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			for(let i = 0; i<source.length; ++i)
			{
				// _.assertIsNotDisposed(); // Assertion here is unnecessary since we already have a reference to the source array.
				if(<any>action(source[i], i)===false)
					break;
			}
		}
	}

	// These methods should ALWAYS check for array length before attempting anything.

	any(predicate?:Predicate<T>):boolean
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source ? source.length : 0;
		return len && (!predicate || super.any(predicate));
	}

	count(predicate?:Predicate<T>):number
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source, len = source ? source.length : 0;
		return len && (predicate ? super.count(predicate) : len);
	}

	elementAt(index:number):T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source;
		return (index<source.length && index>=0)
			? source[index]
			: super.elementAt(index);
	}

	elementAtOrDefault(index:number, defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source;
		return (index<source.length && index>=0)
			? source[index]
			: defaultValue;
	}

	first():T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source;
		return (source && source.length)
			? source[0]
			: super.first();
	}

	firstOrDefault(defaultValue:T = null):T
	{
		var _ = this;
		_.throwIfDisposed();

		var source = _._source;
		return (source && source.length)
			? source[0]
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

		if(!count || count<0) // Out of bounds? Simply return a unfiltered enumerable.
			return _.asEnumerable();

		return new Enumerable<T>(
			() => new ArrayEnumerator<T>(() => _._source, count)
		);
	}

	takeExceptLast(count:number = 1):Enumerable<T>
	{
		var _ = this, len = _._source ? _._source.length : 0;
		return _.take(len - count);
	}

	takeFromLast(count:number):Enumerable<T>
	{
		if(!count || count<0) return Enumerable.empty<T>();

		var _   = this,
		    len = _._source
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
		return new ArrayEnumerable<T>(this._source);
	}

	sequenceEqual(
		second:IEnumerable<T> | IArray<T>,
		equalityComparer:EqualityComparison<T> = Values.areEqual):boolean
	{
		if(Array.isArray(second))
			return Arrays.areEqual(this.source, <IArray<T>>second, true, equalityComparer);

		if(second instanceof  ArrayEnumerable)
			return (<ArrayEnumerable<T>>second).sequenceEqual(this.source, equalityComparer);

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


export interface IGrouping<TKey, TElement>
extends Enumerable<TElement>
{
	key: TKey;
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


export interface ILookup<TKey, TElement>
extends IEnumerable<IGrouping<TKey, TElement>>
{
	count: number;
	get(key:TKey): TElement[];
	contains(key:TKey): boolean;
}

class Lookup<TKey, TElement>
implements ILookup<TKey, TElement>
{

	constructor(private _dictionary:Dictionary<TKey, TElement[]>)
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


class WhereEnumerable<T>
extends Enumerable<T>
{
	constructor(
		private prevSource:IEnumerable<T>,
		private prevPredicate:Predicate<T>  // predicate.length always <= 1
	)
	{
		super(null);
	}

	where(predicate:Predicate<T>):Enumerable<T>
	{

		if(predicate.length>1)
			return super.where(predicate);

		var prevPredicate = this.prevPredicate;
		var composedPredicate = (x:T) => prevPredicate(x) && predicate(x);
		return new WhereEnumerable<T>(this.prevSource, composedPredicate);
	}

	select<TSelect>(selector:Selector<T, TSelect>):Enumerable<TSelect>
	{

		if(selector.length>1)
			return super.select(selector);

		return new WhereSelectEnumerable<T, TSelect>(
			this.prevSource,
			this.prevPredicate,
			selector
		);
	}

	getEnumerator():IEnumerator<T>
	{
		var predicate = this.prevPredicate;
		var source = this.prevSource;
		var enumerator:IEnumerator<T>;

		return new EnumeratorBase<T>(
			() =>
			{
				enumerator = source.getEnumerator();
			},

			(yielder)=>
			{
				while(enumerator.moveNext())
				{
					if(predicate(enumerator.current))
						return yielder.yieldReturn(enumerator.current);
				}

				return false;
			},

			() =>
			{
				dispose(enumerator);
			}
		);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this.prevPredicate = null;
		this.prevSource = null;
	}
}

class WhereSelectEnumerable<TSource, T>
extends Enumerable<T>
{
	constructor(
		private prevSource:IEnumerable<TSource>,
		private prevPredicate:Predicate<TSource>,  // predicate.length always <= 1
		private prevSelector:Selector<TSource, T> // selector.length always <= 1
	)
	{
		super(null);
	}

	where(predicate:(value:T, index?:number) => boolean):Enumerable<T>
	{
		if(predicate.length>1)
			return super.where(predicate);

		return new WhereEnumerable<T>(this, predicate);
	}

	select<TSelect>(selector:Selector<T, TSelect>):Enumerable<TSelect>
	{

		if(selector.length>1)
		// if selector use index, can't compose
			return super.select(selector);

		var _ = this;
		var prevSelector = _.prevSelector;
		var composedSelector = (x:TSource) => selector(prevSelector(x));
		return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
	}

	getEnumerator():IEnumerator<T>
	{
		var _                             = this,
		    predicate                     = _.prevPredicate,
		    source                        = _.prevSource,
		    selector:Selector<TSource, T> = _.prevSelector, // Type definition needed for correct inference.
		    enumerator:IEnumerator<TSource>;

		return new EnumeratorBase<T>(
			() =>
			{
				enumerator = source.getEnumerator();
			},

			(yielder)=>
			{
				while(enumerator.moveNext())
				{
					var c = enumerator.current;
					if(predicate==null || predicate(c))
					{
						return yielder.yieldReturn(selector(c));
					}
				}
				return false;
			},

			() =>
			{
				dispose(enumerator);
			}
		);
	}

	protected _onDispose():void
	{
		var _ = this;
		super._onDispose();
		_.prevPredicate = null;
		_.prevSource = null;
		_.prevSelector = null;
	}
}

export interface IOrderedEnumerable<T>
extends Enumerable<T>
{
	thenBy(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenByDescending(keySelector:(value:T) => any):IOrderedEnumerable<T>;
	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>;
	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
}

class OrderedEnumerable<T,TOrderBy extends Comparable>
extends Enumerable<T> implements IOrderedEnumerable<T>
{

	constructor(
		private source:IEnumerable<T>,
		public keySelector:(value:T) => TOrderBy,
		public order:Order,
		public parent?:OrderedEnumerable<T,any>,
		public comparer:Comparison<T> = Values.compare)
	{
		super(null);
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
			}
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
function throwIfDisposed(disposed:boolean, className:string = "Enumerable"):void
{
	if(disposed) throw new ObjectDisposedException(className);
}
// #endregion

export default Enumerable;
