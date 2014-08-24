///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq
{

	"use strict";

	// #region Imports
	import Predicate = System.Predicate;
	import Selector = System.Selector;
	import Action = System.Action;

	import ArrayUtility = System.Collections.ArrayUtility;

	import IEnumerator = System.Collections.IEnumerator;
	import EnumeratorBase = System.Collections.EnumeratorBase;

	import IEnumerable = System.Collections.IEnumerable;
	import IArray = System.Collections.IArray;

	import IMap = System.Collections.IMap;
	import Dictionary = System.Collections.Dictionary;

	import using = System.using;

	import enumeratorFrom = System.Collections.Enumerator.from;
	import enumeratorForEach = System.Collections.Enumerator.forEach;

	// #endregion

	// #region Local Constants.
	// Leave internal to avoid accidental overwritting.  
	class LinqFunctions extends System.Functions
	{
		Greater<T>(a: T, b: T) { return a > b ? a : b; }
		Lesser<T>(a: T, b: T) { return a < b ? a : b; }
	}

	var Functions = new LinqFunctions();

	var Types = new System.Types();

	var INT_0: number = 0 | 0,
		INT_NEGATTIVE_1 = -1 | 0,
		INT_POSITIVE_1 = +1 | 0;


	// #endregion

	// #region Helper Functions...
	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed()
	// since there is a strong chance of introducing a circular reference.
	function assertIsNotDisposed(disposed: boolean): boolean
	{
		return DisposableBase.assertIsNotDisposed(disposed, "Enumerable was disposed.");
	}

	function numberOrNaN(value: any): number
	{
		return isNaN(value) ? NaN : value;
	}


	function assertInteger(value: number, variable: string): boolean
	{
		if (typeof value === Types.Number && !isNaN(value) && value != (value | 0))
			throw new Error("'" + variable + "'" + " must be an integer.");
		return true;
	}

	// #endregion

	export enum EnumerableAction
	{
		Break,
		Return,
		Skip
	}


	export class Enumerable<T> extends System.DisposableBase implements IEnumerable<T> {

		// Enumerable<T> is an instance class that has useful statics.
		// In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
		// In this case, we use Enumerable<T> as the underlying class that is being chained.
		constructor(private enumeratorFactory: () => IEnumerator<T>, finalizer?: () => void)
		{
			super(finalizer);
		}

		static fromArray<T>(array: IArray<T>): ArrayEnumerable<T>
		{
			return new ArrayEnumerable<T>(array);
		}

		static from<T>(source: any): Enumerable<T>
		{
			if ("getEnumerator" in source)
				return source;

			if (source instanceof Array || typeof source === System.Types.Object && "length" in source)
				return Enumerable.fromArray<T>(source);

			throw new Error("Unsupported enumerable.");
		}

		static toArray<T>(source: any): T[]
		{
			if (source instanceof Array)
				return source.slice();

			if (typeof source === System.Types.Object && "length" in source)
				source = Enumerable.fromArray<T>(source);

			if (source instanceof Enumerable)
				return source.toArray();

			if ("getEnumerator" in source)
			{
				var result: T[] = [];
				enumeratorForEach<T>(source.getEnumerator(), (e, i) =>
				{
					result[i] = e;
				});
				return result;
			}


			throw new Error("Unsupported enumerable.");
		}


		// #region IEnumerable<T> Implementation...
		getEnumerator(): IEnumerator<T>
		{

			this.assertIsNotDisposed();

			return this.enumeratorFactory();
		}
		// #endregion

		// #region IDisposable override...
		_onDispose(): void
		{
			super._onDispose();
			this.enumeratorFactory = null;
		}
		// #endregion

		//////////////////////////////////////////
		// #region Static Methods...
		static choice<T>(values: IArray<T>): Enumerable<T>
		{
			return new Enumerable<T>(() =>
				new EnumeratorBase<T>(
					null,
					yielder =>
						yielder.yieldReturn(values[(Math.random() * values.length) | 0])
					)
				);
		}

		static cycle<T>(values: IArray<T>): Enumerable<T>
		{
			return new Enumerable<T>(() =>
			{
				var index: number = INT_0; // Let the compiler know this is an int.
				return new EnumeratorBase<T>(
					() => { index = INT_0; }, // Reinitialize the value just in case the enumerator is restarted.
					yielder =>
					{
						if (index >= values.length) index = INT_0;
						return yielder.yieldReturn(values[index++]);
					});
			});
		}

		static empty<T>(): Enumerable<T>
		{
			return new Enumerable<T>(() =>
				new EnumeratorBase<T>(
					null,
					Functions.False));
		}

		static repeat<T>(element: T, count: number = Infinity): Enumerable<T>
		{
			if (isNaN(count) || count <= 0)
				return Enumerable.empty<T>();

			return isFinite(count) && assertInteger(count, "count")
				? new Enumerable<T>(() =>
				{
					var c: number = count | 0; // Force integer evaluation.
					var index: number = INT_0;

					return new EnumeratorBase<T>(
						() => { index = INT_0; },
						yielder => (index++ < c) && yielder.yieldReturn(element)
						);
				})
				: new Enumerable<T>(() =>
					new EnumeratorBase<T>(
						null,
						yielder => yielder.yieldReturn(element)
						));
		}
		// Note: this enumeration does not break.
		static repeatWithFinalize<T>(
			initializer: () => T,
			finalizer: (element: T) => void): Enumerable<T>
		{

			return new Enumerable<T>(() =>
			{
				var element: T;
				return new EnumeratorBase<T>(
					() => { element = initializer(); },
					yielder => yielder.yieldReturn(element),
					() => { finalizer(element); });
			});
		}

		static make<T>(element: T): Enumerable<T>
		{
			return Enumerable.repeat<T>(element, INT_POSITIVE_1);
		}

		// start and step can be other than integer.
		static range(
			start: number = 0,
			count: number = Infinity,
			step: number = 1): Enumerable<number>
		{

			if (!isFinite(start))
				throw new Error("Must have a valid 'start' value.");

			if (isNaN(count) || count <= 0)
				return Enumerable.empty<number>();

			if (!isFinite(step))
				throw new Error("Must have a valid 'step' value.");

			return isFinite(count) && assertInteger(count, "count")
				? new Enumerable<number>(() =>
				{
					var value: number;
					var c: number = count | 0; // Force integer evaluation.
					var index: number = INT_0;

					return new EnumeratorBase<number>(
						() =>
						{
							index = INT_0;
							value = start;
						},
						yielder =>
						{
							var result: boolean =
								index++ < c
								&& yielder.yieldReturn(value);

							if (result && index < count)
								value += step;

							return result;
						}
						);
				})
				: new Enumerable<number>(() =>
				{
					var value: number;

					return new EnumeratorBase<number>(
						() =>
						{
							value = start;
						},
						yielder =>
						{
							var current: number = value;
							value += step;
							return yielder.yieldReturn(current);
						}
						);
				});
		}

		static rangeDown(
			start: number = 0,
			count: number = Infinity,
			step: number = 1): Enumerable<number>
		{
			step = Math.abs(step) * -1;

			return Enumerable.range(start, count, step);
		}

		// step = -1 behaves the same as toNegativeInfinity;
		static toInfinity(
			start: number = 0,
			step: number = 1): Enumerable<number>
		{
			return Enumerable.range(start, Infinity, step);
		}

		static toNegativeInfinity(
			start: number = 0,
			step: number = 1): Enumerable<number>
		{
			return Enumerable.rangeDown(start, Infinity, step);
		}

		static rangeTo(
			start: number = 0,
			to: number = Infinity,
			step: number = 1): Enumerable<number>
		{
			if (!isFinite(start))
				throw new Error("Must have a valid 'start' value.");

			if (isNaN(to))
				throw new Error("Must have a valid 'to' value.");

			if (!isFinite(step))
				throw new Error("Must have a valid 'step' value.");

			// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
			step = Math.abs(step);

			// Range to infinity has a more efficient mechanism.
			if (!isFinite(to))
				return Enumerable.range(start, Infinity, (start < to) ? (+step) : (-step));

			return new Enumerable<number>(() =>
			{
				var value: number;

				return start < to
					? new EnumeratorBase<number>(
						() => { value = start; },
						yielder =>
						{
							var result: boolean = value <= to && yielder.yieldReturn(value);

							if (result)
								value += step;

							return result;
						}
						)
					: new EnumeratorBase<number>(
						() => { value = start; },
						yielder =>
						{
							var result: boolean = value >= to && yielder.yieldReturn(value);

							if (result)
								value -= step;

							return result;
						}
						);
			});
		}

		static matches(input: string, pattern: any, flags: string = ""): Enumerable<RegExpExecArray>
		{

			var type = typeof input;
			if (type != Types.String)
				throw new Error("Cannot exec RegExp matches of type '" + type + "'.");

			if (pattern instanceof RegExp)
			{
				flags += (pattern.ignoreCase) ? "i" : "";
				flags += (pattern.multiline) ? "m" : "";
				pattern = pattern.source;
			}

			if (flags.indexOf("g") === -1) flags += "g";

			return new Enumerable<RegExpExecArray>(() =>
			{
				var regex: RegExp;
				return new EnumeratorBase<RegExpExecArray>(
					() => { regex = new RegExp(pattern, flags); },
					yielder =>
					{
						// Calling regex.exec concecutively on the same input uses the lastIndex to start the next match.
						var match = regex.exec(input);
						return (match !== null) ? yielder.yieldReturn(match) : false;
					});
			});
		}

		static generate<T>(factory: (index?: number) => T, count: number = Infinity): Enumerable<T>
		{

			if (isNaN(count) || count <= 0)
				return Enumerable.empty<T>();

			return isFinite(count) && assertInteger(count, "count")
				? new Enumerable<T>(() =>
				{
					var c: number = count | 0; // Force integer evaluation.
					var index: number = INT_0;

					return new EnumeratorBase<T>(
						() => { index = INT_0; },
						yielder =>
						{
							var current: number = index++;
							return current < c && yielder.yieldReturn(factory(current));
						});
				})
				: new Enumerable<T>(() =>
				{
					var index: number = INT_0;
					return new EnumeratorBase<T>(
						() => { index = INT_0; },
						yielder => yielder.yieldReturn(factory(index++))
						);
				});
		}

		static unfold<T>(seed: T, valueFactory: Selector<T, T>, skipSeed: Boolean = false): Enumerable<T>
		{
			return new Enumerable<T>(() =>
			{
				var index: number = INT_0;
				var value: T;
				var isFirst: boolean;
				return new EnumeratorBase<T>(
					() =>
					{
						index = INT_0;
						value = seed;
						isFirst = !skipSeed;
					},
					yielder =>
					{
						var i = index++;
						if (isFirst)
							isFirst = false;
						else
							value = valueFactory(value, i);
						return yielder.yieldReturn(value);
					});
			});
		}

		static defer<T>(enumerableFactory: () => IEnumerable<T>): Enumerable<T>
		{

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => { enumerator = enumerableFactory().getEnumerator(); },
					yielder => enumerator.moveNext() && yielder.yieldReturn(enumerator.current),
					() => { System.dispose(enumerator); }
					);
			});
		}

		static forEach<T>(
			enumerable: IEnumerable<T>,
			action: (element: T, index?: number) => any): void
		{
			System.Collections.Enumerable.forEach(enumerable, action);
		}

		// Slightly optimized versions for numbers.
		static max(values: Enumerable<number>): number
		{
			return values
				.takeUntil(v=> v == +Infinity, true)
				.aggregate(Functions.Greater);
		}

		static min(values: Enumerable<number>): number
		{
			return values
				.takeUntil(v=> v == -Infinity, true)
				.aggregate(Functions.Lesser);
		}

		// #endregion

		//////////////////////////////////////////
		// #region Instance methods...

		assertIsNotDisposed(errorMessage: string = "Enumerable was disposed."): boolean
		{
			return super.assertIsNotDisposed(errorMessage);
		}

		forEach(action: Predicate<T>): void;
		forEach(action: Action<T>): void;
		forEach(action: (element: T, index?: number) => any): void
		{

			var _ = this;
			_.assertIsNotDisposed();

			var index: number = INT_0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			using(_.getEnumerator(), e=>
			{
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while (_.assertIsNotDisposed() && e.moveNext())
				{
					if (action(e.current, index++) === false)
						break;
				}
			});
		}

		// #region Conversion Methods
		toArray(predicate?: Predicate<T>): T[]
		{
			var result: T[] = [];

			if (predicate) return this.where(predicate).toArray();

			this.forEach((x,i)=> result[i] = x);

			return result;
		}

		// Return a default (unfiltered) enumerable.
		asEnumerable(): Enumerable<T>
		{
			var _ = this;
			return new Enumerable<T>(() => _.getEnumerator());
		}


		toLookup<TKey, TValue, TCompare>(
			keySelector: Selector<T, TKey>,
			elementSelector: Selector<T, TValue> = Functions.Identity,
			compareSelector: Selector<TKey, TCompare> = Functions.Identity): Lookup<TKey, TValue>
		{

			var dict = new Dictionary<TKey, TValue[]>(compareSelector);
			this.forEach(x=>
			{
				var key = keySelector(x);
				var element = elementSelector(x);

				var array = dict.get(key);
				if (array !== undefined) array.push(element);
				else dict.addByKeyValue(key, [element]);
			});
			return new Lookup<TKey, TValue>(dict);
		}

		toMap<TResult>(
			keySelector: Selector<T, string>,
			elementSelector: Selector<T, TResult>): IMap<TResult>
		{
			var obj: IMap<TResult> = {};
			this.forEach(x=> { obj[keySelector(x)] = elementSelector(x); });
			return obj;
		}

		toDictionary<TKey, TValue, TCompare>(
			keySelector: Selector<T, TKey>,
			elementSelector: Selector<T, TValue>,
			compareSelector: Selector<TKey, TCompare> = Functions.Identity): Dictionary<TKey, TValue>
		{
			var dict = new Dictionary<TKey, TValue>(compareSelector);
			this.forEach(x=> dict.addByKeyValue(keySelector(x), elementSelector(x)));
			return dict;
		}

		toJoinedString(separator: string= "", selector: Selector<T, string> = Functions.Identity)
		{
			return this.select(selector).toArray().join(separator);
		}

		// #endregion


		// Similar to forEach, but execute's an action for each time a value is enumerated.
		// If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
		// If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
		// This also automatically handles disposing the enumerator.
		doAction(action: Selector<T, EnumerableAction>): Enumerable<T>;
		doAction(action: Selector<T, number>): Enumerable<T>;
		doAction(action: Predicate<T>): Enumerable<T>;
		doAction(action: Action<T>): Enumerable<T>;
		doAction(action: (element: T, index?: number) => any): Enumerable<T>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number = INT_0;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = INT_0;
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext())
						{
							var actionResult = action(enumerator.current, index++);

							if (actionResult === false || actionResult === EnumerableAction)
								return yielder.yieldBreak();

							if (actionResult !== 2)
								return yielder.yieldReturn(enumerator.current);

							// If actionResult===2, then a signal for skip is recieved.
						}
						return false;
					},
					() => { System.dispose(enumerator); }
					);

			},
			// Using a finalizer value reduces the chance of a circular reference
			// since we could simply reference the enueration and check e.wasDisposed.
				() => { disposed = true; });
		}

		force(defaultAction: EnumerableAction = EnumerableAction.Break): void
		{

			this.assertIsNotDisposed();

			this.doAction(element => defaultAction);
		}

		// #region Indexing/Paging methods.
		skip(count: number): Enumerable<T>
		{
			var _ = this;

			_.assertIsNotDisposed();

			if (!count || isNaN(count) || count < 0) // Out of bounds? Simply return this.
				return _;

			if (!isFinite(count)) // +Infinity equals skip all so return empty.
				return Enumerable.empty<T>();

			assertInteger(count, "count");

			var c: number = count | 0;

			return this.doAction(
				(element: T, index?: number)
					=> index < c
					? EnumerableAction.Skip
					: EnumerableAction.Return);
		}

		skipWhile(predicate: Predicate<T>): Enumerable<T>
		{

			this.assertIsNotDisposed();

			var skipping: boolean = true;

			return this.doAction(
				(element: T, index?: number)
					=>
				{
					if (skipping)
						skipping = predicate(element, index);

					return skipping ? EnumerableAction.Skip : EnumerableAction.Return;
				});
		}

		take(count: number): Enumerable<T>
		{
			if (!count || isNaN(count) || count < 0) // Out of bounds? Empty.
				return Enumerable.empty<T>();

			var _ = this;
			_.assertIsNotDisposed();

			if (!isFinite(count)) // +Infinity equals no limit.
				return _;

			assertInteger(count, "count");
			var c = count | 0;

			// Once action returns false, the enumeration will stop.
			return _.doAction((element: T, index?: number) => index < c);
		}

		takeWhile(predicate: Predicate<T>): Enumerable<T>
		{

			this.assertIsNotDisposed();

			return this.doAction(
				(element: T, index?: number)
					=> predicate(element, index) ? EnumerableAction.Return : EnumerableAction.Break);
		}

		// Is like the inverse of take While with the ability to return the value identified by the predicate.
		takeUntil(predicate: Predicate<T>, includeUntilValue?: boolean): Enumerable<T>
		{

			this.assertIsNotDisposed();

			if (!includeUntilValue)
				return this.doAction(
					(element: T, index?: number)
						=> predicate(element, index) ? EnumerableAction.Break : EnumerableAction.Return);

			var found: boolean = false;
			return this.doAction(
				(element: T, index?: number)
					=>
				{
					if (found)
						return EnumerableAction.Break;

					found = predicate(element, index);

					return EnumerableAction.Return;
				});
		}

		takeExceptLast(count: number = 1): Enumerable<T>
		{
			var _ = this;

			if (!count || isNaN(count) || count <= 0) // Out of bounds? Empty.
				return _;

			if (!isFinite(count)) // +Infinity equals skip all so return empty.
				return Enumerable.empty<T>();

			assertInteger(count, "count");
			var c = count | 0;

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var q: T[];

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						q = []; // TODO: Use an actual queue class that doesn't have the .shift() overhead.
					},
					yielder =>
					{
						while (enumerator.moveNext())
						{
							// Add the next one to the queue.
							q.push(enumerator.current);

							// Did we reach our quota?
							if (q.length > c)
								// Okay then, start returning results.
								return yielder.yieldReturn(q.shift());
						}
						return false;
					},
					() => { System.dispose(enumerator); });
			});
		}

		takeFromLast(count: number): Enumerable<T>
		{
			if (!count || isNaN(count) || count <= 0) // Out of bounds? Empty.
				return Enumerable.empty<T>();

			var _ = this;

			if (!isFinite(count)) // Infinity means return all in reverse.
				return _.reverse();

			assertInteger(count, "count");

			return _.reverse().take(count | 0);
		}
		// #endregion

		// #region Projection and Filtering Methods

		traverseBreadthFirst(
			func: (element: any) => IEnumerable<any>,
			resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>
		{
			var _ = this;

			return new Enumerable<any>(() =>
			{
				var enumerator: IEnumerator<any>;
				var nestLevel: number = INT_0;
				var buffer: any[];

				return new EnumeratorBase<any>(
					() =>
					{
						nestLevel = INT_0;
						buffer = [];
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						while (true)
						{
							if (enumerator.moveNext())
							{
								buffer.push(enumerator.current);
								return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							var next = Enumerable.fromArray<T>(buffer)
								.selectMany((x: any) => func(x));
							if (!next.any())
							{
								return false;
							}
							else
							{
								nestLevel++;
								buffer = [];
								enumerator.dispose();
								enumerator = next.getEnumerator();
							}
						}
					},
					() => { System.dispose(enumerator); });
			});
		}


		traverseDepthFirst(
			func: (element: any) => IEnumerable<any>,
			resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any>
		{
			var _ = this;

			return new Enumerable<any>(() =>
			{
				var enumeratorStack: IEnumerator<any>[] = []; // TODO: Consider using an actual stack and not an array.
				var enumerator: IEnumerator<any>;

				return new EnumeratorBase<T>(
					() => { enumerator = _.getEnumerator(); },
					yielder =>
					{
						while (true)
						{
							if (enumerator.moveNext())
							{
								var value = resultSelector(enumerator.current, enumeratorStack.length);
								enumeratorStack.push(enumerator);
								enumerator = func(enumerator.current).getEnumerator();
								return yielder.yieldReturn(value);
							}

							if (enumeratorStack.length == 0) return false;

							enumerator.dispose();
							enumerator = enumeratorStack.pop();
						}
					},
					() =>
					{
						try
						{
							System.dispose(enumerator);
						}
						finally
						{
							System.disposeThese(enumeratorStack);
						}
					});
			});
		}


		flatten(): Enumerable<any>
		{
			var _ = this;

			return new Enumerable<any>(() =>
			{
				var enumerator: IEnumerator<any>;
				var middleEnumerator: IEnumerator<any> = null;

				return new EnumeratorBase<T>(
					() => { enumerator = _.getEnumerator(); },
					yielder =>
					{
						while (true)
						{
							if (middleEnumerator != null)
							{
								if (middleEnumerator.moveNext())
								{
									return yielder.yieldReturn(middleEnumerator.current);
								}
								else
								{
									middleEnumerator = null;
								}
							}

							if (enumerator.moveNext())
							{
								var c = enumerator.current;
								if (c instanceof Array)
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
						System.dispose(enumerator, middleEnumerator);
					});
			});
		}


		pairwise<TSelect>(selector: (prev: T, current: T) => TSelect): Enumerable<TSelect>
		{
			var _ = this;

			return new Enumerable<TSelect>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<TSelect>(
					() =>
					{
						enumerator = _.getEnumerator();
						enumerator.moveNext();
					},
					yielder =>
					{
						var prev = enumerator.current;
						return enumerator.moveNext()
							&& yielder.yieldReturn(selector(prev, enumerator.current));
					},
					() => { System.dispose(enumerator); });
			});
		}

		scan(func: (a: T, b: T) => T, seed?: T): Enumerable<T>
		{

			var isUseSeed = seed !== undefined; // For now...
			var _ = this;

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var value: T;
				var isFirst: boolean;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						isFirst = true;
					},
					yielder =>
					{
						if (isFirst)
						{
							isFirst = false;
							return isUseSeed
								? yielder.yieldReturn(value = seed)
								: enumerator.moveNext() && yielder.yieldReturn(value = enumerator.current);
						}

						return (enumerator.moveNext())
							? yielder.yieldReturn(value = func(value, enumerator.current))
							: false;
					},
					() => { System.dispose(enumerator); });
			});
		}
		// #endregion


		select<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			if (selector.length < 2)
				return new WhereSelectEnumerable(_, null, selector);

			return new Enumerable<TResult>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number = INT_0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = INT_0;
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						return enumerator.moveNext()
							? yielder.yieldReturn(selector(enumerator.current, index++))
							: false;
					},
					() => { System.dispose(enumerator); }
					);
			},
				() => { disposed = true; });
		}


		selectMany<TResult>(
			collectionSelector: Selector<T, IEnumerable<TResult>>
			): Enumerable<TResult>;

		selectMany<TResult>(
			collectionSelector: Selector<T, TResult[]>
			): Enumerable<TResult>;

		selectMany<TElement, TResult>(
			collectionSelector: Selector<T, IEnumerable<TElement>>,
			resultSelector?: (collection: T, element: TElement) => TResult
			): Enumerable<TResult>;

		selectMany<TElement, TResult>(
			collectionSelector: Selector<T, TElement[]>,
			resultSelector?: (collection: T, element: TElement) => TResult
			): Enumerable<TResult>;

		selectMany<TResult>(
			collectionSelector: Selector<T, any>,
			resultSelector?: (collection: any, middle: any) => TResult
			): Enumerable<TResult>
		{
			var _ = this;
			if (!resultSelector)
				resultSelector = (a, b) => b;

			return new Enumerable<TResult>(() =>
			{
				var enumerator: IEnumerator<T>;
				var middleEnumerator: IEnumerator<any>;
				var index: number = INT_0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						enumerator = _.getEnumerator();
						middleEnumerator = undefined;
						index = INT_0;
					},
					yielder =>
					{

						// Just started, and nothing to enumerate? End.
						if (middleEnumerator === undefined && !enumerator.moveNext())
							return false;

						// moveNext has been called at least once...
						do
						{

							// Initialize middle if there isn't one.
							if (!middleEnumerator)
							{
								var middleSeq = collectionSelector(enumerator.current, index++);

								// Collection is null?  Skip it...
								if (!middleSeq)
									continue;

								middleEnumerator = System.Collections.Enumerator.from(middleSeq);
							}

							if (middleEnumerator.moveNext())
								return yielder.yieldReturn(resultSelector(enumerator.current, middleEnumerator.current));

							// else no more in this middle?  Then clear and reset for next...

							middleEnumerator.dispose();
							middleEnumerator = null;

						} while (enumerator.moveNext());

						return false;
					},
					() =>
					{
						System.dispose(enumerator, middleEnumerator);
						enumerator = null;
						middleEnumerator = null;
					});
			});
		}

		choose<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<TResult>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number = INT_0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = INT_0;
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext())
						{
							var result = selector(enumerator.current, index++);
							if (result !== null && result !== undefined)
								return yielder.yieldReturn(result);
						}

						return false;
					},
					() => { System.dispose(enumerator); }
					);
			},
				() => { disposed = true; });
		}

		where(predicate: Predicate<T>): Enumerable<T>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			if (predicate.length < 2)
				return new WhereEnumerable(_, predicate);

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number = INT_0;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = INT_0;
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext())
						{
							if (predicate(enumerator.current, index++))
								return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},
					() => { System.dispose(enumerator); }
					);
			},
				() => { disposed = true; });

		}

		ofType<TType>(type: { new (): TType }): Enumerable<TType>;
		ofType<TType>(type: any): Enumerable<TType>
		{
			var typeName: string;
			switch (<any>type)
			{
				case Number:
					typeName = Types.Number;
					break;
				case String:
					typeName = Types.String;
					break;
				case Boolean:
					typeName = Types.Boolean;
					break;
				case Function:
					typeName = Types.Function;
					break;
				default:
					typeName = null;
					break;
			}
			return <Enumerable<any>>((typeName === null)
				? this.where(x=> { return x instanceof type; })
				: this.where(x=> { return typeof x === typeName; }));
		}

		except<TCompare>(
			second: IEnumerable<T>,
			compareSelector?: Selector<T, TCompare>): Enumerable<T>
		{
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var keys: System.Collections.Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new System.Collections.Dictionary<T, boolean>(compareSelector);
						if (second)
							Enumerable.forEach(second, key => keys.addByKeyValue(key, true));
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);
						while (enumerator.moveNext())
						{
							var current = enumerator.current;
							if (!keys.containsKey(current))
							{
								keys.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},
					() =>
					{
						System.dispose(enumerator);
						keys.clear();
					});
			},
				() => { disposed = true; });
		}

		distinct(compareSelector?: (value: T) => T): Enumerable<T>
		{
			return this.except(null, compareSelector);
		}

		// [0,0,0,1,1,1,2,2,2,0,0,0] results in [0,1,2,0];
		distinctUntilChanged<TCompare>(compareSelector?: Selector<T, TCompare>): Enumerable<T>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var compareKey: TCompare;
				var initial: boolean = true;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);
						while (enumerator.moveNext())
						{
							var key = compareSelector(enumerator.current);

							if (initial)
							{
								initial = false;
							}
							else if (compareKey === key)
							{
								continue;
							}

							compareKey = key;
							return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},
					() => { System.dispose(enumerator); }
					);
			},
				() => { disposed = true; });
		}

		reverse(): Enumerable<T>
		{
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var buffer: T[];
				var index: number = INT_0;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						buffer = _.toArray();
						index = buffer.length | 0;
					},

					yielder =>
						index > INT_0
						&& yielder.yieldReturn(buffer[--index]),

					() => { buffer.length = 0; }
					);
			},
				() => { disposed = true; });
		}

		shuffle(): Enumerable<T>
		{
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var buffer: T[]; // TODO: Review this.  May be inefficient.

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						buffer = _.toArray();
					},
					yielder =>
					{
						var len = buffer.length;
						return len && yielder.yieldReturn(
							buffer.splice(
								(Math.random() * len) | 0, INT_POSITIVE_1)[0]);
					},
					() => { buffer.length = 0; }
					);
			},
				() => { disposed = true; });
		}

		count(predicate?: Predicate<T>): number
		{

			var _ = this;
			_.assertIsNotDisposed();

			var count: number = INT_0;
			if (predicate)
			{
				_.forEach((x, i) =>
				{
					if (predicate(x, i))++count;
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
		all(predicate: Predicate<T>): boolean
		{
			var result = true;
			this.forEach(x =>
			{
				if (!predicate(x))
				{
					result = false;
					return false; // break
				}
			});
			return result;
		}
		// 'every' has been added here for parity/compatibility with an array.
		every(predicate: Predicate<T>): boolean
		{
			return this.all(predicate);
		}

		// Akin to '.some' on an array.
		any(predicate?: Predicate<T>): boolean
		{
			var result = false;

			// Splitting the forEach up this way reduces iterative processing.
			// forEach handles the generation and disposal of the enumerator.
			if (predicate)
			{
				this.forEach(x =>
				{
					result = predicate(x); // false = not found and therefore it should continue.  true = found and break;
					return !result;
				});
			} else
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
		some(predicate: Predicate<T>): boolean
		{
			return this.any(predicate);
		}

		isEmpty(): boolean
		{
			return !this.any();
		}

		contains<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): boolean
		{
			return compareSelector
				? this.any(v=> compareSelector(v) === compareSelector(value))
				: this.any(v=> v === value);
		}

		// Originally has an overload for a predicate,
		// but that's a bad idea since this could be an enumeration of functions and therefore fail the intent.
		// Better to chain a where statement first to be more explicit.
		indexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number
		{
			var found: number = INT_NEGATTIVE_1;

			if (compareSelector)
				this.forEach((element: T, i?: number) =>
				{
					if (System.areEqual(compareSelector(element), compareSelector(value), true))
					{
						found = i;
						return false;
					}
				});
			else
				this.forEach((element: T, i?: number) =>
				{
					// Why?  Because NaN doens't equal NaN. :P
					if (System.areEqual(element, value, true))
					{
						found = i;
						return false;
					}
				});

			return found;
		}

		lastIndexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number
		{
			var result: number = INT_NEGATTIVE_1;

			if (compareSelector)
				this.forEach((element: T, i?: number) =>
				{
					if (System.areEqual(compareSelector(element), compareSelector(value), true)) result = i;
				});
			else
				this.forEach((element: T, i?: number) =>
				{
					if (System.areEqual(element, value, true)) result = i;
				});

			return result;
		}

		defaultIfEmpty(defaultValue: T = null): Enumerable<T>
		{
			var _ = this, disposed: boolean = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;
				var isFirst: boolean;

				return new EnumeratorBase<T>(
					() =>
					{
						isFirst = true;
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						if (enumerator.moveNext())
						{
							isFirst = false;
							return yielder.yieldReturn(enumerator.current);
						}
						else if (isFirst)
						{
							isFirst = false;
							return yielder.yieldReturn(defaultValue);
						}
						return false;
					},
					() => { System.dispose(enumerator); }
					);
			});
		}

		zip<TSecond, TResult>(
			second: Enumerable<TSecond>,
			resultSelector: (first: T, second: TSecond, index?: number) => TResult)
			: Enumerable<TResult>;
		zip<TSecond, TResult>(
			second: IArray<TSecond>,
			resultSelector: (first: T, second: TSecond, index?: number) => TResult
			): Enumerable<TResult>;
		zip<TSecond, TResult>(
			second: any,
			resultSelector: (first: T, second: TSecond, index?: number) => TResult)
			: Enumerable<TResult>
		{
			var _ = this;

			return new Enumerable<TResult>(() =>
			{
				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<TSecond>;
				var index: number = INT_0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						index = INT_0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumeratorFrom<TSecond>(second);
					},
					yielder =>
						firstEnumerator.moveNext() && secondEnumerator.moveNext()
						&& yielder.yieldReturn(resultSelector(firstEnumerator.current, secondEnumerator.current, index++)),
					() =>
					{
						System.dispose(firstEnumerator, secondEnumerator);
					});
			});
		}

		zipMultiple<TSecond, TResult>(
			second: Enumerable<TSecond>[],
			resultSelector: (first: T, second: TSecond, index?: number) => TResult)
			: Enumerable<TResult>;
		zipMultiple<TSecond, TResult>(
			second: IArray<TSecond>[],
			resultSelector: (first: T, second: TSecond, index?: number) => TResult)
			: Enumerable<TResult>;
		zipMultiple<TSecond, TResult>(
			second: any[],
			resultSelector: (first: T, second: TSecond, index?: number) => TResult)
			: Enumerable<TResult>
		{
			var _ = this;

			if (!second.length)
				return Enumerable.empty<TResult>();

			return new Enumerable<TResult>(() =>
			{
				var secondTemp: any[];
				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<TSecond>;
				var index: number = INT_0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						secondTemp = second.slice();
						index = INT_0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = null;
					},

					yielder =>
					{
						if (firstEnumerator.moveNext())
						{
							while (true)
							{
								while (!secondEnumerator)
								{
									var next = secondTemp.shift(); // Find a way to avoid using .shift().. SLOW!
									if(next)
										secondEnumerator = enumeratorFrom<TSecond>(next);
									else if (!secondTemp.length)
										return yielder.yieldBreak();
								}

								if (secondEnumerator.moveNext())
									return yielder.yieldReturn(
										resultSelector(firstEnumerator.current, secondEnumerator.current, index++));

								secondEnumerator.dispose();
								secondEnumerator = null;
							}
						}

						return yielder.yieldBreak();
					},
					() =>
					{
						System.dispose(firstEnumerator);
					});
			});
		}
			
		// #region Join Methods

		join<TInner, TKey, TResult, TCompare>(
			inner: Enumerable<TInner>,
			outerKeySelector: Selector<T, TKey>,
			innerKeySelector: Selector<TInner, TKey>,
			resultSelector: (outer: T, inner: TInner) => TResult,
			compareSelector: Selector<TKey, TCompare> = Functions.Identity)
			: Enumerable<TResult>
		{

			var _ = this;
			return new Enumerable<TResult>(() => {
				var outerEnumerator:IEnumerator<T>;
				var lookup:Lookup<TKey,TInner>;
				var innerElements:TInner[] = null;
				var innerCount:number = INT_0;

				return new EnumeratorBase<TResult>(
					() => {
						outerEnumerator = _.getEnumerator();
						lookup = Enumerable.from<TInner>(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},
					yielder => {
						while (true) {
							if (innerElements != null) {
								var innerElement = innerElements[innerCount++];
								if (innerElement !== undefined)
									return yielder.yieldReturn(resultSelector(outerEnumerator.current, innerElement));

								innerElement = null;
								innerCount = INT_0;
							}

							if (outerEnumerator.moveNext()) {
								var key = outerKeySelector(outerEnumerator.current);
								innerElements = lookup.get(key);
							} else {
								return yielder.yieldBreak();
							}
						}
					},
					() => { System.dispose(outerEnumerator); });
			});
		}

		groupJoin<TInner, TKey, TResult, TCompare>(
			inner: Enumerable<TInner>,
			outerKeySelector: Selector<T, TKey>,
			innerKeySelector: Selector<TInner, TKey>,
			resultSelector: (outer: T, inner: TInner[]) => TResult,
			compareSelector: Selector<TKey, TCompare> = Functions.Identity)
			: Enumerable<TResult>
		{
			var _ = this;

			return new Enumerable<TResult>(() => {
				var enumerator: IEnumerator<T>;
				var lookup: Lookup<TKey, TInner> = null;

				return new EnumeratorBase<TResult>(
					() => {
						enumerator = _.getEnumerator();
						lookup = Enumerable.from<TInner>(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},
					yielder =>
						enumerator.moveNext()
						&& yielder.yieldReturn(
							resultSelector(
								enumerator.current,
								lookup.get(outerKeySelector(enumerator.current)))),
					() => { System.dispose(enumerator); });
			});
		}

		concatWith(other: IEnumerable<T>): Enumerable<T>;
		concatWith(other: IArray<T>): Enumerable<T>;
		concatWith(other: any): Enumerable<T>
		{
			var _ = this;

			return new Enumerable<T>(() =>
			{
				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						firstEnumerator = _.getEnumerator();
					},
					yielder =>
					{
						if (firstEnumerator!=null)
						{
							if (firstEnumerator.moveNext()) return yielder.yieldReturn(firstEnumerator.current);
							secondEnumerator = enumeratorFrom<T>(other);
							firstEnumerator.dispose();
							firstEnumerator = null;
						}
						if (secondEnumerator.moveNext()) return yielder.yieldReturn(secondEnumerator.current);
						return false;
					},
					() =>
					{
						System.dispose(firstEnumerator, secondEnumerator);
					});
			});
		}

		merge(enumerables: IEnumerable<T>[]): Enumerable<T>;
		merge(enumerables: IArray<T>[]): Enumerable<T>;
		merge(enumerables: any[]): Enumerable<T>
		{
			var _ = this;

			if (!enumerables.length)
				return _;

			if (enumerables.length == 1)
				return _.concatWith(enumerables[0]);

			enumerables = enumerables.slice(); // TODO: Use a Queue or LinkedList class to avoid .shift();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					()=> { enumerator = _.getEnumerator(); }, // 1) First get our values...
					yielder =>
					{
						while(true) {

							while (!enumerator && enumerables.length)
							{
								enumerator = enumeratorFrom<T>(enumerables.shift()); // 4) Keep going and on to step 2.  Else fall through to yieldBreak().
							}

							if (enumerator && enumerator.moveNext()) // 2) Keep returning until done.
								return yielder.yieldReturn(enumerator.current);

							if (enumerator) // 3) Dispose and reset for next.
							{
								enumerator.dispose();
								enumerator = null;
								continue;
							}

							return yielder.yieldBreak();
						}
					});
			});
		}

		concat(...enumerables: IEnumerable<T>[]): Enumerable<T>;
		concat(...enumerables: IArray<T>[]): Enumerable<T>;
		concat(...enumerables: any[]): Enumerable<T>
		{
			var _ = this;
			if (enumerables.length == 0)
				return _;

			if (enumerables.length == 1)
				return _.concatWith(enumerables[0]);

			return _.merge(enumerables);
		}

		
		insertAt(index: number, other: IEnumerable<T>): Enumerable<T>;
		insertAt(index: number, other: IArray<T>): Enumerable<T>;
		insertAt(index: number, other: any): Enumerable<T>
		{
			if (isNaN(index) || index < 0 || !isFinite(index))
				throw new Error("'index' is invalid or out of bounds.");

			assertInteger(index, "index");
			var n: number = index | 0;

			var _ = this;
			_.assertIsNotDisposed();

			return new Enumerable<T>(() => {

				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<T>;

				var count:number = INT_0;
				var isEnumerated:boolean = false;

				return new EnumeratorBase<T>(
					() =>
					{
						count = INT_0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumeratorFrom<T>(other);
						isEnumerated = false;
					},
					yielder => {
						if (count == n)
						{ // Inserting?
							isEnumerated = true;
							if (secondEnumerator.moveNext())
								return yielder.yieldReturn(secondEnumerator.current);
						}

						if (firstEnumerator.moveNext())
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
						System.dispose(firstEnumerator, secondEnumerator);
					});
			});
		}

		
		alternateMultiple(sequence: IEnumerable<T>): Enumerable<T>;
		alternateMultiple(sequence: IArray<T>): Enumerable<T>;
		alternateMultiple(sequence: any): Enumerable<T>
		{
			var _ = this;

			return new Enumerable<T>(() => {
				var buffer: T,
					mode: EnumerableAction,
					enumerator: IEnumerator<T>,
					alternateEnumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						// Instead of recalling getEnumerator every time, just reset the existing one.
						alternateEnumerator = new System.Collections.ArrayEnumerator(
							Enumerable.toArray<T>(sequence)); // Freeze 

						enumerator = _.getEnumerator();

						var hasAtLeastOne = enumerator.moveNext();
						mode = hasAtLeastOne
							? EnumerableAction.Return
							: EnumerableAction.Break;

						if (hasAtLeastOne)
							buffer = enumerator.current;
					},
					yielder =>
					{
						switch (mode)
						{
							case EnumerableAction.Break: // We're done?
								return yielder.yieldBreak();

							case EnumerableAction.Skip:
								if (alternateEnumerator.moveNext())
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

						if (another)
							buffer = enumerator.current;

						return yielder.yieldReturn(latest);

					},
					() =>
					{
						System.dispose(enumerator, alternateEnumerator);
					});
			});
		}

		alternateSingle(value: T): Enumerable<T>
		{
			return this.alternateMultiple(Enumerable.make(value));
		}

		alternate(...sequence: T[]): Enumerable<T>
		{
			return this.alternateMultiple(sequence);
		}


		intersect<TCompare>(second: IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
		intersect<TCompare>(second: IArray<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T>;
		intersect<TCompare>(second: any, compareSelector?: Selector<T, TCompare>): Enumerable<T>
		{
			var _ = this;

			return new Enumerable<T>(() => {
				var enumerator:IEnumerator<T>;
				var keys:Dictionary<T,boolean>;
				var outs:Dictionary<T,boolean>;

				return new EnumeratorBase<T>(
					() => {
						enumerator = _.getEnumerator();

						keys = new Dictionary<T, boolean>(compareSelector);
						outs = new Dictionary<T, boolean>(compareSelector);

						Enumerable.from<T>(second)
							.forEach(key=> { keys.addByKeyValue(key, true); });
					},
					yielder => {
						while (enumerator.moveNext()) {
							var current = enumerator.current;
							if (!outs.containsKey(current) && keys.containsKey(current)) {
								outs.addByKeyValue(current,true);
								return yielder.yieldReturn(current);
							}
						}
						return yielder.yieldBreak();
					},
					() => { System.dispose(enumerator); });  // Should Dictionary be IDisposable?
			});
		}

		sequenceEqual(second: IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
		sequenceEqual(second: IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
		sequenceEqual(second: any, equalityComparer: (a: T, b: T) => boolean = System.areEqual): boolean
		{
			return using(this.getEnumerator(),
				e1=> using(Enumerable.from<T>(second).getEnumerator(),
					e2=>
					{
						while (e1.moveNext())
						{
							if (!e2.moveNext() || !equalityComparer(e1.current, e2.current))
								return false;
						}

						return !e2.moveNext();
					})
				);
		}


		union<TCompare>(
			second: IEnumerable<T>,
			compareSelector: Selector<T, TCompare>): Enumerable<T>;
		union<TCompare>(
			second: IArray<T>,
			compareSelector?: Selector<T, TCompare>): Enumerable<T>;
		union<TCompare>(
			second: any,
			compareSelector: Selector<T, TCompare> = Functions.Identity): Enumerable<T>
		{
			var source = this;


			return new Enumerable<T>(() =>
			{
				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<T>;
				var keys: Dictionary<T, any>;

				return new EnumeratorBase<T>(
					() =>
					{
						firstEnumerator = source.getEnumerator();
						keys = new Dictionary<T, any>(compareSelector);
					},
					yielder =>
					{
						var current: T;
						if (secondEnumerator === undefined)
						{
							while (firstEnumerator.moveNext())
							{
								current = firstEnumerator.current;
								if (!keys.containsKey(current))
								{
									keys.addByKeyValue(current, null);
									return yielder.yieldReturn(current);
								}
							}
							secondEnumerator = Enumerable.from<T>(second).getEnumerator();
						}
						while (secondEnumerator.moveNext())
						{
							current = secondEnumerator.current;
							if (!keys.containsKey(current))
							{
								keys.addByKeyValue(current, null);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},
					() =>
					{
						System.dispose(firstEnumerator, secondEnumerator);
					});
			});
		}
		// #endregion

		// #region Ordering Methods

		orderBy<TKey>(keySelector: Selector<T, TKey> = Functions.Identity): OrderedEnumerable<T>
		{
			return new OrderedEnumerable<T>(this, keySelector, false);
		}

		orderByDescending<TKey>(keySelector: Selector<T, TKey> = Functions.Identity): OrderedEnumerable<T>
		{
			return new OrderedEnumerable<T>(this, keySelector, true);
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
							var draw = (Math.random() * totalWeight)|0 + 1;

							var lower = -1 | 0;
							var upper = sortedByBound.length;
							while (upper - lower > 1) {
								var index = ((lower + upper) / 2) | 0;
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

		groupBy<TKey, TElement, TCompare>(
			keySelector: Selector<T, TKey>,
			elementSelector: Selector<T, TElement> = Functions.Identity,
			compareSelector?: Selector<TKey, TCompare>): Enumerable<IGrouping<TKey, TElement>>
		{
			var _ = this;
			return new Enumerable<IGrouping<TKey, TElement>>(
				() => _.toLookup(keySelector, elementSelector, compareSelector)
					.getEnumerator());
		}


		partitionBy<TKey, TElement, TCompare>(
			keySelector: Selector<T, TKey>,
			elementSelector: Selector<T, TElement> = Functions.Identity,
			resultSelector: (key: TKey, element: TElement[]) => IGrouping<TKey, TElement>
			= (key: TKey, elements: TElement[]) => new Grouping<TKey, TElement>(key, elements),
			compareSelector: Selector<TKey, TCompare> = Functions.Identity): Enumerable<IGrouping<TKey, TElement>>
		{

			var _ = this;

			return new Enumerable<IGrouping<TKey, TElement>>(() =>
			{
				var enumerator: IEnumerator<T>;
				var key: TKey;
				var compareKey: TCompare;
				var group: TElement[] = [];

				return new EnumeratorBase<IGrouping<TKey, TElement>>(
					() =>
					{
						enumerator = _.getEnumerator();
						if (enumerator.moveNext())
						{
							key = keySelector(enumerator.current);
							compareKey = compareSelector(key);
							group.push(elementSelector(enumerator.current));
						}
					},
					yielder =>
					{
						var hasNext: boolean;

						while ((hasNext = enumerator.moveNext()))
						{
							if (compareKey === compareSelector(keySelector(enumerator.current)))
								group.push(elementSelector(enumerator.current));
							else break;
						}

						if (group.length)
						{
							var result: IGrouping<TKey, TElement>
								= resultSelector(key, group);

							if (hasNext)
							{
								key = keySelector(enumerator.current);
								compareKey = compareSelector(key);
								group = [elementSelector(enumerator.current)];
							}
							else
								group = [];

							return yielder.yieldReturn(result);
						}

						return false;
					},
					() => { System.dispose(enumerator); });
			});
		}

		// #endregion

		buffer(size: number): IEnumerable<T[]>
		{
			if (size < 1 || !isFinite(size))
				throw new Error("Invalid buffer size.");

			assertInteger(size, "size");

			var _ = this;

			return new Enumerable<T[]>(() =>
			{
				var enumerator: IEnumerator<T>;
				return new EnumeratorBase<T[]>(
					() => { enumerator = _.getEnumerator(); },
					yielder =>
					{
						var array: T[] = [];
						while (array.length < size && enumerator.moveNext)
						{
							array.push(enumerator.current);
						}

						return array.length && yielder.yieldReturn(array);
					},
					() => { System.dispose(enumerator); });
			});
		}

		// #region Aggregate Methods 

		aggregate(
			func: (a: T, b: T) => T,
			seed?: T)
		{
			return this.scan(func, seed).lastOrDefault();
		}

		average(selector: Selector<T, number> = numberOrNaN): number
		{
			var sum = 0;
			// This allows for infinity math that doesn't destroy the other values.
			var sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

			var count = 0; // No need to make integer if the result could be a float.

			this.forEach(function (x)
			{
				var value = selector(x);
				if (!isNaN(value))
				{
					sum = NaN;
					return false;
				}
				if (isFinite(value))
					sum += value;
				else
					sumInfinite += value > 0 ? (+1) : (-1);
				++count;
			});

			if (sumInfinite) // Not zero?
				return sumInfinite * Infinity;

			return (isNaN(sum) || !count)
				? NaN
				: (sum / count);
		}

		// If using numbers, it may be useful to call .takeUntil(v=>v==Infinity,true) before calling max. See static versions for numbers.
		max(): T
		{
			return this.aggregate(Functions.Greater);
		}

		min(): T
		{
			return this.aggregate(Functions.Lesser);
		}

		maxBy<TCompare>(keySelector: Selector<T, TCompare> = Functions.Identity): T
		{
			return this.aggregate((a: T, b: T) => (keySelector(a) > keySelector(b)) ? a : b);
		}

		minBy<TCompare>(keySelector: Selector<T, TCompare> = Functions.Identity): T
		{
			return this.aggregate((a: T, b: T) => (keySelector(a) < keySelector(b)) ? a : b);
		}

		// Addition...  Only works with numerical enumerations.
		sum(selector: Selector<T, number> = numberOrNaN): number
		{
			var sum = 0;

			// This allows for infinity math that doesn't destroy the other values.
			var sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

			this.forEach(x=>
			{
				var value = selector(x);
				if (!isNaN(value))
				{
					sum = NaN;
					return false;
				}
				if (isFinite(value))
					sum += value;
				else
					sumInfinite += value > 0 ? (+1) : (-1);
			});

			return isNaN(sum) ? NaN : (sumInfinite ? sum : (sumInfinite * Infinity));
		}

		// Multiplication...
		product(selector: Selector<T, number> = numberOrNaN): number
		{
			var result = 1, exists: boolean = false;

			this.forEach(x=>
			{
				exists = true;
				var value = selector(x);
				if (!isNaN(value))
				{
					result = NaN;
					return false;
				}

				if (value == 0)
				{
					result = 0; // Multiplying by zero will always end in zero.
					return false;
				}

				// Multiplication can never recover from infinity and simply must retain signs.
				// You could cancel out infinity with 1/infinity but no available representation exists.
				result *= value;
			});

			return (exists && isNaN(result)) ? NaN : result;
		}
		// #endregion

		// #region Single Value Return...

		elementAt(index: number): T
		{
			if (isNaN(index) || index < 0 || !isFinite(index))
				throw new Error("'index' is invalid or out of bounds.");

			assertInteger(index, "index");
			var n: number = index | 0;

			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach((x: T, i: number) =>
			{
				if (i == n)
				{
					value = x;
					found = true;
					return false;
				}
			});

			if (!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
			return value;
		}

		elementAtOrDefault(index: number, defaultValue: T = null): T
		{

			if (isNaN(index) || index < 0 || !isFinite(index))
				throw new Error("'index' is invalid or out of bounds.");

			assertInteger(index, "index");
			var n: number = index | 0;

			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach((x: T, i: number) =>
			{
				if (i == n)
				{
					value = x;
					found = true;
					return false;
				}
			});

			return (!found) ? defaultValue : value;
		}

		/* Note: Unlike previous implementations, you could pass a predicate into these methods.
		 * But since under the hood it ends up calling .where(predicate) anyway,
		 * it may be better to remove this to allow for a cleaner signature/override.
		 * JavaScript/TypeScript does not easily allow for a strict method interface like C#.
		 * Having to write extra override logic is error prone and confusing to the consumer.
		 * Removing the predicate here may also cause the consumer of this method to think more about how they structure their query.
		 * The end all difference is that the user must declare .where(predicate) before .first().
		 * */

		first(): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x =>
			{
				value = x;
				found = true;
				return false;
			});

			if (!found) throw new Error("first:No element satisfies the condition.");
			return value;
		}

		firstOrDefault(defaultValue: T = null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach(x =>
			{
				value = x;
				found = true;
				return false;
			});
			return (!found) ? defaultValue : value;
		}

		last(): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x =>
			{
				found = true;
				value = x;
			});

			if (!found) throw new Error("last:No element satisfies the condition.");
			return value;
		}

		lastOrDefault(defaultValue: T = null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=>
			{
				found = true;
				value = x;
			});
			return (!found) ? defaultValue : value;
		}

		single(): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=>
			{
				if (!found)
				{
					found = true;
					value = x;
				} else throw new Error("single:sequence contains more than one element.");
			});

			if (!found) throw new Error("single:No element satisfies the condition.");
			return value;
		}

		singleOrDefault(defaultValue: T = null): T
		{

			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=>
			{
				if (!found)
				{
					found = true;
					value = x;
				} else throw new Error("single:sequence contains more than one element.");
			});

			return (!found) ? defaultValue : value;
		}
		// #endregion

		share(): Enumerable<T>
		{
			var _ = this;
			_.assertIsNotDisposed();

			var sharedEnumerator: IEnumerator<T>;
			return new Enumerable<T>(() =>
			{
				return new EnumeratorBase<T>(
					() =>
					{
						// assertIsNotDisposed(disposed);  This doesn't need an assertion since disposing the underlying enumerable disposes the enumerator.

						if (!sharedEnumerator)
							sharedEnumerator = _.getEnumerator();
					},
					yielder =>
						sharedEnumerator.moveNext()
						&& yielder.yieldReturn(sharedEnumerator.current)
					);
			},
				() =>
				{
					System.dispose(sharedEnumerator);
				});
		}


		memoize(): Enumerable<T>
		{
			var _ = this, disposed: boolean = !_.assertIsNotDisposed();

			var cache: T[];
			return new Enumerable<T>(() =>
			{

				var enumerator: IEnumerator<T>;
				var index: number = INT_0;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);

						if (!enumerator)
							enumerator = _.getEnumerator();
						if (!cache)
							cache = [];
						index = INT_0;
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						var i = index++;

						if (i >= cache.length)
						{
							return (enumerator.moveNext())
								? yielder.yieldReturn(cache[i] = enumerator.current)
								: false;
						}

						return yielder.yieldReturn(cache[i]);
					});
			},
				() =>
				{
					disposed = true;
					if (cache)
						cache.length = 0;
					cache = null;
				});
		}

		// #region Error Handling
		catchError(handler: (e: Error) => void): Enumerable<T>
		{
			var _ = this, disposed = !_.assertIsNotDisposed();
			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						try
						{
							assertIsNotDisposed(disposed);
							enumerator = _.getEnumerator();
						} catch (e)
						{
							// Don't init...
						}
					},
					yielder =>
					{
						try
						{
							assertIsNotDisposed(disposed);
							if (enumerator.moveNext())
								return yielder.yieldReturn(enumerator.current);
						} catch (e)
						{
							handler(e);
						}
						return false;
					},
					() => { System.dispose(enumerator); }
					);
			});
		}

		finallyAction(action: () => void): Enumerable<T>
		{
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: false;
					},
					() =>
					{
						try
						{
							System.dispose(enumerator);
						} finally
						{
							action();
						}
					});
			});
		}
		// #endregion

		// #endregion
	}

	// #region Supporting Classes
	// The following classes have to be inside the same module definition since they reference eachother.

	export class ArrayEnumerable<T> extends Enumerable<T> {

		private _source: { length: number;[x: number]: T; };

		constructor(source: System.Collections.IArray<T>)
		{
			var _ = this;
			_._source = source;
			super(() =>
			{
				_.assertIsNotDisposed();
				return new System.Collections.ArrayEnumerator<T>(() =>
				{
					_.assertIsNotDisposed("The underlying ArrayEnumerable was disposed.");

					return _._source; // Could possibly be null, but ArrayEnumerable if not disposed simply treats null as empty array.
				});
			});
		}

		_onDispose(): void
		{
			super._onDispose();
			this._source = <any>null;
		}

		get source(): IArray<T> { return this._source; }

		toArray(): T[]
		{
			var s = this.source;
			if (!s)
				return [];

			if (s instanceof Array)
				return (<Array<T>>s).slice();

			var len = s.length, result: T[] = new Array<T>(len);
			for (var i = INT_0; i < len; ++i)
			{
				result[i] = s[i];
			}

			return result;
		}

		asEnumerable(): ArrayEnumerable<T>
		{
			return new ArrayEnumerable<T>(this._source);
		}

		// Optimize forEach so that subsequent usage is optimized.
		forEach(action: (element: T, index?: number) => boolean): void;
		forEach(action: (element: T, index?: number) => void): void;
		forEach(action: (element: T, index?: number) => any): void
		{

			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			if (source)
			{

				// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
				for (var i = INT_0; i < source.length; ++i)
				{
					// _.assertIsNotDisposed(); // Assertion here is unncessary since we already have a reference to the source array.
					if (action(source[i], i) === false)
						break;
				}
			}
		}

		// These methods should ALWAYS check for array length before attempting anything.

		any(predicate?: Predicate<T>): boolean
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source, len = source ? source.length : 0;
			return len && (!predicate || super.any(predicate));
		}

		count(predicate?: Predicate<T>): number
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source, len = source ? source.length : 0;
			return len && (predicate ? super.count(predicate) : len);
		}

		elementAt(index: number): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			return (index < source.length && index >= 0)
				? source[index]
				: super.elementAt(index);
		}

		elementAtOrDefault(index: number, defaultValue: T = null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			return (index < source.length && index >= 0)
				? source[index]
				: defaultValue;
		}

		first(): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			return (source && source.length)
				? source[0]
				: super.first();
		}

		firstOrDefault(defaultValue: T= null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			return (source && source.length)
				? source[0]
				: defaultValue;
		}

		last(): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source, len = source.length;
			return (len)
				? source[len - 1]
				: super.last();
		}

		lastOrDefault(defaultValue: T= null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source, len = source.length;
			return len
				? source[len - 1]
				: defaultValue;
		}

		skip(count: number): Enumerable<T>
		{

			var _ = this;

			if (!count || count < 0) // Out of bounds? Simply return a unfiltered enumerable.
				return _.asEnumerable();

			return new Enumerable<T>(
				() => new System.Collections.ArrayEnumerator<T>(
					() => _._source, count));
		}

		takeExceptLast(count: number = 1): Enumerable<T>
		{
			var _ = this, len = _._source ? _._source.length : 0;
			return _.take(len - count);
		}

		takeFromLast(count: number): Enumerable<T>
		{
			if (!count || count < 0) return Enumerable.empty<T>();
			var _ = this, len = _._source ? _._source.length : 0;
			return _.skip(len - count);
		}

		reverse(): Enumerable<T>
		{
			var _ = this;

			return new Enumerable<T>(
				() => new System.Collections.ArrayEnumerator<T>(
					() => _._source, _._source ? (_._source.length - 1) : 0, -1));
		}

		memoize(): ArrayEnumerable<T>
		{
			return new ArrayEnumerable<T>(this._source);
		}

		sequenceEqual(second: IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
		sequenceEqual(second: IArray<T>, equalityComparer?: (a: T, b: T) => boolean): boolean;
		sequenceEqual(second: any, equalityComparer: (a: T, b: T) => boolean = System.areEqual): boolean
		{
			if (second instanceof Array)
				return ArrayUtility.areEqual(this.source, <IArray<T>>second, true, equalityComparer);

			if (second instanceof ArrayEnumerable)
				return (<ArrayEnumerable<T>>second).sequenceEqual(this.source, equalityComparer);

			return super.sequenceEqual(second, equalityComparer);
		}


		toJoinedString(separator: string = "", selector: Selector<T, string> = Functions.Identity)
		{
			var s = this._source;
			return !selector && s instanceof Array
				? (<Array<T>>s).join(separator)
				: super.toJoinedString(separator, selector);
		}

	}


	export class WhereEnumerable<T> extends Enumerable<T> {
		constructor(
			private prevSource: IEnumerable<T>,
			private prevPredicate: Predicate<T>  // predicate.length always <= 1
			)
		{
			super(null);
		}

		where(predicate: Predicate<T>): Enumerable<T>
		{

			if (predicate.length > 1)
				return super.where(predicate);

			var prevPredicate = this.prevPredicate;
			var composedPredicate = (x: T) => prevPredicate(x) && predicate(x);
			return new WhereEnumerable<T>(this.prevSource, composedPredicate);
		}

		select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>
		{

			if (selector.length > 1)
				return super.select(selector);

			return new WhereSelectEnumerable<T, TSelect>(
				this.prevSource,
				this.prevPredicate,
				selector);
		}

		getEnumerator(): IEnumerator<T>
		{
			var predicate = this.prevPredicate;
			var source = this.prevSource;
			var enumerator: IEnumerator<T>;

			return new System.Collections.EnumeratorBase<T>(
				() => { enumerator = source.getEnumerator(); },
				yielder =>
				{
					while (enumerator.moveNext())
					{
						if (predicate(enumerator.current))
							return yielder.yieldReturn(enumerator.current);
					}

					return false;
				},
				() => { System.dispose(enumerator); }
				);
		}

		_onDispose(): void
		{
			super._onDispose();
			this.prevPredicate = null;
			this.prevSource = null;
		}
	}


	export class WhereSelectEnumerable<TSource, T> extends Enumerable<T> {
		constructor(
			private prevSource: IEnumerable<TSource>,
			private prevPredicate: Predicate<TSource>,  // predicate.length always <= 1
			private prevSelector: Selector<TSource, T> // selector.length always <= 1
			)
		{
			super(null);
		}

		where(predicate: (value: T, index?: number) => boolean): Enumerable<T>
		{
			if (predicate.length > 1)
				return super.where(predicate);

			return new WhereEnumerable<T>(this, predicate);
		}

		select<TSelect>(selector: Selector<T, TSelect>): Enumerable<TSelect>
		{

			if (selector.length > 1)
				// if selector use index, can't compose
				return super.select(selector);

			var _ = this;
			var prevSelector = _.prevSelector;
			var composedSelector = (x: TSource) => selector(prevSelector(x));
			return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
		}

		getEnumerator(): IEnumerator<T>
		{
			var _ = this,
				predicate = _.prevPredicate,
				source = _.prevSource,
				selector: Selector<TSource, T> = _.prevSelector, // Type definition needed for correct inferrence.
				enumerator: IEnumerator<TSource>;

			return new EnumeratorBase<T>(
				() => { enumerator = source.getEnumerator(); },
				yielder =>
				{
					while (enumerator.moveNext())
					{
						var c = enumerator.current;
						if (predicate == null || predicate(c))
						{
							return yielder.yieldReturn(selector(c));
						}
					}
					return false;
				},
				() => { System.dispose(enumerator); }
				);
		}

		_onDispose(): void
		{
			var _ = this;
			super._onDispose();
			_.prevPredicate = null;
			_.prevSource = null;
			_.prevSelector = null;
		}
	}


	export class OrderedEnumerable<T> extends Enumerable<T>
	{

		constructor(
			private source: IEnumerable<T>,
			public keySelector: (value: T) => any,
			public descending: boolean,
			public parent?: OrderedEnumerable<T>)
		{
			super(null);
		}

		createOrderedEnumerable(keySelector: (value: T) => any, descending: boolean): OrderedEnumerable<T>
		{
			return new OrderedEnumerable<T>(this.source, keySelector, descending, this);
		}

		thenBy(keySelector: (value: T) => any): OrderedEnumerable<T>
		{
			return this.createOrderedEnumerable(keySelector, false);
		}
		thenByDescending(keySelector: (value: T) => any): OrderedEnumerable<T>
		{
			return this.createOrderedEnumerable(keySelector, true);
		}
		getEnumerator(): System.Collections.EnumeratorBase<T>
		{
			var _ = this;
			var buffer: T[];
			var indexes: number[];
			var index = INT_0;

			return new System.Collections.EnumeratorBase<T>(
				() =>
				{
					buffer = [];
					indexes = [];
					Enumerable.forEach(_.source, (item, index) =>
					{
						buffer.push(item);
						indexes.push(index);
					});
					var sortContext = SortContext.create(_);
					sortContext.generateKeys(buffer);

					indexes.sort((a, b) => sortContext.compare(a, b));
				},
				yielder =>
				{
					return (index < indexes.length)
						? yielder.yieldReturn(buffer[indexes[index++]])
						: false;
				},
				() =>
				{
					if (buffer)
						buffer.length = 0;
					buffer = null;
					if (indexes)
						indexes.length = 0;
					indexes = null;
				}
				);
		}
		_onDispose(): void
		{
			super._onDispose();
			this.source = null;
			this.keySelector = null;
			this.descending = null;
			this.parent = null;
		}
	}

	class SortContext<T, TOrderBy> {

		keys: TOrderBy[];

		constructor(
			public keySelector: (value: T) => TOrderBy,
			public descending: boolean,
			public child: SortContext<T, TOrderBy>)
		{
			this.keys = null;
		}

		static create<T, TOrderBy>(
			orderedEnumerable: OrderedEnumerable<T>,
			currentContext: SortContext<T, TOrderBy> = null)
			: SortContext<T, TOrderBy>
		{
			var context: SortContext<T, TOrderBy>
				= new SortContext<T, TOrderBy>(
					orderedEnumerable.keySelector,
					orderedEnumerable.descending,
					currentContext);

			if (orderedEnumerable.parent)
				return SortContext.create(orderedEnumerable.parent, context);

			return context;
		}

		generateKeys(source: IArray<T>): void
		{
			var _ = this;
			var len = source.length | 0;
			var keySelector: (value: T) => TOrderBy = _.keySelector;
			var keys = new Array<TOrderBy>(len);
			for (var i = INT_0; i < len; ++i)
			{
				keys[i] = keySelector(source[i]);
			}
			_.keys = keys;

			if (_.child)
				_.child.generateKeys(source);
		}

		compare(index1: number, index2: number): number
		{
			var _ = this, keys = _.keys;
			var comparison = System.compare(keys[index1], keys[index2]);

			if (comparison == 0)
			{
				var child = _.child;
				return child
					? child.compare(index1, index2)
					: System.compare(index1, index2);
			}

			return _.descending ? -comparison : comparison;
		}
	}


	export interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>>
	{
		count: number;
		get(key: TKey): TElement[];
		contains(key: TKey): boolean;
	}

	export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {

		constructor(private _dictionary: System.Collections.Dictionary<TKey, TElement[]>) { }

		get count(): number
		{
			return this._dictionary.count;
		}

		get(key: TKey): TElement[]
		{
			return this._dictionary.get(key);
		}

		contains(key: TKey): boolean
		{
			return this._dictionary.containsKey(key);
		}

		getEnumerator(): IEnumerator<Grouping<TKey, TElement>>
		{

			var _ = this;
			var enumerator: IEnumerator<System.Collections.IKeyValuePair<TKey, TElement[]>>;

			return new System.Collections.EnumeratorBase<Grouping<TKey, TElement>>(
				() => { enumerator = _._dictionary.getEnumerator(); },
				yielder =>
				{

					if (!enumerator.moveNext())
						return false;

					var current = enumerator.current;

					return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
				},
				() => { System.dispose(enumerator); }
				);
		}

	}


	export interface IGrouping<TKey, TElement> extends IEnumerable<TElement>
	{
		key: TKey;
	}

	export class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement>
	{

		constructor(private _groupKey: TKey, elements: TElement[])
		{
			super(elements);
		}

		get key(): TKey
		{
			return this._groupKey;
		}
	}

	// #endregion

}

