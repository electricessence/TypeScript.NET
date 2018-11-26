/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import {
	Action,
	ActionWithIndex,
	Closure,
	Func,
	HashSelector,
	PredicateWithIndex,
	SelectorWithIndex
} from "../System/FunctionTypes";

import IEnumerable from "../System/Collections/Enumeration/IEnumerable";
import EnumerableOrArrayLike from "../System/Collections/EnumerableOrArrayLike";
import IEnumerator from "../System/Collections/Enumeration/IEnumerator";

import ArgumentNullException from "../System/Exceptions/ArgumentNullException";
import EnumeratorBase from "../System/Collections/Enumeration/EnumeratorBase";
import EnumerableAction from "./EnumerableAction";

import Functions from "../System/Functions";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";

import DisposableBase from "../System/Disposable/DisposableBase";
import dispose, {using} from "../System/Disposable/dispose";

import ILinqBase from "./ILinq/ILinqBase";
import {ILinqFinite} from "./ILinq/ILinqFinite";
import {ILinqEndless} from "./ILinq/ILinqEndless";
import ArgumentOutOfRangeException from "../System/Exceptions/ArgumentOutOfRangeException";
import Integer from "../System/Integer";
import empty from "./Enumerable/empty";
import throwObjectDisposed from "./throwObjectDisposed";
import Enumerable, {LinqEnumerable} from "./Linq";
import LazyList from "../System/Collections/LazyList";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";
import Dictionary from "../System/Collections/Dictionaries/Dictionary";
import {areEqual as areEqualValues} from "../System/Compare";
import ArrayEnumerator from "../System/Collections/Enumeration/ArrayEnumerator";
import initialize from "../System/Collections/Array/initialize";
import ILinqNotEmpty from "./ILinq/ILinqNotEmpty";

const INVALID_DEFAULT:any = {}; // create a private unique instance for referencing.
const VOID0:undefined = void 0;

/**
 * This base class allows for reducing the method signature
 * to only ones that don't require specific enumerable types,
 * or methods that use LinqEnumerable<T> as a return type.
 */
