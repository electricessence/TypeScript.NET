/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import DisposableBase from "../../System/Disposable/DisposableBase";
import IEnumerable from "../../System/Collections/Enumeration/IEnumerable";
import {
	Action,
	Closure,
	Func,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../../System/FunctionTypes";
import EnumerableOrArrayLike from "../../System/Collections/EnumerableOrArrayLike";
import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import IEnumerator from "../../System/Collections/Enumeration/IEnumerator";

export namespace Enumerable
{

	/**
	 * This base class allows for reducing the method signature
	 * to only ones that don't require specific enumerable types,
	 * or methods that use LinqEnumerable<T> as a return type.
	 */
	export abstract class Base<T>
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
}