///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	"use strict";

	var EnumeratorBase = System.Collections.EnumeratorBase;

	var Functions = System.Functions;
	var Types = System.Types;

	export enum EnumerableAction {
		Break,
		Return,
		Skip
	}

	// This allows for the use of a boolean instead of calling this.assertIsNotDisposed() since there is a strong chance of introducing a circular reference.
	function assertIsNotDisposed(disposed: boolean): boolean {
		if (disposed)
			throw new Error("Enumerable was disposed.");

		return true;
	}

	export class Enumerable<T> extends DisposableBase implements System.Collections.IEnumerable<T> {

		// Enumerable<T> is an instance class that has useful statics.
		// In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
		// In this case, we use Enumerable<T> as the underlying class that is being chained.
		constructor(private enumeratorFactory: () => System.Collections.IEnumerator<T>, finalizer?: () => void) {
			super(finalizer);
		}

		// #region IEnumerable<T> Implementation...
		getEnumerator(): System.Collections.IEnumerator<T> {

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
		static choice<T>(values: T[]): Enumerable<T> {
			return new Enumerable<T>(() =>
				new EnumeratorBase<T>(
					null,
					yielder =>
						yielder.yieldReturn(values[Math.floor(Math.random() * values.length)])
					)
				);
		}

		static cycle<T>(values: T[]): Enumerable<T> // variable argument
		{
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

		static empty<T>() {
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

		static repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): Enumerable<T> {

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

		static range(start: number, count: number, step?: number): Enumerable<number> {

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

		static rangeDown(start: number, count: number, step?: number): Enumerable<number> {
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

		static rangeTo(start: number, to: number, step?: number): Enumerable<number> {
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

		static generate<T>(factory: () => T, count?: number): Enumerable<T> {

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
							? yielder.yieldReturn(factory())
							: false;
					});
			});
		}

		static unfold<T>(seed: T, valueFactory: (value: T) => T): Enumerable<T> {
			return new Enumerable<T>(() => {
				var isFirst: boolean;
				var value: T;
				return new EnumeratorBase<T>(
					() => isFirst = true,
					yielder => {
						if (isFirst) {
							isFirst = false;
							value = seed;
							return yielder.yieldReturn(value);
						}
						value = valueFactory(value);
						return yielder.yieldReturn(value);
					});
			});
		}

		static defer<T>(enumerableFactory: () => System.Collections.IEnumerable<T>): Enumerable<T> {

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;

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
		// #endregion

		//////////////////////////////////////////
		// #region Instance methods...

		private assertIsNotDisposed(): boolean {
			return assertIsNotDisposed(this.wasDisposed);
		}

		static forEach<T>(enumerable: System.Collections.IEnumerable<T>, action: (element: T, index?: number) => any): void {
			var _ = enumerable;

			var index = 0;
			// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			System.using(_.getEnumerator(), e=> {
				while (e.moveNext() && action(e.current, index++) !== false) { }
			});
		}

		forEach(action: (element: T, index?: number) => boolean): void;
		forEach(action: (element: T, index?: number) => void): void;
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

		toArray(predicate?: (value: T, index?: number) => boolean): T[] {
			var result: T[] = [];

			if (predicate) return this.where(predicate).toArray();

			this.forEach(x=> result.push(x));

			return result;
		}

		// Similar to forEach, but execute's an action for each time a value is enumerated.
		// If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
		// If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
		// This also automatically handles disposing the enumerator.
		doAction(action: (element: T, index?: number) => EnumerableAction): Enumerable<T>;
		doAction(action: (element: T, index?: number) => number): Enumerable<T>;
		doAction(action: (element: T, index?: number) => boolean): Enumerable<T>;
		doAction(action: (element: T, index?: number) => void): Enumerable<T>;
		doAction(action: (element: T, index?: number) => any): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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

			return this.doAction(
				(element:T, index:number)
					=> index < count
					? EnumerableAction.Skip
					: EnumerableAction.Return);
		}

		skipWhile(predicate: (element: T, index?: number) => boolean) {

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
			return this.doAction((element: T, index: number) => index < count);
		}

		select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<TResult>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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

		choose<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<TResult>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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

		where(predicate: (value: T, index?: number) => boolean): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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

		except(second: System.Collections.IEnumerable<T>, compareSelector?: (value: T) => T): Enumerable<T> {
			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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
		distinctUntilChanged(compareSelector?: (value: T) => T): Enumerable<T> {

			var _ = this, disposed = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
				var compareKey: T;
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

		count(predicate?: (value: T, index?: number) => boolean): number {

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

		all(predicate: (value: T) => boolean): boolean {
			var result = true;
			this.forEach(x => {
				if (!predicate(x)) {
					result = false;
					return false; // break
				}
			});
			return result;
		}

		any(predicate?: (value: T) => boolean): boolean {
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

		contains(value: T, compareSelector?: (value: T) => T): boolean {
			return compareSelector
				? this.any(v=> compareSelector(v) === value)
				: this.any(v=> v === value);
		}

		defaultIfEmpty(defaultValue: T = null): Enumerable<T> {
			var _ = this, disposed: boolean = !_.assertIsNotDisposed();

			return new Enumerable<T>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
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

		first(predicate?: (value: T, index?: number) => boolean): T {
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

		firstOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue: T = null): T {
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

		last(predicate?: (value: T, index?: number) => boolean): T {
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

		lastOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue: T = null): T {
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

		single(predicate?: (value: T, index?: number) => boolean): T {
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

		singleOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue: T = null): T {

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

			var sharedEnumerator: System.Collections.IEnumerator<T>;
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

				var enumerator: System.Collections.IEnumerator<T>;
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
				var enumerator;

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
				var enumerator;

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


}

