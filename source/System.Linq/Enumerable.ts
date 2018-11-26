/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {empty} from "./Enumerable/empty";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";
import {
	EndlessEnumeratorBase,
	FiniteEnumeratorBase
} from "../System/Collections/Enumeration/EnumeratorBase";
import Random from "../System/Random";
import ArgumentOutOfRangeException from "../System/Exceptions/ArgumentOutOfRangeException";
import copy from "../System/Collections/Array/copy";
import Integer from "../System/Integer";
import ArgumentNullException from "../System/Exceptions/ArgumentNullException";
import Queue from "../System/Collections/Queue";
import {dispose} from "../System/Disposable/dispose";
import {EndlessLinqEnumerable, FiniteLinqEnumerable} from "./Linq";

export {
	empty
}


export module Enumerable
{





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

	function _cycle<T>(values:T[]):EndlessLinqEnumerable<T>
	{
		return new EndlessLinqEnumerable<T>(
			() => {
				let index:number = 0;
				return new EndlessEnumeratorBase<T>(
					() => {
						index = 0;
					}, // Reinitialize the value just in case the enumerator is restarted.
					(yielder) => {
						throwIfDisposed(!values);
						if(index>=values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					}
				);
			},
			() => {
				values.length = 0;
				values = NULL;
			}
		);
	}

	export function cycle<T>(values:ArrayLike<T>):EndlessLinqEnumerable<T>
	{
		let len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		// Make a copy to avoid modifying the collection as we go.
		return _cycle(copy(values));
	}

	export function cycleThrough<T>(arg:T, ...args:T[]):EndlessLinqEnumerable<T>
	export function cycleThrough<T>(...args:T[]):EndlessLinqEnumerable<T>
	{
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!args.length)
			throw new ArgumentOutOfRangeException('length', length);

		return _cycle(args);
	}

	export function empty<T>():FiniteLinqEnumerable<T>
	{
		// Could be single export function instance, but for safety, we'll make a new one.
		return new FiniteLinqEnumerable<T>(getEmptyEnumerator);
	}

	export function repeat<T>(element:T):EndlessLinqEnumerable<T>;
	export function repeat<T>(element:T, count:number):FiniteLinqEnumerable<T>;
	export function repeat<T>(element:T, count:number = Infinity):any
	{
		if(!(count>0))
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			? new FiniteLinqEnumerable<T>(
				() => {
					let c:number = count;
					let index:number = 0;

					return new FiniteEnumeratorBase<T>(
						() => { index = 0; },
						(yielder) => (index++<c) && yielder.yieldReturn(element)
					);
				}
			)
			: new EndlessLinqEnumerable<T>(
				() =>
					new EndlessEnumeratorBase<T>(
						null,
						(yielder) => yielder.yieldReturn(element)
					)
			);
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

// start and step can be other than integer.

	export function range(
		start:number,
		count:number,
		step:number = 1):FiniteLinqEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!(count>0))
			return empty<number>();

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		Integer.assert(count, "count");

		return new FiniteLinqEnumerable<number>(
			() => {
				let value:number;
				let c:number = count; // Force integer evaluation.
				let index:number = 0;

				return new FiniteEnumeratorBase<number>(
					() => {
						index = 0;
						value = start;
					},

					(yielder) => {
						let result:boolean =
							    index++<c
							    && yielder.yieldReturn(value);

						if(result && index<count)
							value += step;

						return result;
					}
				);
			});
	}

	export function rangeDown(
		start:number,
		count:number,
		step:number = 1):FiniteLinqEnumerable<number>
	{
		step = Math.abs(step)* -1;

		return range(start, count, step);
	}

// step = -1 behaves the same as toNegativeInfinity;
	export function toInfinity(
		start:number = 0,
		step:number  = 1):EndlessLinqEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		return new EndlessLinqEnumerable<number>(
			() => {
				let value:number;

				return new EndlessEnumeratorBase<number>(
					() => {
						value = start;
					},

					(yielder) => {
						let current:number = value;
						value += step;
						return yielder.yieldReturn(current);
					}
				);
			}
		);
	}

	export function toNegativeInfinity(
		start:number = 0,
		step:number  = 1):EndlessLinqEnumerable<number>
	{
		return toInfinity(start, -step);
	}

	export function rangeTo(
		start:number,
		to:number,
		step:number = 1):FiniteLinqEnumerable<number>
	{
		if(isNaN(to) || !isFinite(to))
			throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");

		if(step && !isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");

// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
		step = Math.abs(step);

		return new FiniteLinqEnumerable<number>(
			() => {
				let value:number;

				return new FiniteEnumeratorBase<number>(() => { value = start; },
					start<to
						? yielder => {
							let result:boolean = value<=to && yielder.yieldReturn(value);

							if(result)
								value += step;

							return result;
						}
						: yielder => {
							let result:boolean = value>=to && yielder.yieldReturn(value);

							if(result)
								value -= step;

							return result;
						});
			}
		);
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


	/**
	 * Takes any set of collections of the same type and weaves them together.
	 * @param enumerables
	 * @returns {Enumerable<T>}
	 */
	export function weave<T>(
		enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
	{
		if(!enumerables)
			throw new ArgumentNullException('enumerables');

		let disposed = false;
		return new FiniteLinqEnumerable<T>(
			() => {
				let queue:Queue<IEnumerator<T>>;
				let mainEnumerator:FiniteIEnumerator<FiniteEnumerableOrArrayLike<T>> | null;
				let index:number;

				return new FiniteEnumeratorBase<T>(
					() => {
						throwIfDisposed(disposed);
						index = 0;
						queue = new Queue<IEnumerator<T>>();
						mainEnumerator = enumUtil.from(enumerables);
					},

					(yielder) => {
						throwIfDisposed(disposed);
						let e:IEnumerator<T> | null = null;

						// First pass...
						if(mainEnumerator)
						{
							while(!e && mainEnumerator.moveNext())
							{
								let c = mainEnumerator.current;
								e = nextEnumerator(queue, c ? enumUtil.from(c) : NULL);
							}

							if(!e)
								mainEnumerator = null;
						}

						while(!e && queue.tryDequeue(value => {
							e = nextEnumerator(queue, enumUtil.from<T>(value));
						}))
						{ }

						return e
							? yielder.yieldReturn(e.current)
							: yielder.yieldBreak();

					},

					() => {
						if(queue)
						{
							dispose.these.noCopy(queue.dump());
							queue = NULL;
						}
						if(mainEnumerator) mainEnumerator.dispose();
						mainEnumerator = null;
					}
				);
			},
			() => {
				disposed = true;
			}
		);
	}

}