export default abstract class LinqEnumerableBase<T>
	extends DisposableBase
	implements ILinqBase<T>, IEnumerable<T>
{
	protected constructor(
		protected _enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null)
	{
		super("LinqEnumerableBase", finalizer);
	}

	abstract readonly isEndless?:boolean;

	getEnumerator():IEnumerator<T>
	{
		this.throwIfDisposed();
		return this._enumeratorFactory();
	}

	protected _onDispose():void
	{
		super._onDispose(); // Just in case.
		// @ts-ignore
		this._enumeratorFactory = null;
	}

	protected abstract _createEnumerable<T>(
		enumeratorFactory:Func<IEnumerator<T>>,
		finalizer?:Closure | null):any;

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
						throwObjectDisposed(!selector);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwObjectDisposed(disposed);

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
						throwObjectDisposed(!collectionSelector);
						enumerator = _.getEnumerator();
						middleEnumerator = VOID0;
						index = 0;
					},

					(yielder) => {
						throwObjectDisposed(!collectionSelector);
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

							if(middleEnumerator!.moveNext())
								return yielder.yieldReturn(
									resultSelector!(
										<T>enumerator.current, <TElement>middleEnumerator!.current
									)
								);

							// else no more in this middle?  Then clear and reset for next...

							middleEnumerator!.dispose();
							middleEnumerator = null;

						}
						while(enumerator.moveNext());

						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
						dispose.single(middleEnumerator);
						enumerator = <any>null;
						middleEnumerator = null;
					},

					isEndless
				);
			},
			() => {
				collectionSelector = <any>null;
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
		onComplete?:Action<number>):ILinqEndless<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer:Closure | null,
		isEndless:false,
		onComplete?:Action<number>):ILinqFinite<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure | null,
		isEndless?:boolean | null,
		onComplete?:Action<number>):ILinqEndless<T> | ILinqFinite<T>

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
					throwObjectDisposed(!action);

					if(initializer) initializer();
					index = 0;
					enumerator = _.getEnumerator();
					// May need a way to propagate isEndless
				},

				(yielder) => {
					throwObjectDisposed(!action);

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
			action = <any>null;
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

	where(predicate:PredicateWithIndex<T>):this
	{
		return this._filterSelected(Functions.Identity, predicate);
	}

	filter(predicate:PredicateWithIndex<T>):this
	{
		return this._filterSelected(Functions.Identity, predicate);
	}

	nonNull():this
	{
		return this._filterSelected(isNotNullOrUndefined);
	}

	skip(count:number):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return <any>empty();

		Integer.assert(count, "count");

		return this.where((element, index) => index>=count);
	}

	take(count:number):ILinqFinite<T>
	{
		if(!(count>0)) // Out of bounds? Empty.
			return empty();

		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count))
			throw new ArgumentOutOfRangeException('count', count, 'Must be finite.');

		Integer.assert(count, "count");

		// Once action returns false, the enumeration will stop.
		return _.doAction((element, index) => index<count, null, false);
	}

	takeWhile(predicate:PredicateWithIndex<T>):this
	{
		this.throwIfDisposed();

		if(!predicate)
			throw new ArgumentNullException('predicate');

		return <any>this.doAction(
			(element:T, index:number) =>
				predicate(element, index)
					? EnumerableAction.Return
					: EnumerableAction.Break,
			null,
			null // We don't know the state if it is endless or not.
		);
	}


	// Is like the inverse of take While with the ability to return the value identified by the predicate.
	takeUntil(predicate:PredicateWithIndex<T>, includeUntilValue?:boolean):this
	{
		this.throwIfDisposed();

		if(!predicate)
			throw new ArgumentNullException('predicate');

		if(!includeUntilValue)
			return <any>this.doAction(
				(element:T, index:number) =>
					predicate(element, index)
						? EnumerableAction.Break
						: EnumerableAction.Return,
				null,
				null // We don't know the state if it is endless or not.
			);

		let found:boolean = false;
		return <any>this.doAction(
			(element:T, index:number) => {
				if(found)
					return EnumerableAction.Break;

				found = predicate(element, index);
				return EnumerableAction.Return;
			},
			() => {
				found = false;
			},
			null // We don't know the state if it is endless or not.
		);
	}

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
			const result:any = i ? selector(previous!, value, i) : <any>null;
			previous = value;
			return result;
		}).skip(1);
	}



	except(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector?:HashSelector<T>):this
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
						throwObjectDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new Dictionary<T, boolean>(compareSelector);
						if(second)
							enumUtil.forEach(second, key => { keys.addByKeyValue(key, true) });
					},

					(yielder) => {
						throwObjectDisposed(disposed);
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


	distinct(compareSelector?:HashSelector<T>):this
	{
		return this.except(<any>null, compareSelector);
	}

	// [0,0,0,1,1,1,2,2,2,0,0,0,1,1] results in [0,1,2,0,1];
	distinctUntilChanged(compareSelector:HashSelector<T> = <any>Functions.Identity):this
	{

		const _ = this;
		let disposed = !_.throwIfDisposed();
		const isEndless = _.isEndless;

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let compareKey:any;
				let initial:boolean = true;

				return new EnumeratorBase<T>(
					() => {
						throwObjectDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwObjectDisposed(disposed);
						while(enumerator.moveNext())
						{
							let key = compareSelector(<T>enumerator.current);

							if(initial)
							{
								initial = false;
							}
							else if(areEqualValues(compareKey, key))
							{
								continue;
							}

							compareKey = key;
							return yielder.yieldReturn(enumerator.current);
						}
						return false;
					},

					() => {
						if(enumerator) enumerator.dispose();
					},

					isEndless
				);
			},

			() => {
				disposed = true;
			}
		);
	}

	/**
	 * Returns a single default value if empty.
	 * @param defaultValue
	 * @returns {Enumerable}
	 */
	defaultIfEmpty(defaultValue?:T):this & ILinqNotEmpty<T>
	{
		const _ = this;
		const disposed:boolean = !_.throwIfDisposed();
		const isEndless = _.isEndless;

		return _._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;
				let isFirst:boolean;

				return new EnumeratorBase<T>(
					() => {
						isFirst = true;
						throwObjectDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwObjectDisposed(disposed);

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

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = <any>null;
					},

					isEndless
				);
			}
		);
	}


	insertAt(index:number, other:ILinqFinite<T>):this
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
						firstEnumerator = <any>null;
						if(secondEnumerator) secondEnumerator.dispose();
						secondEnumerator = <any>null;
					},

					isEndless
				);
			}
		);
	}


	alternateMultiple(sequence:FiniteEnumerableOrArrayLike<T>):this
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
						enumerator = <any>null;
						alternateEnumerator = <any>null;
					},

					isEndless
				);
			}
		);
	}

	alternateSingle(value:T):this
	{
		return this.alternateMultiple(Enumerable.make(value));
	}

	alternate(...sequence:T[]):this
	{
		return this.alternateMultiple(sequence);
	}


	// #region Error Handling
	catchError(handler:(e:any) => void):this
	{
		const _ = this;
		const disposed = !_.throwIfDisposed();
		return <any> this._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						try
						{
							throwObjectDisposed(disposed);
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
							throwObjectDisposed(disposed);
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
						enumerator = <any>null;
					}
				);
			},
			null
		);
	}

	finallyAction(action:Closure):this
	{
		const _ = this;
		const disposed = !_.throwIfDisposed();

		return <any> this._createEnumerable(
			() => {
				let enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() => {
						throwObjectDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) => {
						throwObjectDisposed(disposed);
						return (enumerator.moveNext())
							? yielder.yieldReturn(enumerator.current)
							: false;
					},

					() => {
						try
						{
							if(enumerator) enumerator.dispose();
							enumerator = <any>null;
						}
						finally
						{
							action();
						}
					}
				);
			},
			null
		);
	}

	// #endregion

	buffer(size:number):ILinqFinite<T[]> | ILinqEndless<T[]>
	{
		if(size<1 || !isFinite(size))
			throw new Error("Invalid buffer size.");

		Integer.assert(size, "size");

		const _ = this;
		const isEndless = _.isEndless;
		let len:number;

		return <any>this._createEnumerable(
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
						enumerator = <any>null;
					},

					isEndless
				);
			},
			null);
	}

	share():this
	{
		const _ = this;
		_.throwIfDisposed();

		let sharedEnumerator:IEnumerator<T>;
		return <any>this._createEnumerable(
			() => {
				return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
			},

			() => {
				if(sharedEnumerator) sharedEnumerator.dispose();
				sharedEnumerator = <any>null;
			}
		);
	}


	memoize():this
	{
		let source = new LazyList(this);
		return this._createEnumerable(
			() => source.getEnumerator(),
			() => {
				source.dispose();
				source = <any>null
			});
	}

}

// This allows for the use of a boolean instead of calling this.throwObjectDisposed()
// since there is a strong chance of introducing a circular reference.

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
