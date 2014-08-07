///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

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
	// #endregion

	// #region Helper Functions...
	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
	function assertIsNotDisposed(disposed: boolean): boolean {
		return DisposableBase.assertIsNotDisposed(disposed, "Enumerable was disposed.");
	}

	function numberOrNaN(value: any): number
	{
		return isNaN(value) ? NaN : value;
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

			if (source instanceof Array || typeof source == System.Types.Object && "length" in source)
				return Enumerable.fromArray<T>(source);

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
				var index: number;
				return new EnumeratorBase<T>(
					() => { index = 0 },
					yielder =>
					{
						if (index >= values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					});
			});
		}

		static empty<T>(): Enumerable<T>
		{
			return new Enumerable<T>(() =>
			{
				return new EnumeratorBase<T>(
					null,
					Functions.False);
			});
		}

		static repeat<T>(element: T, count: number = Infinity): Enumerable<T>
		{
			if (isNaN(count) || count <= 0)
				return Enumerable.empty<T>();

			return new Enumerable<T>(() =>
			{
				var index: number;

				return new EnumeratorBase<T>(
					() => { index = 0 },
					yielder =>
					{
						return (index++ < count)
							? yielder.yieldReturn(element)
							: false;
					});
			});
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
			return Enumerable.repeat<T>(element, 1);
		}

		static range(
			start: number,
			count: number,
			step?: number): Enumerable<number>
		{

			if (!count)
				return Enumerable.empty<number>();

			if (!step)
				step = 1;

			return new Enumerable<number>(() =>
			{
				var value: number;
				var index: number;

				return new EnumeratorBase<number>(
					() =>
					{
						index = 0;
						value = start - step;
					},
					yielder =>
					{
						return (index++ < count)
							? yielder.yieldReturn(value += step)
							: yielder.yieldBreak();
					});
			});
		}

		static rangeDown(
			start: number,
			count: number,
			step?: number): Enumerable<number>
		{
			if (!step) step = -1;
			else step *= -1;

			return Enumerable.range(start, count, step);
		}

		static toInfinity(start?: number, step?: number): Enumerable<number>
		{
			return Enumerable.rangeTo(start, Infinity, step);
		}

		static toNegativeInfinity(start?: number, step?: number): Enumerable<number>
		{
			return Enumerable.rangeTo(start, -Infinity, step);
		}

		static rangeTo(
			start: number,
			to: number,
			step?: number): Enumerable<number>
		{
			if (!start) start = 0;
			if (!step) step = 1;
			step = Math.abs(step);

			return new Enumerable<number>(() =>
			{
				var value: number;

				return start < to
					? new EnumeratorBase<number>(
						() => { value = start - step },
						yielder =>
						{
							var next = value += step;
							return (next <= to)
								? yielder.yieldReturn(next)
								: yielder.yieldBreak();
						}
						)
					: new EnumeratorBase<number>(
						() => { value = start + step },
						yielder =>
						{
							var next = value -= step;
							return (next >= to)
								? yielder.yieldReturn(next)
								: yielder.yieldBreak();
						}
						);
			});
		}

		static matches(input: string, pattern: any, flags: string = ""): Enumerable<RegExpExecArray>
		{

			var type = typeof input;
			if (type != Types.String)
				throw new Error("Cannot exec RegExp matches of type '" + type+"'.");

			if (pattern instanceof RegExp)
			{
				flags += (pattern.ignoreCase) ? "i" : "";
				flags += (pattern.multiline) ? "m" : "";
				pattern = pattern.source;
			}

			if (flags.indexOf("g") === -1) flags += "g";

			var len = input.length;

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

		static generate<T>(factory: (index?: number) => T, count?: number): Enumerable<T>
		{

			if (typeof count == Types.Number && (count <= 0 || isNaN(count)))
				return Enumerable.empty<T>();

			if (!count)
				count = Infinity;

			return new Enumerable<T>(() =>
			{
				var index: number;

				return new EnumeratorBase<T>(
					() => { index = 0; },
					yielder =>
					{
						var current = index++;
						return (current < count)
							? yielder.yieldReturn(factory(current))
							: false;
					});
			});
		}

		static unfold<T>(seed: T, valueFactory: Selector<T, T>): Enumerable<T>
		{
			return new Enumerable<T>(() =>
			{
				var index: number;
				var value: T;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
						value = seed;
					},
					yielder =>
					{
						value = valueFactory(value, index++);
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
					yielder =>
					{
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: yielder.yieldBreak();
					},
					() => { enumerator.dispose(); }
					);
			});
		}


		// ES5: Array's have forEach and if an Enumerable version is necessary, then call Enumerable.fromArray([]) first.
		static forEach<T>(
			enumerable: IEnumerable<T>,
			action: (element: T, index?: number) => any): void
		{
			var _ = enumerable;

			var index = 0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			using(_.getEnumerator(), e=>
			{
				while (e.moveNext() && action(e.current, index++) !== false) { }
			});
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

			var index = 0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			using(_.getEnumerator(), e=>
			{
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while (_.assertIsNotDisposed() && e.moveNext() && action(e.current, index++) !== false) { }
			});
		}

		// #region Conversion Methods
		toArray(predicate?: Predicate<T>): T[]
		{
			var result: T[] = [];

			if (predicate) return this.where(predicate).toArray();

			this.forEach(x=> result.push(x));

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
			this.forEach(x=> dict.addByKeyValue(keySelector(x), elementSelector(x)))
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
				var index: number;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = 0; enumerator = _.getEnumerator();
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
					() => { enumerator.dispose(); }
					);

			},
				// Using a finalizer value reduces the chance of a circular reference since we could simply reference the enueration and check e.wasDisposed.
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

			this.assertIsNotDisposed();

			return (!count || count < 0) // Out of bounds? Simply return a unfiltered enumerable.
				? this.asEnumerable()
				: this.doAction(
					(element: T, index: number)
						=> index < count
						? EnumerableAction.Skip
						: EnumerableAction.Return);
		}

		skipWhile(predicate: Predicate<T>)
		{

			this.assertIsNotDisposed();

			var skipping: boolean = true;

			return this.doAction(
				(element: T, index: number)
					=>
				{
					if (skipping)
						skipping = predicate(element, index);

					return skipping ? EnumerableAction.Skip : EnumerableAction.Return;
				});
		}

		take(count: number): Enumerable<T>
		{
			this.assertIsNotDisposed();

			// Once action returns false, the enumeration will stop.
			return (!count || count < 0)  // Out of bounds? Simply return an empty enumerable.
				? Enumerable.empty<T>()
				: this.doAction((element: T, index: number) => index < count);
		}

		takeExceptLast(count: number = 1): Enumerable<T>
		{
			var _ = this;

			return new Enumerable<T>(() =>
			{
				if (count <= 0) return _.getEnumerator(); // do nothing different.

				var enumerator: IEnumerator<T>;
				var q: T[];

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						q = [];
					},
					yielder =>
					{
						while (enumerator.moveNext())
						{
							// Add the next one to the queue.
							q.push(enumerator.current);

							// Did we reach our quota?
							if (q.length > count)
								// Okay then, start returning results.
								return yielder.yieldReturn(q.shift());
						}
						return false;
					},
					() => { enumerator.dispose(); });
			});
		}

		takeFromLast(count: number): Enumerable<T>
		{
			if (!count || count < 0) return Enumerable.empty<T>();
			var _ = this;

			return new Enumerable<T>(() =>
			{
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						var q: T[] = [];
						using(_.getEnumerator(), e=>
						{
							// Enumerate to the end of the source collection and queue the results up to length-count.
							while (e.moveNext())
							{
								if (q.length == count) q.shift();
								q.push(e.current);
							}
						});
						enumerator = Enumerable.fromArray(q).getEnumerator();
					},
					yielder => enumerator.moveNext() && yielder.yieldReturn(enumerator.current),
					() => { enumerator.dispose(); });
			});
		}
		// #endregion

		// #region Projection and Filtering Methods

		traverseBreadthFirst(func: (element: any) => IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any> {
			var _ = this;

			return new Enumerable<any>(() => {
				var enumerator: IEnumerator<any>;
				var nestLevel:number = 0;
				var buffer:any[] = [];

				return new EnumeratorBase<any>(
					() => { enumerator = _.getEnumerator(); },
					yielder => {
						while (true) {
							if (enumerator.moveNext()) {
								buffer.push(enumerator.current);
								return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							var next = Enumerable.fromArray<T>(buffer)
								.selectMany( (x:any) => func(x) );
							if (!next.any()) {
								return false;
							}
							else {
								nestLevel++;
								buffer = [];
								enumerator.dispose();
								enumerator = next.getEnumerator();
							}
						}
					},
					() => { enumerator.dispose(); });
			});
		}


		traverseDepthFirst(func: (element: any) => IEnumerable<any>, resultSelector?: (element: any, nestLevel?: number) => any): Enumerable<any> {
			var _ = this;

			return new Enumerable<any>(() => {
				var enumeratorStack: IEnumerator<any>[] = [];
				var enumerator:IEnumerator<any>;

				return new EnumeratorBase<T>(
					() => { enumerator = _.getEnumerator(); },
					yielder => {
						while (true) {
							if (enumerator.moveNext()) {
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
					() => {
						try {
							enumerator.dispose();
						}
						finally {
							enumeratorStack.forEach(s => s.dispose() );
						}
					});
			});
		}
		

		flatten(): Enumerable<any> {
			var _ = this;

			return new Enumerable<any>(() => {
				var enumerator:IEnumerator<any>;
				var middleEnumerator: IEnumerator<any> = null;

				return new EnumeratorBase<T>(
					() => { enumerator = _.getEnumerator(); },
					yielder => {
						while (true) {
							if (middleEnumerator != null) {
								if (middleEnumerator.moveNext()) {
									return yielder.yieldReturn(middleEnumerator.current);
								}
								else {
									middleEnumerator = null;
								}
							}

							if (enumerator.moveNext())
							{
								var c = enumerator.current;
								if (c instanceof Array) {
									middleEnumerator.dispose();
									middleEnumerator = Enumerable.fromArray<any>(c)
										.selectMany(Functions.Identity)
										.flatten()
										.getEnumerator();
									continue;
								}
								else {
									return yielder.yieldReturn(enumerator.current);
								}
							}

							return false;
						}
					},
					() =>
					{
						try
						{
							enumerator.dispose();
						}
						finally
						{
							middleEnumerator.dispose();
						}

					});
			});
		}
		

		pairwise<TSelect>(selector: (prev: T, current: T) => TSelect): Enumerable<TSelect> {
			var _ = this;

			return new Enumerable<TSelect>(() => {
				var enumerator : IEnumerator<T>;

				return new EnumeratorBase<TSelect>(
					() => {
						enumerator = _.getEnumerator();
						enumerator.moveNext();
					},
					yielder => {
						var prev = enumerator.current;
						return enumerator.moveNext()
							&& yielder.yieldReturn(selector(prev, enumerator.current));
					},
					() => { enumerator.dispose(); });
			});
		}

		scan(func: (a: T, b: T) => T, seed?: T): Enumerable<T> {

			var isUseSeed = seed!==undefined; // For now...
			var _ = this;

			return new Enumerable<T>(() => {
				var enumerator:IEnumerator<T>;
				var value:T;
				var isFirst:boolean;

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
					() => { enumerator.dispose(); });
			});
		} 
		// #endregion


		select<TResult>(selector: Selector<T,TResult>): Enumerable<TResult>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			if (selector.length < 2)
				return new WhereSelectEnumerable(_, null, selector);

			return new Enumerable<TResult>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},
					yielder =>
					{
						assertIsNotDisposed(disposed);

						return enumerator.moveNext()
							? yielder.yieldReturn(selector(enumerator.current, index++))
							: false;
					},
					() => { enumerator.dispose(); }
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
				var index: number;

				return new EnumeratorBase<TResult>(
					() =>
					{
						enumerator = _.getEnumerator();
						middleEnumerator = undefined;
						index = 0;
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
						try
						{
							enumerator.dispose();
							enumerator = null;
						}
						finally
						{
							if (middleEnumerator)
								middleEnumerator.dispose();
							middleEnumerator = null;
						}
					});
			});
		}

		choose<TResult>(selector: Selector<T, TResult>): Enumerable<TResult>
		{

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<TResult>(() =>
			{
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = 0;
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
					() => { enumerator.dispose(); }
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
				var index: number;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);

						index = 0;
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
					() => { enumerator.dispose(); }
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
						enumerator.dispose();
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
					() => { enumerator.dispose(); }
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
				var index: number;

				return new EnumeratorBase<T>(
					() =>
					{
						assertIsNotDisposed(disposed);
						buffer = _.toArray();
						index = buffer.length;
					},

					yielder =>
						index > 0
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
				var buffer: T[];

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
								(Math.random() * len) | 0, 1 | 0).pop());
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

			var count: number = 0;
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
				this.forEach(()=>
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

		// Originally has an overload for a predicate, but that's a bad idea since this could be an enumeration of functions and therefore fail the intent.
		// Better to chain a where statement first to be more explicit.
		indexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number
		{
			var found: number = -1;

			if (compareSelector)
				this.forEach((x, i) =>
				{
					if (compareSelector(x) === compareSelector(value))
					{
						found = i;
						return false;
					}
				});
			else
				this.forEach((x, i) =>
				{
					// Why?  Because NaN doens't equal NaN. :P
					if (System.areEqual(x, value, true)) 
					{
						found = i;
						return false;
					}
				});

			return found;
		}

		lastIndexOf<TCompare>(value: T, compareSelector?: Selector<T, TCompare>): number
		{
			var result = -1;

			if (compareSelector)
				this.forEach((x, i) =>
				{
					if (compareSelector(x) === compareSelector(value)) result = i;
				});
			else
				this.forEach((x, i) =>
				{
					if (System.areEqual(x,value,true)) result = i;
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
					() => { enumerator.dispose(); }
					);
			});
		}

		/* * /

		zip(second: any[], resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        zip(second: Enumerable, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        zip(second: { length: number;[x: number]: any; }, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        zip(...params: any[]): Enumerable; // last one is selector
        merge(second: any[], resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(second: Enumerable, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(second: { length: number;[x: number]: any; }, resultSelector: (first: any, second: any, index: number) => any): Enumerable;
        merge(...params: any[]): Enumerable; // last one is selector
        join(inner: Enumerable, outerKeySelector: (outer: any) =>any, innerKeySelector: (inner: any) =>any, resultSelector: (outer: any, inner: any) => any, compareSelector?: (obj: any) => any): Enumerable;
        groupJoin(inner: Enumerable, outerKeySelector: (outer: any) =>any, innerKeySelector: (inner: any) =>any, resultSelector: (outer: any, inner: any) => any, compareSelector?: (obj: any) => any): Enumer

		// mutiple arguments, last one is selector, others are enumerable
		zip(...args): Enumerable<T> {
			var selector = Utils.createLambda(arguments[arguments.length - 1]);

			var source = this;
			// optimized case:argument is 2
			if (arguments.length == 2) {
				var second = arguments[0];

				return new Enumerable<T>(() => {
					var firstEnumerator;
					var secondEnumerator;
					var index = 0;

					return new EnumeratorBase<T>(
						() => {
							firstEnumerator = source.getEnumerator();
							secondEnumerator = Enumerable.from(second).getEnumerator();
						},
						() => {
							if (firstEnumerator.moveNext() && secondEnumerator.moveNext()) {
								return (<any>this).yieldReturn(selector(firstEnumerator.current, secondEnumerator.current, index++));
							}
							return false;
						},
						() => {
							try {
								Utils.dispose(firstEnumerator);
							} finally {
								Utils.dispose(secondEnumerator);
							}
						});
				});
			}
			else {
				return new Enumerable<T>(() => {
					var enumerators;
					var index = 0;

					return new EnumeratorBase<T>(
						() => {
							var array = Enumerable.make<T>(source)
								.concat(Enumerable.from<T>(args).takeExceptLast().select(Enumerable.from))
								.select(function (x) { return x.getEnumerator() })
								.toArray();
							enumerators = Enumerable.from(array);
						},
						() => {
							if (enumerators.all(function (x) { return x.moveNext() })) {
								var array = enumerators
									.select(function (x) { return x.current })
									.toArray();
								array.push(index++);
								return (<any>this).yieldReturn(selector.apply(null, array));
							}
							else {
								return (<any>this).yieldBreak();
							}
						},
						() => {
							Enumerable.from(enumerators).forEach(Utils.dispose);
						});
				});
			}
		}

		// mutiple arguments
		merge() {
			var args = arguments;
			var source = this;

			return new Enumerable<T>(() => {
				var enumerators;
				var index = -1;

				return new EnumeratorBase<T>(
					() => {
						enumerators = Enumerable.make(source)
							.concat(Enumerable.from(args).select(Enumerable.from))
							.select(function (x) { return x.getEnumerator() })
							.toArray();
					},
					() => {
						while (enumerators.length > 0) {
							index = (index >= enumerators.length - 1) ? 0 : index + 1;
							var enumerator = enumerators[index];

							if (enumerator.moveNext()) {
								return (<any>this).yieldReturn(enumerator.current);
							}
							else {
								enumerator.dispose();
								enumerators.splice(index--, 1);
							}
						}
						return (<any>this).yieldBreak();
					},
					() => {
						Enumerable.from(enumerators).forEach(Utils.dispose);
					});
			});
		}

		// Join Methods

		// Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
		// Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
		join(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
			outerKeySelector = Utils.createLambda(outerKeySelector);
			innerKeySelector = Utils.createLambda(innerKeySelector);
			resultSelector = Utils.createLambda(resultSelector);
			compareSelector = Utils.createLambda(compareSelector);
			var source = this;

			return new Enumerable<T>(() => {
				var outerEnumerator;
				var lookup;
				var innerElements = null;
				var innerCount = 0;

				return new EnumeratorBase<T>(
					() => {
						outerEnumerator = source.getEnumerator();
						lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},
					() => {
						while (true) {
							if (innerElements != null) {
								var innerElement = innerElements[innerCount++];
								if (innerElement !== undefined) {
									return (<any>this).yieldReturn(resultSelector(outerEnumerator.current, innerElement));
								}

								innerElement = null;
								innerCount = 0;
							}

							if (outerEnumerator.moveNext()) {
								var key = outerKeySelector(outerEnumerator.current);
								innerElements = lookup.get(key).toArray();
							} else {
								return false;
							}
						}
					},
					() => { Utils.dispose(outerEnumerator); });
			});
		}

		// Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
		// Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
		groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
			outerKeySelector = Utils.createLambda(outerKeySelector);
			innerKeySelector = Utils.createLambda(innerKeySelector);
			resultSelector = Utils.createLambda(resultSelector);
			compareSelector = Utils.createLambda(compareSelector);
			var source = this;

			return new Enumerable<T>(() => {
				var enumerator = source.getEnumerator();
				var lookup = null;

				return new EnumeratorBase<T>(
					() => {
						enumerator = source.getEnumerator();
						lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},
					() => {
						if (enumerator.moveNext()) {
							var innerElement = lookup.get(outerKeySelector(enumerator.current));
							return (<any>this).yieldReturn(resultSelector(enumerator.current, innerElement));
						}
						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}

			// multiple arguments
	concat(){
			var source = this;

			if (arguments.length == 1) {
				var second = arguments[0];

				return new Enumerable<T>(() => {
					var firstEnumerator;
					var secondEnumerator;

					return new EnumeratorBase<T>(
						() => { firstEnumerator = source.getEnumerator(); },
						() => {
							if (secondEnumerator == null) {
								if (firstEnumerator.moveNext()) return (<any>this).yieldReturn(firstEnumerator.current);
								secondEnumerator = Enumerable.from(second).getEnumerator();
							}
							if (secondEnumerator.moveNext()) return (<any>this).yieldReturn(secondEnumerator.current);
							return false;
						},
						() => {
							try {
								Utils.dispose(firstEnumerator);
							}
							finally {
								Utils.dispose(secondEnumerator);
							}
						});
				});
			}
			else {
				var args = arguments;

				return new Enumerable<T>(() => {
					var enumerators;

					return new EnumeratorBase<T>(
						() => {
							enumerators = Enumerable.make(source)
								.concat(Enumerable.from(args).select(Enumerable.from))
								.select(function (x) { return x.getEnumerator() })
								.toArray();
						},
						() => {
							while (enumerators.length > 0) {
								var enumerator = enumerators[0];

								if (enumerator.moveNext()) {
									return (<any>this).yieldReturn(enumerator.current);
								}
								else {
									enumerator.dispose();
									enumerators.splice(0, 1);
								}
							}
							return (<any>this).yieldBreak();
						},
						() => {
							Enumerable.from(enumerators).forEach(Utils.dispose);
						});
				});
			}
		}

	insert(index, second) {
			var source = this;

			return new Enumerable<T>(() => {
				var firstEnumerator;
				var secondEnumerator;
				var count = 0;
				var isEnumerated = false;

				return new EnumeratorBase<T>(
					() => {
						firstEnumerator = source.getEnumerator();
						secondEnumerator = Enumerable.from(second).getEnumerator();
					},
					() => {
						if (count == index && secondEnumerator.moveNext()) {
							isEnumerated = true;
							return (<any>this).yieldReturn(secondEnumerator.current);
						}
						if (firstEnumerator.moveNext()) {
							count++;
							return (<any>this).yieldReturn(firstEnumerator.current);
						}
						if (!isEnumerated && secondEnumerator.moveNext()) {
							return (<any>this).yieldReturn(secondEnumerator.current);
						}
						return false;
					},
					() => {
						try {
							Utils.dispose(firstEnumerator);
						}
						finally {
							Utils.dispose(secondEnumerator);
						}
					});
			});
		}

		alternate(alternateValueOrSequence) {
			var source = this;

			return new Enumerable<T>(() => {
				var buffer;
				var enumerator;
				var alternateSequence;
				var alternateEnumerator;

				return new EnumeratorBase<T>(
					() => {
						if (alternateValueOrSequence instanceof Array || alternateValueOrSequence.getEnumerator != null) {
							alternateSequence = Enumerable.from(Enumerable.from(alternateValueOrSequence).toArray()); // freeze
						}
						else {
							alternateSequence = Enumerable.make(alternateValueOrSequence);
						}
						enumerator = source.getEnumerator();
						if (enumerator.moveNext()) buffer = enumerator.current;
					},
					() => {
						while (true) {
							if (alternateEnumerator != null) {
								if (alternateEnumerator.moveNext()) {
									return (<any>this).yieldReturn(alternateEnumerator.current);
								}
								else {
									alternateEnumerator = null;
								}
							}

							if (buffer == null && enumerator.moveNext()) {
								buffer = enumerator.current; // hasNext
								alternateEnumerator = alternateSequence.getEnumerator();
								continue; // GOTO
							}
							else if (buffer != null) {
								var retVal = buffer;
								buffer = null;
								return (<any>this).yieldReturn(retVal);
							}

							return (<any>this).yieldBreak();
						}
					},
					() => {
						try {
							Utils.dispose(enumerator);
						}
						finally {
							Utils.dispose(alternateEnumerator);
						}
					});
			});
		}

				// Overload:function(second)
		// Overload:function(second, compareSelector)
		intersect(second, compareSelector) {
			compareSelector = Utils.createLambda(compareSelector);
			var source = this;

			return new Enumerable<T>(() => {
				var enumerator;
				var keys;
				var outs;

				return new EnumeratorBase<T>(
					() => {
						enumerator = source.getEnumerator();

						keys = new Dictionary(compareSelector);
						Enumerable.from(second).forEach(function (key) { keys.add(key); });
						outs = new Dictionary(compareSelector);
					},
					() => {
						while (enumerator.moveNext()) {
							var current = enumerator.current;
							if (!outs.contains(current) && keys.contains(current)) {
								outs.add(current);
								return (<any>this).yieldReturn(current);
							}
						}
						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}
		*/
		sequenceEqual(second: IEnumerable<T>, equalityComparer: (a: T, b: T) => boolean = System.areEqual): boolean
		{
			return using(this.getEnumerator(),
				e1=> using(second.getEnumerator(),
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
			second: IArray<T>,
			compareSelector?: Selector<T, TCompare>): Enumerable<T>;
		union<TCompare>(
			second: IEnumerable<T>,
			compareSelector: Selector<T, TCompare>): Enumerable<T>;
		union<TCompare>(
			second: any,
			compareSelector: Selector<T, TCompare> = Functions.Identity): Enumerable<T>
		{
			var source = this;
			

			return new Enumerable<T>(() => {
				var firstEnumerator: IEnumerator<T>;
				var secondEnumerator: IEnumerator<T>;
				var keys: Dictionary<T, any>;

				return new EnumeratorBase<T>(
					() => {
						firstEnumerator = source.getEnumerator();
						keys = new Dictionary<T,any>(compareSelector);
					},
					yielder => {
						var current:T;
						if (secondEnumerator === undefined) {
							while (firstEnumerator.moveNext()) {
								current = firstEnumerator.current;
								if (!keys.containsKey(current)) {
									keys.addByKeyValue(current,null);
									return yielder.yieldReturn(current);
								}
							}
							secondEnumerator = "getEnumerator" in second
							? second
							: Enumerable.fromArray(second).getEnumerator();
						}
						while (secondEnumerator.moveNext()) {
							current = secondEnumerator.current;
							if (!keys.containsKey(current)) {
								keys.addByKeyValue(current,null);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},
					() => {
						try {
							firstEnumerator.dispose();
						}
						finally {
							secondEnumerator.dispose();
						}
					});
			});
		}
		

		// #region Ordering Methods

		orderBy<TKey>(keySelector:Selector<T,TKey> = Functions.Identity):OrderedEnumerable<T> {
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

							var lower = -1;
							var upper = sortedByBound.length;
							while (upper - lower > 1) {
								var index = ((lower + upper) / 2)|0;
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
			compareSelector: Selector<TKey, TCompare> = Functions.Identity): Enumerable<IGrouping<TKey, TElement>> {

			var _ = this;

			return new Enumerable<IGrouping<TKey, TElement>>(() => {
				var enumerator: IEnumerator<T>;
				var key:TKey;
				var compareKey:TCompare;
				var group: TElement[] = [];

				return new EnumeratorBase<IGrouping<TKey, TElement>>(
					() => {
						enumerator = _.getEnumerator();
						if (enumerator.moveNext()) {
							key = keySelector(enumerator.current);
							compareKey = compareSelector(key);
							group.push(elementSelector(enumerator.current));
						}
					},
					yielder => {
						var hasNext: boolean;

						while ((hasNext = enumerator.moveNext())) {
							if (compareKey === compareSelector(keySelector(enumerator.current)))
								group.push(elementSelector(enumerator.current));
							else break;
						}

						if (group.length > 0)
						{
							var result: IGrouping<TKey, TElement>
								= resultSelector(key, group);

							if (hasNext) {
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
					() => { enumerator.dispose(); });
			});
		}
		
		// #endregion

		buffer(size: number): IEnumerable<T[]>
		{
			if (size < 1)
				throw new Error("Invalid buffer size.");
			var _ = this;

			return new Enumerable<T[]>(() =>
			{
				var enumerator: IEnumerator<T>;
				return new EnumeratorBase<T[]>(
					() => { enumerator = _.getEnumerator(); },
					yielder =>
					{
						var array: T[] = [];
						while (array.length < size && enumerator.moveNext())
							array.push(enumerator.current);

						return array.length && yielder.yieldReturn(array);
					},
					() => { enumerator.dispose(); });
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
			var count = 0;

			this.forEach(function (x)
			{
				var value = selector(x);
				if (!isNaN(value))
				{
					sum = NaN;
					return false;
				}
				sum += value;
				++count;
			});

			return (isNaN(sum) || !count) ? NaN : (sum / count);
		}


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
			return this.aggregate((a: T, b: T) => (keySelector(a) > keySelector(b)) ? a : b );
		}

		minBy<TCompare>(keySelector: Selector<T, TCompare> = Functions.Identity): T
		{
			return this.aggregate((a: T, b: T) => (keySelector(a) < keySelector(b)) ? a : b);
		}

		// Addition...
		sum(selector: Selector<T, number> = numberOrNaN): number
		{
			var sum = 0;

			this.forEach(x=>
			{
				var value = selector(x);
				if (!isNaN(value))
				{
					sum = NaN;
					return false;
				}
				sum += value;
			});

			return isNaN(sum) ? NaN : sum;
		}

		// Multiplication...
		product(selector: Selector<T, number> = numberOrNaN): number
		{
			var result = 1, exists:boolean = false;

			this.forEach(x=>
			{
				exists = true;
				var value = selector(x);
				if (!isNaN(value))
				{
					result = NaN;
					return false;
				}
				result *= value;
			});

			return (exists && isNaN(result)) ? NaN : result;
		}
		// #endregion

		// #region Single Value Return...

		elementAt(index: number): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach((x, i) => {
				if (i == index) {
					value = x;
					found = true;
					return false;
				}
			});

			if (!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
			return value;
		}

		elementAtOrDefault(index: number, defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach((x, i) => {
				if (i == index) {
					value = x;
					found = true;
					return false;
				}
			});

			return (!found) ? defaultValue : value;
		}

		/* Note: Unlike previous implementations, you could pass a predicate into these methods.
		 * But since under the hood it ends up calling .where(predicate) anyway, it may be better to remove this to allow for a cleaner signature/override.
		 * JavaScript/TypeScript does not easily allow for a strict method interface like C#.
		 * Having to write extra override logic is error prone and confusing to the consumer.
		 * Removing the predicate here may also cause the consumer of this method to think more about how they structure their query.
		 * The end all difference is that the user must declare .where(predicate) before .first().
		 * */

		first(): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x => {
				value = x;
				found = true;
				return false;
			});

			if (!found) throw new Error("first:No element satisfies the condition.");
			return value;
		}

		firstOrDefault(defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found = false;
			_.forEach(x => {
				value = x;
				found = true;
				return false;
			});
			return (!found) ? defaultValue : value;
		}

		last(): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x => {
				found = true;
				value = x;
			});

			if (!found) throw new Error("last:No element satisfies the condition.");
			return value;
		}

		lastOrDefault(defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=> {
				found = true;
				value = x;
			});
			return (!found) ? defaultValue : value;
		}

		single(): T {
			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=> {
				if (!found) {
					found = true;
					value = x;
				} else throw new Error("single:sequence contains more than one element.");
			});

			if (!found) throw new Error("single:No element satisfies the condition.");
			return value;
		}

		singleOrDefault(defaultValue: T = null): T {

			var _ = this;
			_.assertIsNotDisposed();

			var value: T;
			var found: boolean = false;
			_.forEach(x=> {
				if (!found) {
					found = true;
					value = x;
				} else throw new Error("single:sequence contains more than one element.");
			});

			return (!found) ? defaultValue : value;
		}
		// #endregion

		share(): Enumerable<T> {
			var _ = this;
			_.assertIsNotDisposed();

			var sharedEnumerator: IEnumerator<T>;
			return new Enumerable<T>(() => {
				return new EnumeratorBase<T>(
					() => {
						// assertIsNotDisposed(disposed);  This doesn't need an assertion since disposing the underlying enumerable disposes the enumerator.

						if (!sharedEnumerator)
							sharedEnumerator = _.getEnumerator();
					},
					yielder => sharedEnumerator.moveNext() && yielder.yieldReturn(sharedEnumerator.current)
					);
			},
				() => {
					// disposed = true;
					if (sharedEnumerator)
						sharedEnumerator.dispose();
				});
		}


		memoize(): Enumerable<T> {
			var _ = this, disposed: boolean = !_.assertIsNotDisposed();

			var cache: T[];
			return new Enumerable<T>(() => {

				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);

						if (!enumerator)
							enumerator = _.getEnumerator();
						if (!cache)
							cache = [];
						index = -1;
					},
					yielder => {
						assertIsNotDisposed(disposed);

						index++;

						if (index >= cache.length) {
							return (enumerator.moveNext())
								? yielder.yieldReturn(cache[index] = enumerator.current)
								: false;
						}

						return yielder.yieldReturn(cache[index]);
					});
			},
				() => {
					disposed = true;
					if (cache)
						cache.length = 0;
					cache = null;
				});
		}

		// #region Error Handling
		catchError(handler: (e: Error) => void): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();
			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						try {
							assertIsNotDisposed(disposed);
							enumerator = _.getEnumerator();
						} catch (e) {
							// Don't init...
						}
					},
					yielder => {
						try {
							assertIsNotDisposed(disposed);
							if (enumerator.moveNext())
								return yielder.yieldReturn(enumerator.current);
						} catch (e) {
							handler(e);
						}
						return false;
					},
					() => { enumerator.dispose(); }
					);
			});
		}

		finallyAction(action: () => void): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: false;
					},
					() => {
						try {
							enumerator.dispose();
						} finally {
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
			super._onDispose
				this._source = null;
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
			for (var i = 0|0; i < len; ++i)
				result[i] = s[i];

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
				for (var i = 0 | 0; i < source.length; ++i)
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

		sequenceEqual(second: IEnumerable<T>, equalityComparer?: (a: T, b: T) => boolean):boolean;
		sequenceEqual(second: IArray<T>, equalityComparer?: (a: T, b: T) => boolean):boolean;
		sequenceEqual(second: any, equalityComparer: (a: T, b: T) => boolean = System.areEqual):boolean
		{
			if (second instanceof Array)
				return ArrayUtility.areEqual(this.source, <IArray<T>>second, true, equalityComparer);

			if (second instanceof ArrayEnumerable)
				return (<ArrayEnumerable<T>>second).sequenceEqual(this.source, equalityComparer);

			return super.sequenceEqual(second, equalityComparer );
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

			return new WhereSelectEnumerable<T,TSelect>(
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
						if (predicate(enumerator.current))
							return yielder.yieldReturn(enumerator.current);

					return false;
				},
				() => { enumerator.dispose(); }
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
			private prevSelector: Selector<TSource,T> // selector.length always <= 1
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
				selector = _.prevSelector,
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
				() => { enumerator.dispose(); }
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
			var index = 0;

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

		static create<T, TOrderBy>(orderedEnumerable: OrderedEnumerable<T>, currentContext: SortContext<T, TOrderBy> = null): SortContext<T, TOrderBy>
		{
			var context: SortContext<T, TOrderBy> = new SortContext<T, TOrderBy>(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
			if (orderedEnumerable.parent)
				return SortContext.create(orderedEnumerable.parent, context);
			return context;
		}

		generateKeys(source: IArray<T>): void
		{
			var _ = this;
			var len = source.length;
			var keySelector: (value: T) => TOrderBy = _.keySelector;
			var keys = new Array<TOrderBy>(len);
			for (var i = 0 | 0; i < len; ++i)
				keys[i] = keySelector(source[i]);
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
				() => { enumerator = _._dictionary.getEnumerator() },
				yielder =>
				{

					if (!enumerator.moveNext())
						return false;

					var current = enumerator.current;

					return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
				},
				() => { enumerator.dispose(); }
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

