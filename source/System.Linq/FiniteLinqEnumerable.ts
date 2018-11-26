/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {
	ActionWithIndex,
	Closure,
	Func,
	HashSelector,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../System/FunctionTypes";
import Functions from "../System/Functions";
import Type from "../System/Types";
import Integer from "../System/Integer";

import IDictionary, {IMap} from "../System/Collections/Dictionaries/IDictionary";
import ILinqFinite, {LinqFinite} from "./ILinq/ILinqFinite";
import FiniteEnumerableOrArrayLike from "../System/Collections/FiniteEnumerableOrArrayLike";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";
import {throwIfEndless} from "../System/Collections/Enumeration/Enumerator";
import Queue from "../System/Collections/Queue";
import Dictionary from "../System/Collections/Dictionaries/Dictionary";
import ArgumentNullException from "../System/Exceptions/ArgumentNullException";
import {using} from "../System/Disposable/dispose";
import EnumeratorBase, {FiniteEnumeratorBase} from "../System/Collections/Enumeration/EnumeratorBase";
import IEnumerator, {FiniteIEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import ILookup from "./ILinq/ILookup";
import LinqEnumerableBase from "./LinqEnumerableBase";
import {LinqEnumerable} from "./Linq";

export {ILinqFinite, LinqFinite}

const VOID0:undefined = void 0;

export class FiniteLinqEnumerable<T>
	extends LinqEnumerableBase<T>
	implements ILinqFinite<T>
{

	constructor(
		enumeratorFactory:() => FiniteIEnumerator<T>,
		finalizer?:Closure | null)
	{
		super(enumeratorFactory, finalizer);
		// @ts-ignore
		this._disposableObjectName = "FiniteLinqEnumerable";
	}

	protected _createEnumerable<T>(
		enumeratorFactory:Func<FiniteIEnumerator<T>>,
		finalizer?:Closure | null | undefined):any
	{
		return new FiniteLinqEnumerable<T>(enumeratorFactory, finalizer);
	}

	get isEndless():false
	{
		return false;
	}

	getEnumerator():FiniteIEnumerator<T>
	{
		return <any>super.getEnumerator();
	}

	asEnumerable():FiniteLinqEnumerable<T>
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new FiniteLinqEnumerable<T>(() => _.getEnumerator());
	}

	count(predicate?:PredicateWithIndex<T>):number
	{
		let count:number = 0;
		this.forEach(
			predicate

				? (x, i) => {
					if(predicate(x, i)) ++count;
				}

				: () => {
					++count;
				}
		);

		return count;
	}

	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqFinite.Sortable<TResult>
	{
		return this._filterSelected(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):ILinqFinite<TResult>
	{
		return this._filterSelected(selector);
	}

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TResult> | null | undefined>):FiniteLinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):FiniteLinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, FiniteEnumerableOrArrayLike<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):FiniteLinqEnumerable<TResult>
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
			._filterSelected(x => x!=null && typeof x===typeName);
	}

	merge(enumerables:FiniteEnumerableOrArrayLike<FiniteEnumerableOrArrayLike<T>>):FiniteLinqEnumerable<T>
	{
		const _ = this;
		if(!enumerables || Type.isArrayLike(enumerables) && !enumerables.length)
			return <any>_;

		return new FiniteLinqEnumerable<T>(
			() => {
				let enumerator:IEnumerator<T>;
				let queue:Queue<FiniteEnumerableOrArrayLike<T>>;

				return new FiniteEnumeratorBase<T>(
					() => {
						// 1) First get our values...
						enumerator = _.getEnumerator();
						queue = new Queue<FiniteEnumerableOrArrayLike<T>>(enumerables);
					},

					(yielder) => {
						while(true)
						{

							while(!enumerator && queue.tryDequeue(value => {
								enumerator = enumUtil.from<T>(value); // 4) Keep going and on to step 2.  Else fall through to yieldBreak().
							}))
							{ }

							if(enumerator && enumerator.moveNext()) // 2) Keep returning until done.
								return yielder.yieldReturn(enumerator.current);

							if(enumerator) // 3) Dispose and reset for next.
							{
								enumerator.dispose();
								enumerator = <any>null;
								continue;
							}

							return yielder.yieldBreak();
						}
					},

					() => {
						if(enumerator) enumerator.dispose();
						enumerator = <any>null;
						if(queue) queue.dispose();
						queue = <any>null;
					}
				);
			}
		);
	}

	concat(...enumerables:Array<FiniteEnumerableOrArrayLike<T>>):ILinqFinite<T>
	{
		return this.merge(enumerables);
	}

	union(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector:HashSelector<T> = <any>Functions.Identity):ILinqFinite<T>
	{
		const _ = this;
		return new FiniteLinqEnumerable<T>(
			() => {
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<T>;
				let keys:Dictionary<T, any>;

				return new FiniteEnumeratorBase<T>(
					() => {
						firstEnumerator = _.getEnumerator();
						keys = new Dictionary<T, any>(compareSelector); // Acting as a HashSet.
					},

					(yielder) => {
						let current:T;
						if(secondEnumerator===VOID0)
						{
							while(firstEnumerator.moveNext())
							{
								current = <T>firstEnumerator.current;
								if(!keys.containsKey(current))
								{
									keys.addByKeyValue(current, null);
									return yielder.yieldReturn(current);
								}
							}
							secondEnumerator = enumUtil.from(second);
						}
						while(secondEnumerator.moveNext())
						{
							current = <T>secondEnumerator.current;
							if(!keys.containsKey(current))
							{
								keys.addByKeyValue(current, null);
								return yielder.yieldReturn(current);
							}
						}
						return false;
					},

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						firstEnumerator = <any>null;
						secondEnumerator = <any>null;
					}
				);
			}
		);
	}



	/**
	 * Alternates values between this and the second set until either runs out.
	 * @param second
	 * @param resultSelector
	 */
	zip<TSecond, TResult>(
		second:FiniteEnumerableOrArrayLike<TSecond>,
		resultSelector:(
			first:T,
			second:TSecond,
			index:number) => TResult):ILinqFinite<TResult>
	{
		const _ = this;
		_.throwObjectDisposed();

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
						firstEnumerator = <any>null;
						secondEnumerator = <any>null;
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
		_.throwObjectDisposed();

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
						secondEnumerator = <any>null;
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
								secondEnumerator = <any>null;
							}
						}

						return yielder.yieldBreak();
					},

					() => {
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						if(secondTemp) secondTemp.dispose();
						firstEnumerator = <any>null;
						secondEnumerator = <any>null;
						secondTemp = <any>null;
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
				let lookup:ILookup<TKey, TInner>;
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
						outerEnumerator = <any>null;
						lookup = <any>null;
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
						enumerator = <any>null;
						lookup = <any>null;
					}
				);
			}
		);
	}

	// #region Conversion Methods
	toArray(predicate?:PredicateWithIndex<T>):T[]
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

		// If not exposing an action that could cause dispose, then use enumUtil.forEach utility instead.
		enumUtil.forEach<T>(this, (x, i) => {
			target[i + index] = x
		}, count);

		return target;
	}


	forEach(action:ActionWithIndex<T>, max?:number):number
	forEach(action:PredicateWithIndex<T>, max?:number):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, max:number = Infinity):number
	{
		const _ = this;
		_.throwIfDisposed();
		if(!action)
			throw new ArgumentNullException("action");
		throwIfEndless(_.isEndless);

		/*
		// It could be just as easy to do the following:
		return enumUtil.forEach(_, action, max);
		// But to be more active about checking for disposal, we use this instead:
		*/


		// Return value of action can be anything, but if it is (===) false then the enumUtil.forEach will discontinue.
		return max>0 ? using(
			_.getEnumerator(), e => {

				throwIfEndless(!isFinite(max) && e.isEndless);

				let i = 0;
				// It is possible that subsequently 'action' could cause the enumeration to dispose, so we have to check each time.
				while(max>i && _.throwIfDisposed() && e.moveNext())
				{
					if(action(<T>e.current, i++)===false)
						break;
				}
				return i;
			}
		) : 0;
	}

	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue> = <any>Functions.Identity,
		compareSelector:HashSelector<TKey>           = <any>Functions.Identity):ILookup<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue[]> = new Dictionary<TKey, TValue[]>(compareSelector);
		this.forEach(
			(x, i) => {
				let key = keySelector(x, i);
				let element = elementSelector(x, i);

				let array = dict.getValue(key);
				if(array!==VOID0) array.push(element);
				else dict.addByKeyValue(key, [element]);
			}
		);
		return new Lookup<TKey, TValue>(dict);
	}

	toMap<TResult>(
		keySelector:SelectorWithIndex<T, string | number | symbol>,
		elementSelector:SelectorWithIndex<T, TResult>):IMap<TResult>
	{
		const obj:IMap<TResult> = {};
		this.forEach((x, i) => {
			//@ts-ignore
			obj[keySelector(x, i)] = elementSelector(x, i);
		});
		return obj;
	}


	toDictionary<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue>,
		compareSelector:HashSelector<TKey> = <any>Functions.Identity):IDictionary<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue> = new Dictionary<TKey, TValue>(compareSelector);
		this.forEach((x, i) => dict.addByKeyValue(keySelector(x, i), elementSelector(x, i)));
		return dict;
	}

	toJoinedString(separator:string = "", selector:Selector<T, string> = <any>Functions.Identity)
	{
		return this
			.select(selector)
			.toArray()
			.join(separator);
	}

	// #endregion

}

export default <any>FiniteLinqEnumerable;