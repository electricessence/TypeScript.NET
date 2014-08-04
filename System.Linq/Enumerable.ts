///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	"use strict";

	import Predicate = System.Predicate;
	import Selector = System.Selector;
	import Action = System.Action;

	import IEnumerator = System.Collections.IEnumerator;
	import EnumeratorBase = System.Collections.EnumeratorBase;

	import IEnumerable = System.Collections.IEnumerable;

	import Functions = System.Functions;
	import Types = System.Types;

	export enum EnumerableAction {
		Break,
		Return,
		Skip
	}

	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
	function assertIsNotDisposed(disposed: boolean): boolean {
		return DisposableBase.assertIsNotDisposed(disposed, "Enumerable was disposed.");
	}

	export class Enumerable<T> extends System.DisposableBase implements IEnumerable<T> {

		// Enumerable<T> is an instance class that has useful statics.
		// In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
		// In this case, we use Enumerable<T> as the underlying class that is being chained.
		constructor(private enumeratorFactory: () => IEnumerator<T>, finalizer?: () => void) {
			super(finalizer);
		}

		static fromArray<T>(array:T[]):ArrayEnumerable<T>{
			return new ArrayEnumerable<T>(array);
		}

		// #region IEnumerable<T> Implementation...
		getEnumerator(): IEnumerator<T> {

			this.assertIsNotDisposed();

			return this.enumeratorFactory();
		}
		// #endregion

		// #region IDisposable override...
		_onDispose(): void {
			super._onDispose();
			this.enumeratorFactory = null;
		}
		// #endregion

		//////////////////////////////////////////
		// #region Static Methods...
		static choice<T>(values: T[]): Enumerable<T> 		{
			return new Enumerable<T>(() =>
				new EnumeratorBase<T>(
					null,
					yielder =>
						yielder.yieldReturn(values[Math.floor(Math.random() * values.length)])
					)
				);
		}

		static cycle<T>(values: T[]): Enumerable<T> {
			return new Enumerable<T>(() => {
				var index: number;
				return new EnumeratorBase<T>(
					() => index = 0,
					yielder => {
						if (index >= values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					});
			});
		}

		static empty<T>():Enumerable<T> {
			return new Enumerable<T>(() => {
				return new EnumeratorBase<T>(
					null,
					Functions.False);
			});
		}

		static repeat<T>(element: T, count?: number): Enumerable<T> {
			if (typeof count == Types.Number && (count <= 0 || isNaN(count)))
				return Enumerable.empty<T>();

			if (!count)
				count = Infinity;

			return new Enumerable<T>(() => {
				var index: number;

				return new EnumeratorBase<T>(
					() => index = 0,
					yielder => {
						return (index++ < count)
							? yielder.yieldReturn(element)
							: false;
					});
			});
		}

		static repeatWithFinalize<T>(
			initializer: () => T,
			finalizer: (element: T) => void): Enumerable<T>
		{

			return new Enumerable<T>(() => {
				var element: T;
				return new EnumeratorBase<T>(
					() => element = initializer(),
					yielder => { return yielder.yieldReturn(element); },
					() => {
						if (element != null) {
							finalizer(element);
							element = null;
						}
					});
			});
		}

		static make<T>(element: T): Enumerable<T> {
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

			return new Enumerable<number>(() => {
				var value: number;
				var index: number;

				return new EnumeratorBase<number>(
					() => {
						index = 0;
						value = start - step;
					},
					yielder => {
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

		static toInfinity(start?: number, step?: number): Enumerable<number> {
			return Enumerable.rangeTo(start, Infinity, step);
		}

		static toNegativeInfinity(start?: number, step?: number): Enumerable<number> {
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

			return new Enumerable<number>(() => {
				var value: number;

				return start < to
					? new EnumeratorBase<number>(
						() => value = start - step,
						yielder => {
							var next = value += step;
							return (next <= to)
								? yielder.yieldReturn(next)
								: yielder.yieldBreak();
						}
						)
					: new EnumeratorBase<number>(
						() => value = start + step,
						yielder => {
							var next = value -= step;
							return (next >= to)
								? yielder.yieldReturn(next)
								: yielder.yieldBreak();
						}
						);
			});
		}

		static matches(input: string, pattern: any, flags: string = ""): Enumerable<RegExpExecArray> {

			var type = typeof input;
			if (type != Types.String)
				throw new Error("Cannot exec RegExp matches on type " + type);

			if (pattern instanceof RegExp) {
				flags += (pattern.ignoreCase) ? "i" : "";
				flags += (pattern.multiline) ? "m" : "";
				pattern = pattern.source;
			}

			if (flags.indexOf("g") === -1) flags += "g";

			var len = input.length;

			return new Enumerable<RegExpExecArray>(() => {
				var regex: RegExp;
				return new EnumeratorBase<RegExpExecArray>(
					() => regex = new RegExp(pattern, flags),
					yielder => {
						// Calling regex.exec concecutively on the same input uses the lastIndex to start the next match.
						var match = regex.exec(input);
						return (match!==null) ? yielder.yieldReturn(match) : false;
					});
			});
		}

		static generate<T>(factory: (index?:number) => T, count?: number): Enumerable<T> {

			if (typeof count == Types.Number && (count <= 0 || isNaN(count)))
				return Enumerable.empty<T>();

			if (!count)
				count = Infinity;

			return new Enumerable<T>(() => {
				var index: number;

				return new EnumeratorBase<T>(
					() => index = 0,
					yielder =>
					{
						var current = index++;
						return (current < count)
							? yielder.yieldReturn(factory(current))
							: false;
					});
			});
		}

		static unfold<T>(seed: T, valueFactory: Selector<T,T>): Enumerable<T> {
			return new Enumerable<T>(() => {
				var index: number;
				var value: T;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
						value = seed;
					},
					yielder => {
						value = valueFactory(value,index++);
						return yielder.yieldReturn(value);
					});
			});
		}

		static defer<T>(enumerableFactory: () => IEnumerable<T>): Enumerable<T> {

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => enumerator = enumerableFactory().getEnumerator(),
					yielder => {
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: yielder.yieldBreak();
					},
					() => enumerator.dispose()
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
			System.using(_.getEnumerator(), e=> {
				while (e.moveNext() && action(e.current, index++) !== false) { }
			});
		}


		// #endregion

		//////////////////////////////////////////
		// #region Instance methods...

		assertIsNotDisposed(errorMessage: string = "Enumerable was disposed."): boolean {
			return super.assertIsNotDisposed(errorMessage);
		}

		forEach(action: Predicate<T>): void;
		forEach(action: Action<T>): void;
		forEach(action: (element: T, index?: number) => any): void {

			var _ = this;
			_.assertIsNotDisposed();

			var index = 0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			System.using(_.getEnumerator(), e=> {
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while (_.assertIsNotDisposed() && e.moveNext() && action(e.current, index++) !== false) { }
			});
		}

		// #region Conversion Methods
		toArray(predicate?: Predicate<T>): T[] {
			var result: T[] = [];

			if (predicate) return this.where(predicate).toArray();

			this.forEach(x=> result.push(x));

			return result;
		}

		// Return a default (unfiltered) enumerable.
		asEnumerable(): Enumerable<T> {
			var _ = this;
			return new Enumerable<T>(() => _.getEnumerator());
		}

		/*
		// Overload:function(keySelector)
		// Overload:function(keySelector, elementSelector)
		// Overload:function(keySelector, elementSelector, compareSelector)
		toLookup(keySelector, elementSelector, compareSelector) {
			keySelector = Utils.createLambda(keySelector);
			elementSelector = Utils.createLambda(elementSelector);
			compareSelector = Utils.createLambda(compareSelector);

			var dict = new Dictionary(compareSelector);
			this.forEach(function (x) {
				var key = keySelector(x);
				var element = elementSelector(x);

				var array = dict.get(key);
				if (array !== undefined) array.push(element);
				else dict.add(key, [element]);
			});
			return new Lookup(dict);
		}

		toObject(keySelector, elementSelector) {
			keySelector = Utils.createLambda(keySelector);
			elementSelector = Utils.createLambda(elementSelector);

			var obj = {};
			this.forEach(function (x) {
				obj[keySelector(x)] = elementSelector(x);
			});
			return obj;
		}

		// Overload:function(keySelector, elementSelector)
		// Overload:function(keySelector, elementSelector, compareSelector)
		toDictionary(keySelector, elementSelector, compareSelector) {
			keySelector = Utils.createLambda(keySelector);
			elementSelector = Utils.createLambda(elementSelector);
			compareSelector = Utils.createLambda(compareSelector);

			var dict = new Dictionary(compareSelector);
			this.forEach(function (x) {
				dict.add(keySelector(x), elementSelector(x));
			});
			return dict;
		}

		// Overload:function()
		// Overload:function(replacer)
		// Overload:function(replacer, space)
		toJSONString(replacer, space) {
			if (typeof JSON === Types.Undefined || JSON.stringify == null) {
				throw new Error("toJSONString can't find JSON.stringify. This works native JSON support Browser or include json2.js");
			}
			return JSON.stringify(this.toArray(), replacer, space);
		}

		// Overload:function()
		// Overload:function(separator)
		// Overload:function(separator,selector)
		toJoinedString(separator, selector) {
			if (separator == null) separator = "";
			if (selector == null) selector = Functions.Identity;

			return this.select(selector).toArray().join(separator);
		}/* */

		// #endregion



		// Similar to forEach, but execute's an action for each time a value is enumerated.
		// If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
		// If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
		// This also automatically handles disposing the enumerator.
		doAction(action: Selector<T, EnumerableAction>): Enumerable<T>;
		doAction(action: Selector<T, number>): Enumerable<T>;
		doAction(action: Predicate<T>): Enumerable<T>;
		doAction(action: Action<T>): Enumerable<T>;
		doAction(action: (element: T, index?: number) => any): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);

						index = 0; enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext()) {
							var actionResult = action(enumerator.current, index++);

							if (actionResult === false || actionResult === EnumerableAction)
								return yielder.yieldBreak();

							if (actionResult !== 2)
								return yielder.yieldReturn(enumerator.current);

							// If actionResult===2, then a signal for skip is recieved.
						}
						return false;
					},
					() => enumerator.dispose()
					);

			},
				// Using a finalizer value reduces the chance of a circular reference since we could simply reference the enueration and check e.wasDisposed.
				() => disposed = true);
		}

		force(): void {

			this.assertIsNotDisposed();

			this.doAction(element=> false);
		}

		skip(count: number): Enumerable<T> {

			this.assertIsNotDisposed();

			return (!count || count < 0) // Out of bounds? Simply return a unfiltered enumerable.
				? this.asEnumerable()
				: this.doAction(
					(element: T, index: number)
						=> index < count
						? EnumerableAction.Skip
						: EnumerableAction.Return);
		}

		skipWhile(predicate: Predicate<T>) {

			this.assertIsNotDisposed();

			var skipping: boolean = true;

			return this.doAction(
				(element: T, index: number)
					=> {
					if (skipping)
						skipping = predicate(element, index);

					return skipping ? EnumerableAction.Skip : EnumerableAction.Return;
				});
		}

		take(count: number): Enumerable<T> {
			this.assertIsNotDisposed();

			// Once action returns false, the enumeration will stop.
			return (!count || count < 0)  // Out of bounds? Simply return an empty enumerable.
				? Enumerable.empty<T>()
				: this.doAction((element: T, index: number) => index < count);
		}

		/** /
				// Overload:function()
		// Overload:function(count)
		takeExceptLast(count): Enumerable<T> {
			if (count == null) count = 1;
			var source = this;

			return new Enumerable<T>(() => {
				if (count <= 0) return source.getEnumerator(); // do nothing

				var enumerator;
				var q = [];

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						while (enumerator.moveNext()) {
							if (q.length == count) {
								q.push(enumerator.current);
								return (<any>this).yieldReturn(q.shift());
							}
							q.push(enumerator.current);
						}
						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}

		takeFromLast(count): Enumerable<T> {
			if (count <= 0 || count == null) return Enumerable.empty<T>();
			var source = this;

			return new Enumerable<T>(() => {
				var sourceEnumerator;
				var enumerator;
				var q = [];

				return new EnumeratorBase<T>(
					() => { sourceEnumerator = source.getEnumerator(); },
					() => {
						while (sourceEnumerator.moveNext()) {
							if (q.length == count) q.shift();
							q.push(sourceEnumerator.current);
						}
						if (enumerator == null) {
							enumerator = Enumerable.from(q).getEnumerator();
						}
						return (enumerator.moveNext())
							? (<any>this).yieldReturn(enumerator.current)
							: false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}
		/**/

		// #region Projection and Filtering Methods
		/*

		// Overload:function(func)
		// Overload:function(func, resultSelector<element>)
		// Overload:function(func, resultSelector<element, nestLevel>)
		traverseBreadthFirst(func, resultSelector): Enumerable<T> {
			var source = this;
			func = Utils.createLambda(func);
			resultSelector = Utils.createLambda(resultSelector);

			return new Enumerable<T>(() => {
				var enumerator;
				var nestLevel = 0;
				var buffer = [];

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						while (true) {
							if (enumerator.moveNext()) {
								buffer.push(enumerator.current);
								return (<any>this).yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							var next = Enumerable.from<T>(buffer).selectMany(function (x) { return func(x); });
							if (!next.any()) {
								return false;
							}
							else {
								nestLevel++;
								buffer = [];
								Utils.dispose(enumerator);
								enumerator = next.getEnumerator();
							}
						}
					},
					() => { Utils.dispose(enumerator); });
			});
		}

		// Overload:function(func)
		// Overload:function(func, resultSelector<element>)
		// Overload:function(func, resultSelector<element, nestLevel>)
		traverseDepthFirst(func, resultSelector): Enumerable<T> {
			var source = this;
			func = Utils.createLambda(func);
			resultSelector = Utils.createLambda(resultSelector);

			return new Enumerable<T>(() => {
				var enumeratorStack = [];
				var enumerator;

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						while (true) {
							if (enumerator.moveNext()) {
								var value = resultSelector(enumerator.current, enumeratorStack.length);
								enumeratorStack.push(enumerator);
								enumerator = Enumerable.from(func(enumerator.current)).getEnumerator();
								return (<any>this).yieldReturn(value);
							}

							if (enumeratorStack.length <= 0) return false;
							Utils.dispose(enumerator);
							enumerator = enumeratorStack.pop();
						}
					},
					() => {
						try {
							Utils.dispose(enumerator);
						}
						finally {
							Enumerable.from(enumeratorStack).forEach(function (s) { s.dispose(); });
						}
					});
			});
		}

		flatten(): Enumerable<T> {
			var source = this;

			return new Enumerable<T>(() => {
				var enumerator;
				var middleEnumerator = null;

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						while (true) {
							if (middleEnumerator != null) {
								if (middleEnumerator.moveNext()) {
									return (<any>this).yieldReturn(middleEnumerator.current);
								}
								else {
									middleEnumerator = null;
								}
							}

							if (enumerator.moveNext()) {
								if (enumerator.current instanceof Array) {
									Utils.dispose(middleEnumerator);
									middleEnumerator = Enumerable.from<T>(enumerator.current)
										.selectMany(Functions.Identity)
										.flatten()
										.getEnumerator();
									continue;
								}
								else {
									return (<any>this).yieldReturn(enumerator.current);
								}
							}

							return false;
						}
					},
					() => {
						try {
							Utils.dispose(enumerator);
						}
						finally {
							Utils.dispose(middleEnumerator);
						}
					});
			});
		}

		pairwise(selector): Enumerable<T> {
			var source = this;
			selector = Utils.createLambda(selector);

			return new Enumerable<T>(() => {
				var enumerator;

				return new EnumeratorBase<T>(
					() => {
						enumerator = source.getEnumerator();
						enumerator.moveNext();
					},
					() => {
						var prev = enumerator.current;
						return (enumerator.moveNext())
							? (<any>this).yieldReturn(selector(prev, enumerator.current))
							: false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}

		// Overload:function(func)
		// Overload:function(seed,func<value,element>)
		scan(seed, func): Enumerable<T> {
			var isUseSeed;
			if (func == null) {
				func = Utils.createLambda(seed); // arguments[0]
				isUseSeed = false;
			} else {
				func = Utils.createLambda(func);
				isUseSeed = true;
			}
			var source = this;

			return new Enumerable<T>(() => {
				var enumerator;
				var value;
				var isFirst = true;

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						if (isFirst) {
							isFirst = false;
							if (!isUseSeed) {
								if (enumerator.moveNext()) {
									return (<any>this).yieldReturn(value = enumerator.current);
								}
							}
							else {
								return (<any>this).yieldReturn(value = seed);
							}
						}

						return (enumerator.moveNext())
							? (<any>this).yieldReturn(value = func(value, enumerator.current))
							: false;
					},
					() => { Utils.dispose(enumerator); });
			});
		} /**/
		// #endregion


		select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			if (selector.length < 2)
				return new WhereSelectEnumerable(_, null, selector);

			return new Enumerable<TResult>(() => {
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() => {
						assertIsNotDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);

						return enumerator.moveNext()
							? yielder.yieldReturn(selector(enumerator.current, index++))
							: false;
					},
					() => enumerator.dispose()
					);
			},
				() => disposed = true);
		}

		/*
		// Overload:function(collectionSelector<element>)
		// Overload:function(collectionSelector<element,index>)
		// Overload:function(collectionSelector<element>,resultSelector)
		// Overload:function(collectionSelector<element,index>,resultSelector)*/

		selectMany<TResult>(
			collectionSelector: Selector<T,IEnumerable<TResult>>
			): Enumerable<TResult>;

		selectMany<TResult>(
			collectionSelector: Selector<T,TResult[]>
			): Enumerable<TResult>;

		selectMany<TElement, TResult>(
			collectionSelector: Selector<T,IEnumerable<TElement>>,
			resultSelector?: (collection: T, element: TElement) => TResult
			): Enumerable<TResult>;

		selectMany<TElement, TResult>(
			collectionSelector: Selector<T,TElement[]>,
			resultSelector?: (collection: T, element: TElement) => TResult
			): Enumerable<TResult>;

		selectMany<TResult>(
			collectionSelector: Selector<T,any>,
			resultSelector?: (collection: any, middle: any) => TResult
			): Enumerable<TResult> {
			var _ = this;
			if (!resultSelector)
				resultSelector = (a, b) => b;

			return new Enumerable<TResult>(() => {
				var enumerator: IEnumerator<T>;
				var middleEnumerator: IEnumerator<any>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() => {
						enumerator = _.getEnumerator();
						middleEnumerator = undefined;
						index = 0;
					},
					yielder => {

						// Just started, and nothing to enumerate? End.
						if (middleEnumerator === undefined && !enumerator.moveNext())
							return false;

						// moveNext has been called at least once...
						do {

							// Initialize middle if there isn't one.
							if (!middleEnumerator) {
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
					() => {
						try {
							enumerator.dispose();
							enumerator = null;
						}
						finally {
							if (middleEnumerator)
								middleEnumerator.dispose();
							middleEnumerator = null;
						}
					});
			});
		}

		choose<TResult>(selector: Selector<T,TResult>): Enumerable<TResult> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<TResult>(() => {
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() => {
						assertIsNotDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext()) {
							var result = selector(enumerator.current, index++);
							if (result !== null && result !== undefined)
								return yielder.yieldReturn(result);
						}

						return false;
					},
					() => enumerator.dispose()
					);
			},
				() => disposed = true);
		}

		where(predicate: Predicate<T>): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			if (predicate.length < 2)
				return new WhereEnumerable(_, predicate);

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);

						index = 0;
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);

						while (enumerator.moveNext()) {
							if (predicate(enumerator.current, index++))
								return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},
					() => enumerator.dispose()
					);
			},
				() => disposed = true);

		}

		ofType<TType>(type: { new (): TType }): Enumerable<TType>
		ofType<TType>(type: any): Enumerable<TType> {
			var typeName:string;
			switch (<any>type) {
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

		except<TCompare>(second: IEnumerable<T>, compareSelector?: Selector<T, TCompare>): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;
				var keys: System.Collections.Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new System.Collections.Dictionary<T, boolean>(compareSelector);
						if (second)
							Enumerable.forEach(second, key => keys.addByKeyValue(key, true));
					},
					yielder => {
						assertIsNotDisposed(disposed);
						while (enumerator.moveNext()) {
							var current = enumerator.current;
							if (!keys.containsKey(current)) {
								keys.addByKeyValue(current, true);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},
					() => {
						enumerator.dispose();
						keys.clear();
					});
			},
				() => disposed = true);
		}

		distinct(compareSelector?: (value: T) => T): Enumerable<T> {
			return this.except(null, compareSelector);
		}

		// [0,0,0,1,1,1,2,2,2,0,0,0] results in [0,1,2,0];
		distinctUntilChanged<TCompare>(compareSelector?: Selector<T,TCompare>): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;
				var compareKey: TCompare;
				var initial: boolean = true;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);
						while (enumerator.moveNext()) {
							var key = compareSelector(enumerator.current);

							if (initial) {
								initial = false;
							}
							else if (compareKey === key) {
								continue;
							}

							compareKey = key;
							return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},
					() => enumerator.dispose()
					);
			},
				() => disposed = true);
		}

		reverse(): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var buffer: T[];
				var index: number;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						buffer = _.toArray();
						index = buffer.length;
					},
					yielder =>
						index > 0
						&& yielder.yieldReturn(buffer[--index]),
					() => buffer.length = 0
					);
			},
				() => disposed = true);
		}

		shuffle(): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var buffer: T[];

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						buffer = _.toArray();
					},
					yielder => {
						var len = buffer.length;
						if (len) {
							var i = Math.floor(Math.random() * len);
							return yielder.yieldReturn(buffer.splice(i, 1).pop());
						}
						return false;
					},
					() => buffer.length = 0
					);
			},
				() => disposed = true);
		}

		count(predicate?: Predicate<T>): number {

			var _ = this;
			_.assertIsNotDisposed();

			var count: number = 0;
			if (predicate) {
				_.forEach((x, i) => {
					if (predicate(x, i))++count;
				});
			}
			else {
				_.forEach((x, i) => {
					++count;
				});
			}

			return count;
		}

		all(predicate: Predicate<T>): boolean {
			var result = true;
			this.forEach(x => {
				if (!predicate(x)) {
					result = false;
					return false; // break
				}
			});
			return result;
		}

		any(predicate?: Predicate<T>): boolean {
			var result = false;

			// Splitting the forEach up this way reduces iterative processing.
			// forEach handles the generation and disposal of the enumerator.
			if (predicate) {
				this.forEach(x => {
					result = predicate(x); // false = not found and therefore it should continue.  true = found and break;
					return !result;
				});
			} else {
				this.forEach(x=> {
					result = true;
					return false;
				});
			}
			return result;

		}

		isEmpty(): boolean {
			return !this.any();
		}

		contains<TCompare>(value: T, compareSelector?: Selector<T,TCompare>): boolean {
			return compareSelector
				? this.any(v=> compareSelector(v) === compareSelector(value))
				: this.any(v=> v === value);
		}

		/** /
				// Overload:function(item)
		// Overload:function(predicate)
		indexOf(item): number {
			var found = null;

			// item as predicate
			if (typeof (item) === Types.Function) {
				this.forEach(function (x, i) {
					if (item(x, i)) {
						found = i;
						return false;
					}
				});
			}
			else {
				this.forEach(function (x, i) {
					if (x === item) {
						found = i;
						return false;
					}
				});
			}

			return (found !== null) ? found : -1;
		}

		// Overload:function(item)
		// Overload:function(predicate)
		lastIndexOf(item):number {
			var result = -1;

			// item as predicate
			if (typeof (item) === Types.Function) {
				this.forEach(function (x, i) {
					if (item(x, i)) result = i;
				});
			}
			else {
				this.forEach(function (x, i) {
					if (x === item) result = i;
				});
			}

			return result;
		}
		/**/

		defaultIfEmpty(defaultValue: T = null): Enumerable<T> {
			var _ = this, disposed: boolean = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: IEnumerator<T>;
				var isFirst: boolean = true;

				return new EnumeratorBase<T>(
					() => {
						assertIsNotDisposed(disposed);
						enumerator = _.getEnumerator();
					},
					yielder => {
						assertIsNotDisposed(disposed);

						if (enumerator.moveNext()) {
							isFirst = false;
							return yielder.yieldReturn(enumerator.current);
						}
						else if (isFirst) {
							isFirst = false;
							return yielder.yieldReturn(defaultValue);
						}
						return false;
					},
					() => enumerator.dispose()
					);
			});
		}

		/* * /
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

		// Overload:function(second)
		// Overload:function(second, compareSelector)
		sequenceEqual(second, compareSelector) {
			compareSelector = Utils.createLambda(compareSelector);

			var firstEnumerator = this.getEnumerator();
			try {
				var secondEnumerator = Enumerable.from(second).getEnumerator();
				try {
					while (firstEnumerator.moveNext()) {
						if (!secondEnumerator.moveNext()
							|| compareSelector(firstEnumerator.current) !== compareSelector(secondEnumerator.current)) {
							return false;
						}
					}

					if (secondEnumerator.moveNext()) return false;
					return true;
				}
				finally {
					Utils.dispose(secondEnumerator);
				}
			}
			finally {
				Utils.dispose(firstEnumerator);
			}
		}

		union(second, compareSelector) {
			compareSelector = Utils.createLambda(compareSelector);
			var source = this;

			return new Enumerable<T>(() => {
				var firstEnumerator;
				var secondEnumerator;
				var keys;

				return new EnumeratorBase<T>(
					() => {
						firstEnumerator = source.getEnumerator();
						keys = new Dictionary(compareSelector);
					},
					() => {
						var current;
						if (secondEnumerator === undefined) {
							while (firstEnumerator.moveNext()) {
								current = firstEnumerator.current;
								if (!keys.contains(current)) {
									keys.add(current);
									return (<any>this).yieldReturn(current);
								}
							}
							secondEnumerator = Enumerable.from(second).getEnumerator();
						}
						while (secondEnumerator.moveNext()) {
							current = secondEnumerator.current;
							if (!keys.contains(current)) {
								keys.add(current);
								return (<any>this).yieldReturn(current);
							}
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

		// Ordering Methods

		orderBy(keySelector) {
			return new OrderedEnumerable(this, keySelector, false);
		}

		orderByDescending(keySelector) {
			return new OrderedEnumerable(this, keySelector, true);
		}

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
							var draw = Math.floor(Math.random() * totalWeight) + 1;

							var lower = -1;
							var upper = sortedByBound.length;
							while (upper - lower > 1) {
								var index = Math.floor((lower + upper) / 2);
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

		// Grouping Methods

		// Overload:function(keySelector)
		// Overload:function(keySelector,elementSelector)
		// Overload:function(keySelector,elementSelector,resultSelector)
		// Overload:function(keySelector,elementSelector,resultSelector,compareSelector)
		groupBy(keySelector, elementSelector, resultSelector, compareSelector) {
			var source = this;
			keySelector = Utils.createLambda(keySelector);
			elementSelector = Utils.createLambda(elementSelector);
			if (resultSelector != null) resultSelector = Utils.createLambda(resultSelector);
			compareSelector = Utils.createLambda(compareSelector);

			return new Enumerable<T>(() => {
				var enumerator;

				return new EnumeratorBase<T>(
					() => {
						enumerator = source.toLookup(keySelector, elementSelector, compareSelector)
							.toEnumerable()
							.getEnumerator();
					},
					() => {
						while (enumerator.moveNext()) {
							return (resultSelector == null)
								? (<any>this).yieldReturn(enumerator.current)
								: (<any>this).yieldReturn(resultSelector(enumerator.current.key(), enumerator.current));
						}
						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}

		// Overload:function(keySelector)
		// Overload:function(keySelector,elementSelector)
		// Overload:function(keySelector,elementSelector,resultSelector)
		// Overload:function(keySelector,elementSelector,resultSelector,compareSelector)
		partitionBy(keySelector, elementSelector, resultSelector, compareSelector) {

			var source = this;
			keySelector = Utils.createLambda(keySelector);
			elementSelector = Utils.createLambda(elementSelector);
			compareSelector = Utils.createLambda(compareSelector);
			var hasResultSelector;
			if (resultSelector == null) {
				hasResultSelector = false;
				resultSelector = function (key, group) { return new Grouping(key, group); }
		}
			else {
				hasResultSelector = true;
				resultSelector = Utils.createLambda(resultSelector);
			}

			return new Enumerable<T>(() => {
				var enumerator;
				var key;
				var compareKey;
				var group = [];

				return new EnumeratorBase<T>(
					() => {
						enumerator = source.getEnumerator();
						if (enumerator.moveNext()) {
							key = keySelector(enumerator.current);
							compareKey = compareSelector(key);
							group.push(elementSelector(enumerator.current));
						}
					},
					() => {
						var hasNext;
						while ((hasNext = enumerator.moveNext()) == true) {
							if (compareKey === compareSelector(keySelector(enumerator.current))) {
								group.push(elementSelector(enumerator.current));
							}
							else break;
						}

						if (group.length > 0) {
							var result = (hasResultSelector)
								? resultSelector(key, Enumerable.from(group))
								: resultSelector(key, group);
							if (hasNext) {
								key = keySelector(enumerator.current);
								compareKey = compareSelector(key);
								group = [elementSelector(enumerator.current)];
							}
							else group = [];

							return (<any>this).yieldReturn(result);
						}

						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}


		buffer(count) {
			var source = this;

			return new Enumerable<T>(() => {
				var enumerator;

				return new EnumeratorBase<T>(
					() => { enumerator = source.getEnumerator(); },
					() => {
						var array = [];
						var index = 0;
						while (enumerator.moveNext()) {
							array.push(enumerator.current);
							if (++index >= count) return (<any>this).yieldReturn(array);
						}
						if (array.length > 0) return (<any>this).yieldReturn(array);
						return false;
					},
					() => { Utils.dispose(enumerator); });
			});
		}

		// Aggregate Methods 

		// Overload:function(func)
		// Overload:function(seed,func)
		// Overload:function(seed,func,resultSelector)
		aggregate(seed, func, resultSelector) {
			resultSelector = Utils.createLambda(resultSelector);
			return resultSelector(this.scan(seed, func, resultSelector).last());
		}

		// Overload:function()
		// Overload:function(selector)
		average(selector) {
			selector = Utils.createLambda(selector);

			var sum = 0;
			var count = 0;
			this.forEach(function (x) {
				sum += selector(x);
				++count;
			});

			return sum / count;
		}

		
		// Overload:function()
		// Overload:function(selector)
		max(selector) {
			if (selector == null) selector = Functions.Identity;
			return this.select(selector).aggregate(function (a, b) { return (a > b) ? a : b; });
		}

		// Overload:function()
		// Overload:function(selector)
		min(selector) {
			if (selector == null) selector = Functions.Identity;
			return this.select(selector).aggregate(function (a, b) { return (a < b) ? a : b; });
		}

		maxBy(keySelector) {
			keySelector = Utils.createLambda(keySelector);
			return this.aggregate(function (a, b) { return (keySelector(a) > keySelector(b)) ? a : b; });
		}

		minBy(keySelector) {
			keySelector = Utils.createLambda(keySelector);
			return this.aggregate(function (a, b) { return (keySelector(a) < keySelector(b)) ? a : b; });
		}

		// Overload:function()
		// Overload:function(selector)
		sum(selector) {
			if (selector == null) selector = Functions.Identity;
			return this.select(selector).aggregate(0, function (a, b) { return a + b; });
		}


/**/

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

		first(predicate?: Predicate<T>): T {
			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).first();

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

		firstOrDefault(predicate: Predicate<T>, defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).firstOrDefault(null, defaultValue);

			var value: T;
			var found = false;
			_.forEach(x => {
				value = x;
				found = true;
				return false;
			});
			return (!found) ? defaultValue : value;
		}

		last(predicate?: Predicate<T>): T {
			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).last();

			var value: T;
			var found: boolean = false;
			_.forEach(x => {
				found = true;
				value = x;
			});

			if (!found) throw new Error("last:No element satisfies the condition.");
			return value;
		}

		lastOrDefault(predicate: Predicate<T>, defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).lastOrDefault(null, defaultValue);

			var value: T;
			var found: boolean = false;
			_.forEach(x=> {
				found = true;
				value = x;
			});
			return (!found) ? defaultValue : value;
		}

		single(predicate?: Predicate<T>): T {
			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).single();

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

		singleOrDefault(predicate: Predicate<T>, defaultValue: T = null): T {

			var _ = this;
			_.assertIsNotDisposed();

			if (predicate) return _.where(predicate).singleOrDefault(null, defaultValue);

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
					() => enumerator.dispose()
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

		private _source: T[]

		constructor(source: T[])
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

		get source(): T[] { return this._source; }

		toArray(): T[]
		{
			return this.source ? this.source.slice() : [];
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
				for (var i = 0; i < source.length; ++i)
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

			var source: T[] = _._source, len: number = source ? source.length : 0;
			return len && (!predicate || super.any(predicate));
		}

		count(predicate?: Predicate<T>): number
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = _._source, len: number = source ? source.length : 0;
			return len && (predicate ? super.count(predicate) : len);
		}

		elementAt(index: number): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (index < source.length && index >= 0)
				? source[index]
				: super.elementAt(index);
		}

		elementAtOrDefault(index: number, defaultValue: T = null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (index < source.length && index >= 0)
				? source[index]
				: defaultValue;
		}

		first(predicate?: Predicate<T>): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (source && source.length && !predicate)
				? source[0]
				: super.first(predicate);
		}

		firstOrDefault(predicate: Predicate<T>, defaultValue: T= null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (source && source.length)
				? (predicate ? super.firstOrDefault(predicate, defaultValue) : source[0])
				: defaultValue;
		}

		last(predicate?: Predicate<T>): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source, len: number = source.length;
			return (len && !predicate)
				? source[len - 1]
				: super.last(predicate);
		}

		lastOrDefault(predicate: Predicate<T>, defaultValue: T= null): T
		{
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source, len: number = source.length;
			return len
				? (predicate ? super.firstOrDefault(predicate, defaultValue) : source[len - 1])
				: defaultValue;
		}

		skip(count: number): Enumerable<T>
		{

			var _ = this;

			return (!count || count < 0) // Out of bounds? Simply return a unfiltered enumerable.
				? _.asEnumerable()
				: new Enumerable<T>(
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

		/*sequenceEqual(second, compareSelector) {
			if ((second instanceof ArrayEnumerable || second instanceof Array)
				&& compareSelector == null
				&& Enumerable.from(second).count() != this.count()) {
				return false;
			}

			return Enumerable.prototype.sequenceEqual.apply(this, arguments);
		}

		toJoinedString(separator, selector) {
			var source = this._source;
			if (selector != null || !(source instanceof Array)) {
				return Enumerable.prototype.toJoinedString.apply(this, arguments);
			}

			if (separator == null) separator = "";
			return source.join(separator);
		}*/

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

		select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult>
		{

			if (selector.length > 1)
				return super.select<TResult>(selector);

			return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
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
				() => enumerator.dispose()
				);
		}

		_onDispose(): void
		{
			super._onDispose();
			this.prevPredicate = null;
			this.prevSource = null;
		}
	}


	export class WhereSelectEnumerable<T, TSelect> extends Enumerable<TSelect> {
		constructor(
			private prevSource: IEnumerable<T>,
			private prevPredicate: Predicate<T>,  // predicate.length always <= 1
			private prevSelector: (value: T, index?: number) => TSelect // selector.length always <= 1
			)
		{
			super(null);
		}

		where(predicate: (value: TSelect, index?: number) => boolean): Enumerable<TSelect>
		{
			if (predicate.length > 1)
				return super.where(predicate);

			return new WhereEnumerable<TSelect>(this, predicate);
		}

		select<TResult>(selector: (value: TSelect, index?: number) => TResult): Enumerable<TResult>
		{

			if (selector.length > 1)
				// if selector use index, can't compose
				return super.select(selector);

			var prevSelector = this.prevSelector;
			var composedSelector = (x: T) => selector(prevSelector(x));
			return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
		}

		getEnumerator(): IEnumerator<TSelect>
		{
			var predicate = this.prevPredicate;
			var selector = this.prevSelector;
			var source = this.prevSource;
			var enumerator: IEnumerator<T>;

			return new System.Collections.EnumeratorBase<TSelect>(
				() => { enumerator = source.getEnumerator(); },
				yielder =>
				{
					while (enumerator.moveNext())
					{
						if (predicate == null || predicate(enumerator.current))
						{
							return yielder.yieldReturn(selector(enumerator.current));
						}
					}
					return false;
				},
				() => enumerator.dispose()
				);
		}

		_onDispose(): void
		{
			super._onDispose();
			this.prevPredicate = null;
			this.prevSource = null;
			this.prevSelector = null;
		}
	}


	export class OrderedEnumerable<T> extends Enumerable<T>
	{

		constructor(
			private source: IEnumerable<T>,
			public keySelector: (value: T) => any,
			public descending: boolean,
			public parent: OrderedEnumerable<T>)
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

		generateKeys(source: T[]): void
		{
			var _ = this;
			var len = source.length;
			var keySelector: (value: T) => TOrderBy = _.keySelector;
			var keys = new Array<TOrderBy>(len);
			for (var i = 0; i < len; ++i)
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
				() => enumerator = _._dictionary.getEnumerator(),
				yielder =>
				{

					if (!enumerator.moveNext())
						return false;

					var current = enumerator.current;

					return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
				},
				() => enumerator.dispose()
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

