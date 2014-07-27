///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Linq {

	var EnumeratorBase = System.Collections.EnumeratorBase;

	var Functions = System.Functions;
	var Types = System.Types;

	export enum EnumerableAction {
		Break,
		Return,
		Skip
	}

	export class Enumerable<T> extends DisposableBase implements System.Collections.IEnumerable<T> {

		// Enumerable<T> is an instance class that has useful statics.
		// In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
		// In this case, we use Enumerable<T> as the underlying class that is being chained.
		constructor(private enumeratorFactory: () => System.Collections.IEnumerator<T>) {
			super();
		}

		//#region IEnumerable<T> Implementation...
		getEnumerator(): System.Collections.IEnumerator<T> {
			return this.enumeratorFactory();
		}
		//#endregion

		//#region IDisposable override...
		_onDispose(): void {
			super._onDispose();
			this.enumeratorFactory = null;
		}
		//#endregion

		//////////////////////////////////////////
		//#region Static Methods...
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
				var index = 0;
				return new EnumeratorBase<T>(
					null,
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
				var value;
				var index = 0;

				return new EnumeratorBase<number>(
					() => value = start - step,
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
				var value;

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
				var isFirst: boolean = true;
				var value: T;
				return new EnumeratorBase<T>(
					null,
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
		//#endregion

		//////////////////////////////////////////
		//#region Instance methods...

		forEach(action: (element: T, index?: number) => boolean): void;
		forEach(action: (element: T, index?: number) => void): void;
		forEach(action: (element: T, index?: number) => any):void {
			var index = 0;
			 // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
			System.using(this.getEnumerator(), e=> {
				while (e.moveNext() && action(e.current, index++) !== false) { }
			});
		}

		// Similar to forEach, but execute's an action for each time a value is enumerated.
		// If the action explicitly returns false or 0 (EnumerationAction.Break), the enumeration will complete.
		// If it returns a 2 (EnumerationAction.Skip) it will move on to the next item.
		doAction(action: (element: T, index?: number) => EnumerableAction): Enumerable<T>;
		doAction(action: (element: T, index?: number) => number): Enumerable<T>;
		doAction(action: (element: T, index?: number) => boolean): Enumerable<T>;
		doAction(action: (element: T, index?: number) => void): Enumerable<T>;
		doAction(action: (element: T, index?: number) => any): Enumerable<T> {
			var _ = this;

			return new Enumerable<T>(() => {
				var enumerator:System.Collections.IEnumerator<T>;
				var index:number;

				return new EnumeratorBase<T>(
					() => { index = 0; enumerator = _.getEnumerator(); },
					yielder => {
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
			});
		}

		skip(count: number): Enumerable<T> {
			return this.doAction(
				(element, index)
					=> index < count
					? EnumerableAction.Skip
					: EnumerableAction.Return);
		}

		// Overload:function(predicate<element>)
		// Overload:function(predicate<element,index>)
		skipWhile(predicate:(element:T,index?:number)=>boolean) {

			var skipping: boolean = true;

			return this.doAction(
				(element, index)
					=> {
						if (skipping)
							skipping = predicate(element, index);

						return skipping ? EnumerableAction.Skip : EnumerableAction.Return;
					});
		}


		take(count: number): Enumerable<T> {
			var _ = this;

			// Once action returns false, the enumeration will stop.
			return _.doAction((element, index) => index < count);
		}

		select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult> {
			var _ = this;
			return new Enumerable<TResult>(() => {
				var enumerator: System.Collections.IEnumerator<T>;
				var index: number;

				return new EnumeratorBase<TResult>(
					() => {
						index = 0;
						enumerator = _.getEnumerator()
					},
					yielder => {
						return enumerator.moveNext()
							? yielder.yieldReturn(selector(enumerator.current, index++))
							: false;
					},
					() => enumerator.dispose()
					);
			});
		}

		where(predicate: (value: T, index?: number) => boolean): Enumerable<T> {

				var _ = this;

				return new Enumerable<T>(() => {
					var enumerator: System.Collections.IEnumerator<T>;
					var index: number;

					return new EnumeratorBase<T>(
						() => {
							index = 0;
							enumerator = _.getEnumerator();
						},
						yielder => {
							while (enumerator.moveNext()) {
								if (predicate(enumerator.current, index++)) {
									return yielder.yieldReturn(enumerator.current);
								}
							}
							return false;
						},
						() => enumerator.dispose()
						);
				});
			
		}

		singleOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue:T = null):T {

			var _ = this;

			if (predicate != null) return _.where(predicate).singleOrDefault(null, defaultValue);

			var value;
			var found = false;
			_.forEach(x=> {
				if (!found) {
					found = true;
					value = x;
				} else throw new Error("single:sequence contains more than one element.");
			});

			return (!found) ? defaultValue : value;
		}

		//#endregion
	}

}

