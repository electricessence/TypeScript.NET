/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {areEqual as areEqualValues, compare as compareValues} from "../System/Compare";
import {copy} from "../System/Collections/Array/copy";
import * as Arrays from "../System/Collections/Array/Compare";
import * as enumUtil from "../System/Collections/Enumeration/Enumerator";
import {
	isEnumerable,
	isEnumerator,
	isIterator,
	throwIfEndless
} from "../System/Collections/Enumeration/Enumerator";
import {EmptyEnumerator} from "../System/Collections/Enumeration/EmptyEnumerator";
import {Type} from "../System/Types";
import {Integer} from "../System/Integer";
import {Functions as BaseFunctions} from "../System/Functions";
import {ArrayEnumerator} from "../System/Collections/Enumeration/ArrayEnumerator";
import {EnumeratorBase} from "../System/Collections/Enumeration/EnumeratorBase";
import {Dictionary} from "../System/Collections/Dictionaries/Dictionary";
import {Queue} from "../System/Collections/Queue";
import {dispose, using} from "../System/Disposable/dispose";
import {DisposableBase} from "../System/Disposable/DisposableBase";
import {UnsupportedEnumerableException} from "../System/Collections/Enumeration/UnsupportedEnumerableException";
import {ObjectDisposedException} from "../System/Disposable/ObjectDisposedException";
import {KeySortedContext} from "../System/Collections/Sorting/KeySortedContext";
import {ArgumentNullException} from "../System/Exceptions/ArgumentNullException";
import {ArgumentOutOfRangeException} from "../System/Exceptions/ArgumentOutOfRangeException";
import {IEnumerator} from "../System/Collections/Enumeration/IEnumerator";
import {IEnumerable} from "../System/Collections/Enumeration/IEnumerable";
import {
	Action,
	ActionWithIndex,
	Closure,
	Comparison,
	EqualityComparison,
	Predicate,
	PredicateWithIndex,
	Selector,
	SelectorWithIndex
} from "../System/FunctionTypes";
import {IDictionary, IMap} from "../System/Collections/Dictionaries/IDictionary";
import {Comparable} from "../System/IComparable";
import {IComparer} from "../System/IComparer";
import {IKeyValuePair} from "../System/KeyValuePair";
import {Order} from "../System/Collections/Sorting/Order";
import {
	IFiniteEnumerable,
	IGrouping,
	IInfiniteEnumerable,
	ILinqEnumerable,
	ILookup,
	IOrderedEnumerable,
	NotEmptyEnumerable
} from "./Enumerable";
import {EnumerableAction} from "./EnumerableAction";
import {IndexEnumerator} from "../System/Collections/Enumeration/IndexEnumerator";
import {Primitive} from "../System/Primitive";
import {IteratorEnumerator} from "../System/Collections/Enumeration/IteratorEnumerator";
import {ForEachEnumerable} from "../System/Collections/Enumeration/ForEachEnumerable";
import {initialize} from "../System/Collections/Array/initialize";
import {Random} from "../System/Random";
import {
	InfiniteEnumerator,
	InfiniteValueFactory
} from "../System/Collections/Enumeration/InfiniteEnumerator";
import __extendsImport from "../extends";
import {LazyList} from "../System/Collections/LazyList";
import disposeSingle = dispose.single;
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;


// #region Local Constants.

const INVALID_DEFAULT:any = {}; // create a private unique instance for referencing.
const VOID0:undefined = void 0;
const NULL:any = null;
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


// Leave internal to avoid accidental overwriting.
class LinqFunctions
	extends BaseFunctions
{
	// noinspection JSMethodCanBeStatic
	Greater<T>(a:T, b:T)
	{
		return a>b ? a : b;
	}


	// noinspection JSMethodCanBeStatic
	Lesser<T>(a:T, b:T)
	{
		return a<b ? a : b;
	}
}

const Functions = Object.freeze(new LinqFunctions());

// For re-use as a factory.
function getEmptyEnumerator():IEnumerator<any>
{
	return EmptyEnumerator;
}

// #endregion


/*
 * NOTE: About InfiniteEnumerable<T> and Enumerable<T>.
 * There may seem like there's extra overrides here and they may seem unnecessary.
 * But after closer inspection you'll see the type chain is retained and
 * infinite enumerables are prevented from having features that finite ones have.
 *
 * I'm not sure if it's the best option to just use overrides, but it honors the typing properly.
 */

export class InfiniteLinqEnumerable<T>
	extends DisposableBase
	implements IInfiniteEnumerable<T>
{
	constructor(
		protected _enumeratorFactory:() => IEnumerator<T>,
		finalizer?:Closure | null)
	{
		super(finalizer);
		this._isEndless = true;
		this._disposableObjectName = "InfiniteLinqEnumerable";
	}

	protected _isEndless:boolean | undefined;
	get isEndless():boolean | undefined
	{
		return this._isEndless;
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
		(<any>this)._enumeratorFactory = null;
	}

	// #endregion

	// Return a default (unfiltered) enumerable.
	asEnumerable():this
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new InfiniteLinqEnumerable<T>(() => _.getEnumerator());
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
		onComplete?:Action<number>):InfiniteLinqEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure | null,
		isEndless?:boolean | null | undefined,
		onComplete?:Action<number>):LinqEnumerable<T>

	doAction(
		action:ActionWithIndex<T> | PredicateWithIndex<T> | SelectorWithIndex<T, number> | SelectorWithIndex<T, EnumerableAction>,
		initializer?:Closure | null,
		isEndless:boolean | null | undefined = this.isEndless,
		onComplete?:Action<number>):LinqEnumerable<T>
	{

		const _ = this;
		_.throwIfDisposed();
		const isE:boolean | undefined = isEndless || undefined; // In case it's null.
		if(!action)
			throw new ArgumentNullException("action");

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(!action);

						if(initializer) initializer();
						index = 0;
						enumerator = _.getEnumerator();
						// May need a way to propagate isEndless
					},

					(yielder) =>
					{
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

					() =>
					{
						if(enumerator) enumerator.dispose();
					},

					isE
				);

			},
			// Using a finalizer value reduces the chance of a circular reference
			// since we could simply reference the enumeration and check e.wasDisposed.
			() =>
			{
				action = NULL;
			},

			isE
		);
	}


	force():void
	{
		this.throwIfDisposed();
		this.doAction(BREAK)
			.getEnumerator()
			.moveNext();

	}

	// #region Indexing/Paging methods.
	skip(count:number):InfiniteLinqEnumerable<T>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return <any> new InfiniteLinqEnumerable<T>(getEmptyEnumerator);

		Integer.assert(count, "count");

		return this.where((element, index) => index>=count);
	}


	take(count:number):FiniteEnumerable<T>
	{
		if(!(count>0)) // Out of bounds? Empty.
			return Enumerable.empty<T>();

		const _ = this;
		_.throwIfDisposed();

		if(!isFinite(count))
			throw new ArgumentOutOfRangeException('count', count, 'Must be finite.');

		Integer.assert(count, "count");

		// Once action returns false, the enumeration will stop.
		return <any> _.doAction((element, index) => index<count, null, false);
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
			e =>
			{
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
			e =>
			{
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
			e =>
			{
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
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined):LinqEnumerable<T>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined):LinqEnumerable<TNode>;

	traverseDepthFirst<TResult>(
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseDepthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseDepthFirst<TNode>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:(
			element:TNode,
			nestLevel:number) => any = Functions.Identity):LinqEnumerable<any>
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		const isEndless = _._isEndless; // Is endless is not affirmative if false.

		return new LinqEnumerable<any>(
			() =>
			{
				// Dev Note: May want to consider using an actual stack and not an array.
				let enumeratorStack:IEnumerator<any>[];
				let enumerator:IEnumerator<any>;
				let len:number;  // Avoid using push/pop since they query .length every time and can be slower.

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
						enumeratorStack = [];
						len = 0;
					},

					(yielder) =>
					{
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

					() =>
					{
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
			() =>
			{
				disposed = true;
			},
			isEndless
		);
	}


	flatten<TFlat>():InfiniteLinqEnumerable<TFlat>
	flatten():InfiniteLinqEnumerable<any>
	flatten():InfiniteLinqEnumerable<any>
	{
		return this.selectMany(entry =>
		{
			let e = !Type.isString(entry) && Enumerable.fromAny(entry);
			return e ? e.flatten() : [entry];
		});
	}


	pairwise<TSelect>(
		selector:(
			previous:T, current:T,
			index:number) => TSelect):InfiniteLinqEnumerable<TSelect>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!selector)
			throw new ArgumentNullException("selector");

		let previous:T;
		return this.select<TSelect>((value, i) =>
		{
			const result:any = i ? selector(previous!, value, i) : NULL;
			previous = value;
			return result;
		}).skip(1);
	}

	scan(func:(previous:T, current:T, index:number) => T, seed?:T):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!func)
			throw new ArgumentNullException("func");

		return <this>(
			seed===VOID0
				? this.select((value, i) => seed = i ? func(seed!, value, i) : value)
				: this.select((value, i) => seed = func(seed!, value, i))
		);
	}

	// #endregion

	select<TResult>(selector:SelectorWithIndex<T, TResult>):InfiniteLinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):InfiniteLinqEnumerable<TResult>
	{
		return this._filterSelected(selector);
	}

	/*
	public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
		this IEnumerable<TSource> source,
		Func<TSource, IEnumerable<TCollection>> collectionSelector,
		Func<TSource, TCollection, TResult> resultSelector)
	 */

	protected _selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>,
		resultSelector?:(collection:T, element:TElement) => TResult):LinqEnumerable<TResult>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!collectionSelector)
			throw new ArgumentNullException("collectionSelector");

		const isEndless = _._isEndless; // Do second enumeration, it will be indeterminate if false.
		if(!resultSelector)
			resultSelector = (a:T, b:any) => <TResult>b;

		return new LinqEnumerable<TResult>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let middleEnumerator:IEnumerator<any> | null | undefined;
				let index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						throwIfDisposed(!collectionSelector);
						enumerator = _.getEnumerator();
						middleEnumerator = VOID0;
						index = 0;
					},

					(yielder) =>
					{
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

					() =>
					{
						if(enumerator) enumerator.dispose();
						disposeSingle(middleEnumerator);
						enumerator = NULL;
						middleEnumerator = null;
					},

					isEndless
				);
			},
			() =>
			{
				collectionSelector = NULL;
			},

			isEndless
		);
	}


	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>):InfiniteLinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):InfiniteLinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):InfiniteLinqEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	protected _filterSelected(
		selector?:SelectorWithIndex<T, T>,
		filter?:PredicateWithIndex<T>):LinqEnumerable<T>
	protected _filterSelected<TResult>(
		selector:SelectorWithIndex<T, TResult>,
		filter?:PredicateWithIndex<TResult>):LinqEnumerable<TResult>
	protected _filterSelected(
		selector:SelectorWithIndex<T, any> = Functions.Identity,
		filter?:PredicateWithIndex<any>):LinqEnumerable<any>
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		if(!selector)
			throw new ArgumentNullException("selector");

		return new LinqEnumerable<any>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let index:number = 0;


				return new EnumeratorBase<any>(
					() =>
					{
						throwIfDisposed(!selector);

						index = 0;
						enumerator = _.getEnumerator();
					},

					(yielder) =>
					{
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

					() =>
					{
						if(enumerator) enumerator.dispose();
					},

					_._isEndless
				);
			},

			() =>
			{
				disposed = false;
			},

			_._isEndless
		);
	}

	/**
	 * Returns selected values that are not null or undefined.
	 */
	choose():InfiniteLinqEnumerable<T>;
	choose<TResult>(selector?:Selector<T, TResult>):InfiniteLinqEnumerable<TResult>
	choose(selector:Selector<T, any> = Functions.Identity):InfiniteLinqEnumerable<any>
	{
		return this._filterSelected(selector, isNotNullOrUndefined);
	}

	where(predicate:PredicateWithIndex<T>):this
	{
		return <any>this._filterSelected(Functions.Identity, predicate);
	}

	filter(predicate:PredicateWithIndex<T>):this
	{
		return <any>this._filterSelected(Functions.Identity, predicate);
	}

	nonNull():this
	{
		return this.where(v => v!=null && v!=VOID0);
	}

	ofType<TType>(type:{ new (...params:any[]):TType }):InfiniteLinqEnumerable<TType>;
	ofType<TType>(type:any):InfiniteLinqEnumerable<TType>
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
				return <any> this
					.where(x => x instanceof type);
		}
		return <any>this
			.where(x => isNotNullOrUndefined(x) && typeof x===typeName);
	}

	except(
		second:ForEachEnumerable<T>,
		compareSelector?:Selector<T, string | number | symbol>):this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let keys:Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
						keys = new Dictionary<T, boolean>(compareSelector);
						if(second)
							enumUtil.forEach(second, key => { keys.addByKeyValue(key, true) });
					},

					(yielder) =>
					{
						throwIfDisposed(disposed);
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

					() =>
					{
						if(enumerator) enumerator.dispose();
						keys.clear();
					},

					isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			isEndless
		);
	}


	distinct(compareSelector?:Selector<T, string | number | symbol>):this
	{
		return this.except(NULL, compareSelector);
	}

	// [0,0,0,1,1,1,2,2,2,0,0,0,1,1] results in [0,1,2,0,1];
	distinctUntilChanged(compareSelector:Selector<T, any> = Functions.Identity):this
	{

		const _ = this;
		let disposed = !_.throwIfDisposed();
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let compareKey:any;
				let initial:boolean = true;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) =>
					{
						throwIfDisposed(disposed);
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

					() =>
					{
						if(enumerator) enumerator.dispose();
					},

					isEndless
				);
			},

			() =>
			{
				disposed = true;
			},

			isEndless
		);
	}

	/**
	 * Returns a single default value if empty.
	 * @param defaultValue
	 * @returns {Enumerable}
	 */
	defaultIfEmpty(defaultValue?:T):this
	{
		const _ = this;
		const disposed:boolean = !_.throwIfDisposed();
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let isFirst:boolean;

				return new EnumeratorBase<T>(
					() =>
					{
						isFirst = true;
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) =>
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
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}


	zip<TSecond, TResult>(
		second:ForEachEnumerable<TSecond>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):LinqEnumerable<TResult>
	{
		const _ = this;
		_.throwIfDisposed();


		return new LinqEnumerable<TResult>(
			() =>
			{
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<TSecond>;
				let index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumUtil.from<TSecond>(second);
					},

					(yielder) => firstEnumerator.moveNext()
					&& secondEnumerator.moveNext()
					&& yielder.yieldReturn(resultSelector(<T>firstEnumerator.current, <TSecond>secondEnumerator.current, index++)),

					() =>
					{
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						firstEnumerator = NULL;
						secondEnumerator = NULL;
					}
				);
			}
		);
	}


	zipMultiple<TSecond, TResult>(
		second:ArrayLike<ForEachEnumerable<TSecond>>,
		resultSelector:(first:T, second:TSecond, index:number) => TResult):LinqEnumerable<TResult>
	{
		const _ = this;
		_.throwIfDisposed();

		if(!second.length)
			return Enumerable.empty<TResult>();

		return new LinqEnumerable<TResult>(
			() =>
			{
				let secondTemp:Queue<any>;
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<TSecond>;
				let index:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						secondTemp = new Queue<any>(second);
						index = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = NULL;
					},

					(yielder) =>
					{
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

					() =>
					{
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


	// #region Join Methods

	join<TInner, TKey, TResult>(
		inner:ForEachEnumerable<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner) => TResult,
		compareSelector:Selector<TKey, string | number | symbol> = Functions.Identity):LinqEnumerable<TResult>
	{

		const _ = this;
		return new LinqEnumerable<TResult>(
			() =>
			{
				let outerEnumerator:IEnumerator<T>;
				let lookup:ILookup<TKey, TInner>;
				let innerElements:TInner[] | null;
				let innerCount:number = 0;

				return new EnumeratorBase<TResult>(
					() =>
					{
						outerEnumerator = _.getEnumerator();
						lookup = Enumerable.from(inner)
							.toLookup(innerKeySelector, Functions.Identity, compareSelector);
					},

					(yielder) =>
					{
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

					() =>
					{
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
		inner:ForEachEnumerable<TInner>,
		outerKeySelector:Selector<T, TKey>,
		innerKeySelector:Selector<TInner, TKey>,
		resultSelector:(outer:T, inner:TInner[] | null) => TResult,
		compareSelector:Selector<TKey, string | number | symbol> = Functions.Identity):LinqEnumerable<TResult>
	{
		const _ = this;

		return new LinqEnumerable<TResult>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let lookup:ILookup<TKey, TInner>;

				return new EnumeratorBase<TResult>(
					() =>
					{
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

					() =>
					{
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						lookup = NULL;
					}
				);
			}
		);
	}


	merge(enumerables:ArrayLike<ForEachEnumerable<T>>):this
	{
		const _ = this;
		const isEndless = _._isEndless;

		if(!enumerables || enumerables.length==0)
			return _;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let queue:Queue<ForEachEnumerable<T>>;

				return new EnumeratorBase<T>(
					() =>
					{
						// 1) First get our values...
						enumerator = _.getEnumerator();
						queue = new Queue<ForEachEnumerable<T>>(enumerables);
					},

					(yielder) =>
					{
						while(true)
						{

							while(!enumerator && queue.tryDequeue(value =>
							{
								enumerator = enumUtil.from<T>(value); // 4) Keep going and on to step 2.  Else fall through to yieldBreak().
							}))
							{ }

							if(enumerator && enumerator.moveNext()) // 2) Keep returning until done.
								return yielder.yieldReturn(enumerator.current);

							if(enumerator) // 3) Dispose and reset for next.
							{
								enumerator.dispose();
								enumerator = NULL;
								continue;
							}

							return yielder.yieldBreak();
						}
					},

					() =>
					{
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						if(queue) queue.dispose();
						queue = NULL;
					},

					isEndless
				);
			},
			null,
			isEndless
		);
	}

	concat(...enumerables:Array<ForEachEnumerable<T>>):this
	{
		return this.merge(enumerables);
	}


	union(
		second:ForEachEnumerable<T>,
		compareSelector:Selector<T, string | number | symbol> = Functions.Identity):this
	{
		const _ = this;
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<T>;
				let keys:Dictionary<T, any>;

				return new EnumeratorBase<T>(
					() =>
					{
						firstEnumerator = _.getEnumerator();
						keys = new Dictionary<T, any>(compareSelector); // Acting as a HashSet.
					},

					(yielder) =>
					{
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

					() =>
					{
						if(firstEnumerator) firstEnumerator.dispose();
						if(secondEnumerator) secondEnumerator.dispose();
						firstEnumerator = NULL;
						secondEnumerator = NULL;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}

	insertAt(index:number, other:ForEachEnumerable<T>):this
	{
		Integer.assertZeroOrGreater(index, 'index');
		const n:number = index;

		const _ = this;
		_.throwIfDisposed();
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{

				let firstEnumerator:IEnumerator<T>;
				let secondEnumerator:IEnumerator<T>;

				let count:number = 0;
				let isEnumerated:boolean = false;

				return new EnumeratorBase<T>(
					() =>
					{
						count = 0;
						firstEnumerator = _.getEnumerator();
						secondEnumerator = enumUtil.from<T>(other);
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
						if(firstEnumerator) firstEnumerator.dispose();
						firstEnumerator = NULL;
						if(secondEnumerator) secondEnumerator.dispose();
						secondEnumerator = NULL;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}


	alternateMultiple(sequence:ForEachEnumerable<T>):this
	{
		const _ = this;
		const isEndless = _._isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let buffer:T,
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

						let hasAtLeastOne = enumerator.moveNext();
						mode = hasAtLeastOne
							? EnumerableAction.Return
							: EnumerableAction.Break;

						if(hasAtLeastOne)
							buffer = <T>enumerator.current;
					},

					(yielder) =>
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

					() =>
					{
						if(enumerator) enumerator.dispose();
						if(alternateEnumerator) alternateEnumerator.dispose();
						enumerator = NULL;
						alternateEnumerator = NULL;
					},

					isEndless
				);
			},
			null,

			isEndless
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
		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;

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

					(yielder) =>
					{
						if(enumerator) try
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
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
					}
				);
			}
		);
	}

	finallyAction(action:Closure):this
	{
		const _ = this;
		const disposed = !_.throwIfDisposed();

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();
					},

					(yielder) =>
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
							if(enumerator) enumerator.dispose();
							enumerator = NULL;
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

	// #endregion

	buffer(size:number):InfiniteLinqEnumerable<T[]>
	{
		if(size<1 || !isFinite(size))
			throw new Error("Invalid buffer size.");

		Integer.assert(size, "size");

		const _ = this;
		const isEndless = _._isEndless;
		let len:number;

		return new LinqEnumerable<T[]>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				return new EnumeratorBase<T[]>(
					() =>
					{
						enumerator = _.getEnumerator();
					},

					(yielder) =>
					{
						let array:T[] = initialize<T>(size);
						len = 0;
						while(len<size && enumerator.moveNext())
						{
							array[len++] = <T>enumerator.current;
						}

						array.length = len;
						return !!len && yielder.yieldReturn(array);
					},

					() =>
					{
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
					},

					isEndless
				);
			},
			null,

			isEndless
		);
	}


	share():this
	{
		const _ = this;
		_.throwIfDisposed();

		let sharedEnumerator:IEnumerator<T>;
		return <any> new LinqEnumerable<T>(
			() =>
			{
				return sharedEnumerator || (sharedEnumerator = _.getEnumerator());
			},

			() =>
			{
				if(sharedEnumerator) sharedEnumerator.dispose();
				sharedEnumerator = NULL;
			},

			_._isEndless
		);
	}


}


/**
 * Enumerable<T> is a wrapper class that allows more primitive enumerables to exhibit LINQ behavior.
 *
 * In C# Enumerable<T> is not an instance but has extensions for IEnumerable<T>.
 * In this case, we use Enumerable<T> as the underlying class that is being chained.
 */
export class LinqEnumerable<T>
	extends InfiniteLinqEnumerable<T>
	implements ILinqEnumerable<T>
{

	constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:Closure | null,
		isEndless?:boolean)
	{
		super(enumeratorFactory, finalizer);
		this._isEndless = isEndless;
		this._disposableObjectName = "LinqEnumerable";
	}

	// Return a default (unfiltered) enumerable.
	asEnumerable():this
	{
		const _ = this;
		_.throwIfDisposed();
		return <any> new LinqEnumerable<T>(() => _.getEnumerator());
	}

// #region Indexing/Paging methods.

	skip(count:number):LinqEnumerable<T>
	{
		return <any>super.skip(count);
	}

	skipWhile(predicate:PredicateWithIndex<T>):LinqEnumerable<T>
	{
		this.throwIfDisposed();
		return this.doAction(
			(element:T, index:number) =>
				predicate(element, index)
					? EnumerableAction.Skip
					: EnumerableAction.Return
		);
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
			(element:T, index:number) =>
			{
				if(found)
					return EnumerableAction.Break;

				found = predicate(element, index);
				return EnumerableAction.Return;
			},
			() =>
			{
				found = false;
			},
			null // We don't know the state if it is endless or not.
		);
	}

	// Since an infinite enumerable will always end up traversing breadth first, we have this only here for regular enumerable.
	traverseBreadthFirst(
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined):LinqEnumerable<T>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined):LinqEnumerable<TNode>;

	traverseBreadthFirst<TResult>(
		childrenSelector:(element:T) => ForEachEnumerable<T> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseBreadthFirst<TNode, TResult>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>;

	traverseBreadthFirst<TNode>(
		childrenSelector:(element:T | TNode) => ForEachEnumerable<TNode> | null | undefined,
		resultSelector:(
			element:TNode,
			nestLevel:number) => any = Functions.Identity):LinqEnumerable<any>
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		const isEndless = _._isEndless; // Is endless is not affirmative if false.


		return new LinqEnumerable<any>(
			() =>
			{
				let enumerator:IEnumerator<any>;
				let nestLevel:number = 0;
				let buffer:any[], len:number;

				return new EnumeratorBase<any>(
					() =>
					{
						throwIfDisposed(disposed);
						enumerator = _.getEnumerator();

						nestLevel = 0;
						buffer = [];
						len = 0;
					},

					(yielder) =>
					{
						throwIfDisposed(disposed);

						while(true)
						{
							if(enumerator.moveNext())
							{
								buffer[len++] = enumerator.current;
								return yielder.yieldReturn(resultSelector(enumerator.current, nestLevel));
							}

							if(!len)
								return yielder.yieldBreak();

							let next = Enumerable
								.from(buffer)
								.selectMany(childrenSelector);

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
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						buffer.length = 0;
					},

					isEndless
				);
			},
			() =>
			{
				disposed = true;
			},

			isEndless
		);
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
			_.getEnumerator(), e =>
			{

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
		enumUtil.forEach<T>(this, (x, i) =>
		{
			target[i + index] = x
		}, count);

		return target;
	}


	toLookup<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue>             = Functions.Identity,
		compareSelector:Selector<TKey, string | number | symbol> = Functions.Identity):ILookup<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue[]> = new Dictionary<TKey, TValue[]>(compareSelector);
		this.forEach(
			(x, i) =>
			{
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
		this.forEach((x, i) =>
		{
			obj[keySelector(x, i)] = elementSelector(x, i);
		});
		return obj;
	}


	toDictionary<TKey, TValue>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TValue>,
		compareSelector:Selector<TKey, string | number | symbol> = Functions.Identity):IDictionary<TKey, TValue>
	{
		const dict:Dictionary<TKey, TValue> = new Dictionary<TKey, TValue>(compareSelector);
		this.forEach((x, i) => dict.addByKeyValue(keySelector(x, i), elementSelector(x, i)));
		return dict;
	}

	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		return this
			.select(selector)
			.toArray()
			.join(separator);
	}

	// #endregion


	takeExceptLast(count:number = 1):this
	{
		const _ = this;

		if(!(count>0)) // Out of bounds?
			return _;

		if(!isFinite(count)) // +Infinity equals skip all so return empty.
			return <any> Enumerable.empty<T>();

		Integer.assert(count, "count");
		const c = count;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let q:Queue<T>;

				return new EnumeratorBase<T>(
					() =>
					{
						enumerator = _.getEnumerator();
						q = new Queue<T>();
					},

					(yielder) =>
					{
						while(enumerator.moveNext())
						{
							// Add the next one to the queue.
							q.enqueue(<T>enumerator.current);

							// Did we reach our quota?
							if(q.count>c)
							// Okay then, start returning results.
								return yielder.yieldReturn(q.dequeue());
						}
						return false;
					},

					() =>
					{
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						if(q) q.dispose();
						q = NULL;
					}
				);
			}
		);
	}

	skipToLast(count:number):this
	{
		if(!(count>0)) // Out of bounds? Empty.
			return <any> Enumerable.empty<T>();

		const _ = this;

		if(!isFinite(count)) // Infinity means return all.
			return _;

		Integer.assert(count, "count");

		// This sets up the query so nothing is done until move next is called.
		return <any> _.reverse()
			.take(count)
			.reverse();
	}

	// To help with type guarding.

	select<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return <LinqEnumerable<TResult>>super.select(selector);
	}

	map<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	{
		return <LinqEnumerable<TResult>>super.select(selector);
	}

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TResult> | null | undefined>):LinqEnumerable<TResult>;

	selectMany<TElement, TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<TElement> | null | undefined>,
		resultSelector:(collection:T, element:TElement) => TResult):LinqEnumerable<TResult>;

	selectMany<TResult>(
		collectionSelector:SelectorWithIndex<T, ForEachEnumerable<any> | null | undefined>,
		resultSelector?:(collection:T, element:any) => TResult):LinqEnumerable<TResult>
	{
		return this._selectMany(collectionSelector, resultSelector);
	}

	choose():LinqEnumerable<T>;
	choose<TResult>(selector:SelectorWithIndex<T, TResult>):LinqEnumerable<TResult>
	choose(selector:SelectorWithIndex<T, any> = Functions.Identity):LinqEnumerable<any>
	{
		return this._filterSelected(selector, isNotNullOrUndefined);
	}

	reverse():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		throwIfEndless(_._isEndless); // Cannot reverse an endless collection...

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let buffer:T[];
				let index:number = 0;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						_.throwIfDisposed();
						buffer = _.toArray();
						index = buffer.length;
					},

					(yielder) => !!index && yielder.yieldReturn(buffer[--index]),

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

	shuffle():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();
		throwIfEndless(_._isEndless); // Cannot shuffle an endless collection...

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let buffer:T[];
				let capacity:number;
				let len:number;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						buffer = _.toArray();
						capacity = len = buffer.length;
					},

					(yielder) =>
					{
						// Avoid using major array operations like .slice();
						if(!len)
							return yielder.yieldBreak();

						let selectedIndex = Random.integer(len);
						let selectedValue = buffer[selectedIndex];

						buffer[selectedIndex] = buffer[--len]; // Take the last one and put it here.
						buffer[len] = NULL; // clear possible reference.

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

	count(predicate?:PredicateWithIndex<T>):number
	{
		let count:number = 0;
		this.forEach(
			predicate

				? (x, i) =>
			{
				if(predicate(x, i)) ++count;
			}

				: () =>
			{
				++count;
			}
		);

		return count;
	}

	// Akin to '.every' on an array.
	all(predicate:PredicateWithIndex<T>):boolean
	{
		if(!predicate)
			throw new ArgumentNullException("predicate");

		let result = true;
		this.forEach((x, i) =>
		{
			if(!predicate(x, i))
			{
				result = false;
				return false; // break
			}
		});
		return result;
	}

	// 'every' has been added here for parity/compatibility with an array.
	every(predicate:PredicateWithIndex<T>):boolean
	{
		return this.all(predicate);
	}

	// Akin to '.some' on an array.
	any(predicate?:PredicateWithIndex<T>):boolean
	{
		if(!predicate)
			return super.any();

		let result = false;
		// Splitting the forEach up this way reduces iterative processing.
		// forEach handles the generation and disposal of the enumerator.
		this.forEach(
			(x, i) =>
			{
				result = predicate(x, i); // false = not found and therefore it should continue.  true = found and break;
				return !result;
			});
		return result;

	}

	// 'some' has been added here for parity/compatibility with an array.
	some(predicate?:PredicateWithIndex<T>):boolean
	{
		return this.any(predicate);
	}


	contains(value:T, compareSelector?:Selector<T, any>):boolean
	{
		if(compareSelector)
		{
			const s = compareSelector(value);
			return this.any(v => areEqualValues(compareSelector(v), s));
		}
		return this.any(v => areEqualValues(v, value));
	}

	// Originally has an overload for a predicate,
	// but that's a bad idea since this could be an enumeration of functions and therefore fail the intent.
	// Better to chain a where statement first to be more explicit.
	indexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number
	{
		let found:number = -1;
		this.forEach(
			compareSelector
				? (element:T, i:number) =>
			{
				if(areEqualValues(compareSelector(element, i), compareSelector(value, i), true))
				{
					found = i;
					return false;
				}
			}
				: (element:T, i:number) =>
			{
				// Why?  Because NaN doesn't equal NaN. :P
				if(areEqualValues(element, value, true))
				{
					found = i;
					return false;
				}
			});


		return found;
	}

	lastIndexOf(value:T, compareSelector?:SelectorWithIndex<T, any>):number
	{
		let result:number = -1;
		this.forEach(
			compareSelector
				? (element:T, i:number) =>
			{
				if(areEqualValues(compareSelector(element, i), compareSelector(value, i), true)) result
					= i;
			}

				: (element:T, i:number) =>
			{
				if(areEqualValues(element, value, true)) result = i;
			});

		return result;
	}


	intersect(
		second:ForEachEnumerable<T>,
		compareSelector?:Selector<T, string | number | symbol>):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!second)
			throw new ArgumentNullException("second");

		const isEndless = _.isEndless;

		return <any> new LinqEnumerable<T>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let keys:Dictionary<T, boolean>;
				let outs:Dictionary<T, boolean>;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(!second);
						enumerator = _.getEnumerator();

						keys = new Dictionary<T, boolean>(compareSelector);
						outs = new Dictionary<T, boolean>(compareSelector);

						enumUtil.forEach(second, key =>
						{
							keys.addByKeyValue(key, true);
						});
					},

					(yielder) =>
					{
						while(enumerator.moveNext())
						{
							let current = <T>enumerator.current;
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
						if(enumerator) enumerator.dispose();
						if(keys) enumerator.dispose();
						if(outs) enumerator.dispose();
						enumerator = NULL;
						keys = NULL;
						outs = NULL;
					},
					isEndless
				);
			},
			() =>
			{
				second = NULL;
			},
			isEndless
		);
	}

	sequenceEqual(
		second:ForEachEnumerable<T>,
		equalityComparer:EqualityComparison<T> = areEqualValues):boolean
	{
		this.throwIfDisposed();

		return using(
			this.getEnumerator(),
			e1 => using(
				enumUtil.from(second),
				e2 =>
				{
					// if both are endless, this will never evaluate.
					throwIfEndless(e1.isEndless && e2.isEndless);

					while(e1.moveNext())
					{
						if(!e2.moveNext() || !equalityComparer(<T>e1.current, <T>e2.current))
							return false;
					}

					return !e2.moveNext();
				}
			)
		);
	}

	//isEquivalent(second:ForEachEnumerable<T>,
	//	equalityComparer:EqualityComparison<T> = valuesAreEqual):boolean
	//{
	//	return this
	//		.orderBy(keySelector)
	//		.sequenceEqual(Enumerable.from(second).orderBy(keySelector))
	//}


	// #endregion


	ofType<TType>(type:{ new (...params:any[]):TType }):LinqEnumerable<TType>;
	ofType<TType>(type:any):LinqEnumerable<TType>
	{
		this.throwIfDisposed();
		return <LinqEnumerable<TType>>super.ofType(type);
	}

// #region Ordering Methods

	orderBy<TKey extends Comparable>(keySelector:Selector<T, TKey> = Functions.Identity):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TKey>(this, keySelector, Order.Ascending);
	}

	orderUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, any>(this, null, Order.Ascending, null, comparison);
	}

	orderUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, any>(this, null, Order.Descending, null, comparison);
	}

	orderByDescending<TKey extends Comparable>(keySelector:Selector<T, TKey> = Functions.Identity):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TKey>(this, keySelector, Order.Descending);
	}

	/*
		 weightedSample(weightSelector) {
		 weightSelector = Utils.createLambda(weightSelector);
		 var source = this;

		 return new LinqEnumerable<T>(() => {
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

	buffer(size:number):LinqEnumerable<T[]>
	{
		return <LinqEnumerable<T[]>>super.buffer(size);
	}

	// #region Grouping Methods

	// Originally contained a result selector (not common use), but this could be done simply by a select statement after.

	groupBy<TKey>(keySelector:SelectorWithIndex<T, TKey>):LinqEnumerable<IGrouping<TKey, T>>;

	groupBy<TKey>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, T>,
		compareSelector?:Selector<TKey, string | number | symbol>):LinqEnumerable<IGrouping<TKey, T>>;

	groupBy<TKey, TElement>(
		keySelector:SelectorWithIndex<T, TKey>,
		elementSelector:SelectorWithIndex<T, TElement>,
		compareSelector?:Selector<TKey, string | number | symbol>):LinqEnumerable<IGrouping<TKey, TElement>>


	groupBy<TKey, TElement>(
		keySelector:SelectorWithIndex<T, TKey> | Selector<T, TKey>,
		elementSelector?:SelectorWithIndex<T, TElement> | Selector<T, TElement>,
		compareSelector?:Selector<TKey, string | number | symbol>):LinqEnumerable<IGrouping<TKey, TElement>>
	{
		if(!elementSelector) elementSelector = Functions.Identity; // Allow for 'null' and not just undefined.
		return new LinqEnumerable<IGrouping<TKey, TElement>>(
			() => this
				.toLookup(keySelector, elementSelector, compareSelector)
				.getEnumerator()
		);
	}

	partitionBy<TKey>(keySelector:Selector<T, TKey>):LinqEnumerable<IGrouping<TKey, T>>;
	partitionBy<TKey, TElement>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		resultSelector?:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>,
		compareSelector?:Selector<TKey, any>):LinqEnumerable<IGrouping<TKey, TElement>>;
	partitionBy<TKey, TElement>(
		keySelector:Selector<T, TKey>,
		elementSelector?:Selector<T, TElement>,
		resultSelector:(key:TKey, element:TElement[]) => IGrouping<TKey, TElement>
			= (key:TKey, elements:TElement[]) => new Grouping<TKey, TElement>(key, elements),
		compareSelector:Selector<TKey, any>
			= Functions.Identity):LinqEnumerable<IGrouping<TKey, T>> | LinqEnumerable<IGrouping<TKey, TElement>>
	{

		const _ = this;
		if(!elementSelector) elementSelector = Functions.Identity; // Allow for 'null' and not just undefined.
		return new LinqEnumerable<IGrouping<TKey, TElement>>(
			() =>
			{
				let enumerator:IEnumerator<T>;
				let key:TKey;
				let compareKey:any;
				let group:TElement[] | null;
				let len:number;

				return new EnumeratorBase<IGrouping<TKey, TElement>>(
					() =>
					{
						throwIfDisposed(!elementSelector);
						enumerator = _.getEnumerator();
						if(enumerator.moveNext())
						{
							let v = <T>enumerator.current;
							key = keySelector(v);
							compareKey = compareSelector(key);
							group = [elementSelector!(v)];
							len = 1;
						}
						else
							group = null;
					},

					(yielder) =>
					{
						throwIfDisposed(!elementSelector);

						if(!group)
							return yielder.yieldBreak();

						let hasNext:boolean, c:T;
						while((hasNext = enumerator.moveNext()))
						{
							c = <T>enumerator.current;
							if(areEqualValues(compareKey, compareSelector(keySelector(c))))
								group[len++] = elementSelector!(c);
							else
								break;
						}

						let result:IGrouping<TKey, TElement>
							    = resultSelector(key, group);

						if(hasNext)
						{
							c = <T>enumerator.current;
							key = keySelector(c);
							compareKey = compareSelector(key);
							group = [elementSelector!(c)];
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
						if(enumerator) enumerator.dispose();
						enumerator = NULL;
						group = null;
					}
				);
			},
			() =>
			{
				elementSelector = NULL;
			}
		);
	}

	// #endregion

	// #region Aggregate Methods

	flatten<TFlat>():LinqEnumerable<TFlat>
	flatten():LinqEnumerable<any>
	flatten():LinqEnumerable<any>
	{
		return <any>super.flatten();
	}

	pairwise<TSelect>(
		selector:(
			previous:T, current:T,
			index:number) => TSelect):LinqEnumerable<TSelect>
	{
		return <any>super.pairwise(selector);
	}

	aggregate(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;

	aggregate<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;

	aggregate<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue?:U):U | undefined
	{
		if(initialValue==VOID0)
		{
			this.forEach((value, i) =>
			{
				initialValue = i
					? reduction(initialValue!, value, i)
					: <any>value
			});
		} else {

			this.forEach((value, i) =>
			{
				initialValue = reduction(initialValue!, value, i)
			});

		}
		return initialValue;
	}

	reduce<T>(
		reduction:(previous:T, current:T, index?:number) => T):T | undefined;

	reduce<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue:U):U;

	/**
	 * Provided as an analog for array.reduce.  Simply a shortcut for aggregate.
	 * @param reduction
	 * @param initialValue
	 */
	reduce<U>(
		reduction:(previous:U, current:T, index?:number) => U,
		initialValue?:U):U | undefined
	{
		return this.aggregate(reduction, initialValue);
	}

	average(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let count = 0;
		const sum = this.sum((e, i) =>
		{
			count++;
			return selector(e, i);
		});

		return (isNaN(sum) || !count)
			? NaN
			: (sum/count);
	}

	// If using numbers, it may be useful to call .takeUntil(v=>v==Infinity,true) before calling max. See static versions for numbers.
	max():T | undefined
	{
		return this.aggregate(Functions.Greater);
	}

	min():T | undefined
	{
		return this.aggregate(Functions.Lesser);
	}

	maxBy(keySelector:Selector<T, Primitive> = Functions.Identity):T | undefined
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)>keySelector(b)) ? a : b);
	}

	minBy(keySelector:Selector<T, Primitive> = Functions.Identity):T | undefined
	{
		return this.aggregate((a:T, b:T) => (keySelector(a)<keySelector(b)) ? a : b);
	}

	// Addition...  Only works with numerical enumerations.
	sum(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let sum = 0;

		// This allows for infinity math that doesn't destroy the other values.
		let sumInfinite = 0; // Needs more investigation since we are really trying to retain signs.

		this.forEach(
			(x, i) =>
			{
				let value = selector(x, i);
				if(isNaN(value))
				{
					sum = NaN;
					return false;
				}
				if(isFinite(value))
					sum += value;
				else
					sumInfinite +=
						value>0 ? (+1) : (-1);
			}
		);

		return isNaN(sum) ? NaN : (sumInfinite ? (sumInfinite*Infinity) : sum);
	}

	// Multiplication...
	product(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let result = 1, exists:boolean = false;

		this.forEach(
			(x, i) =>
			{
				exists = true;
				let value = selector(x, i);
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

	/**
	 * Takes the first number and divides it by all following.
	 * @param selector
	 * @returns {number}
	 */
	quotient(selector:SelectorWithIndex<T, number> = Type.numberOrNaN):number
	{
		let count = 0;
		let result:number = NaN;

		this.forEach(
			(x, i) =>
			{
				let value = selector(x, i);
				count++;

				if(count===1)
				{
					result = value;
				}
				else
				{
					if(isNaN(value) || value===0 || !isFinite(value))
					{
						result = NaN;
						return false;
					}

					result /= value;
				}

			}
		);

		if(count===1)
			result = NaN;

		return result;
	}

	// #endregion

	// #region Single Value Return...

	last():T
	{
		const _ = this;
		_.throwIfDisposed();

		let value:T | undefined = VOID0;
		let found:boolean = false;
		_.forEach(
			x =>
			{
				found = true;
				value = x;
			}
		);

		if(!found) throw new Error("last:No element satisfies the condition.");
		return <any>value;
	}

	lastOrDefault():T | undefined
	lastOrDefault(defaultValue:T):T
	lastOrDefault(defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		let value:T | undefined = VOID0;
		let found:boolean = false;
		_.forEach(
			x =>
			{
				found = true;
				value = x;
			}
		);
		return (!found) ? defaultValue : value;
	}

	// #endregion

	memoize():this
	{
		let source = new LazyList(this);
		return <this>(new LinqEnumerable(() => source.getEnumerator(), () =>
		{
			source.dispose();
			source = <any>null
		}, this.isEndless));
	}

	throwWhenEmpty():NotEmptyEnumerable<T>
	{
		return <any>this.doAction(RETURN, null, this.isEndless, count =>
		{
			if(!count) throw "Collection is empty.";
		});
	}
}

// Provided for type guarding.
export class FiniteEnumerable<T>
	extends LinqEnumerable<T>
	implements IFiniteEnumerable<T>
{
	constructor(
		enumeratorFactory:() => IEnumerator<T>,
		finalizer?:Closure)
	{
		super(enumeratorFactory, finalizer, false);
		this._disposableObjectName = "FiniteEnumerable";
	}

}

class ArrayEnumerable<T>
	extends FiniteEnumerable<T>
{
	private _source:ArrayLike<T>;

	constructor(source:ArrayLike<T>)
	{
		super(() =>
		{
			_.throwIfDisposed();
			return new ArrayEnumerator<T>(() =>
			{
				_.throwIfDisposed("The underlying ArrayEnumerable was disposed.", "ArrayEnumerator");

				return _._source; // Should never be null, but ArrayEnumerable if not disposed simply treats null as empty array.
			});
		});

		const _ = this;
		_._disposableObjectName = "ArrayEnumerable";
		_._source = source;

	}

	protected _onDispose():void
	{
		super._onDispose();
		this._source = NULL;
	}

	get source():ArrayLike<T>
	{
		return this._source;
	}

	toArray():T[]
	{
		const _ = this;
		_.throwIfDisposed();

		return enumUtil.toArray(_._source);
	}

	asEnumerable():this
	{
		const _ = this;
		_.throwIfDisposed();

		return <any> new ArrayEnumerable<T>(this._source);
	}

	// Optimize forEach so that subsequent usage is optimized.
	forEach(action:ActionWithIndex<T>, max?:number):number
	forEach(action:PredicateWithIndex<T>, max?:number):number
	forEach(action:ActionWithIndex<T> | PredicateWithIndex<T>, max:number = Infinity):number
	{
		const _ = this;
		_.throwIfDisposed();

		return enumUtil.forEach(_._source, action, max);
	}

	// These methods should ALWAYS check for array length before attempting anything.

	any(predicate?:Predicate<T>):boolean
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source;
		let len = source.length;
		return !!len && (!predicate || super.any(predicate));
	}

	count(predicate?:Predicate<T>):number
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return len && (predicate ? super.count(predicate) : len);
	}

	elementAtOrDefault(index:number):T | undefined
	elementAtOrDefault(index:number, defaultValue:T):T
	elementAtOrDefault(index:number, defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();
		Integer.assertZeroOrGreater(index, 'index');

		const source = _._source;
		return index<source.length
			? source[index]
			: defaultValue;
	}

	last():T
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return (len)
			? source[len - 1]
			: super.last();
	}

	lastOrDefault():T | undefined
	lastOrDefault(defaultValue:T):T
	lastOrDefault(defaultValue?:T):T | undefined
	{
		const _ = this;
		_.throwIfDisposed();

		const source = _._source, len = source.length;
		return len
			? source[len - 1]
			: defaultValue;
	}

	skip(count:number):this
	{

		const _ = this;
		_.throwIfDisposed();

		if(!(count>0))
			return _;

		return <any> new LinqEnumerable<T>(
			() => new ArrayEnumerator<T>(() => _._source, count)
		);
	}

	takeExceptLast(count:number = 1):this
	{
		const _ = this;
		_.throwIfDisposed();

		return <any> _.take(_._source.length - count);
	}

	skipToLast(count:number):this
	{
		const _ = this;
		_.throwIfDisposed();

		if(!(count>0))
			return <any> Enumerable.empty<T>();

		if(!isFinite(count))
			return _;

		const len = _._source
			? _._source.length
			: 0;

		return <any> _.skip(len - count);
	}

	reverse():this
	{
		const _ = this;
		let disposed = !_.throwIfDisposed();

		return <any> new LinqEnumerable<T>(
			() =>
			{
				_.throwIfDisposed();
				return new IndexEnumerator<T>(
					() =>
					{
						let s = _._source;
						throwIfDisposed(disposed || !s);
						return {
							source: s,
							pointer: (s.length - 1),
							length: s.length,
							step: -1
						};
					}
				)
			},
			() =>
			{
				disposed = true;
			}
		);
	}

	memoize():this
	{
		return this.asEnumerable();
	}

	sequenceEqual(
		second:ForEachEnumerable<T>,
		equalityComparer:EqualityComparison<T> = areEqualValues):boolean
	{
		if(Type.isArrayLike(second))
			return Arrays.areEqual(this.source, second, true, equalityComparer);

		if(second instanceof ArrayEnumerable)
			return second.sequenceEqual(this.source, equalityComparer);

		return super.sequenceEqual(second, equalityComparer);
	}


	toJoinedString(separator:string = "", selector:Selector<T, string> = Functions.Identity)
	{
		const s = this._source;
		return !selector && (s) instanceof (Array)
			? (<Array<T>>s).join(separator)
			: super.toJoinedString(separator, selector);
	}

}


class Grouping<TKey, TElement>
	extends ArrayEnumerable<TElement>
	implements IGrouping<TKey, TElement>
{

	constructor(private _groupKey:TKey, elements:TElement[])
	{
		super(elements);
		this._disposableObjectName = "Grouping";
	}

	get key():TKey
	{
		return this._groupKey;
	}
}

class Lookup<TKey, TElement>
	implements ILookup<TKey, TElement>
{

	constructor(private _dictionary:IDictionary<TKey, TElement[]>)
	{
	}

	get count():number
	{
		return this._dictionary.count;
	}

	get(key:TKey):TElement[] | null
	{
		return this._dictionary.getValue(key) || null;
	}

	contains(key:TKey):boolean
	{
		return this._dictionary.containsKey(key);
	}

	getEnumerator():IEnumerator<Grouping<TKey, TElement>>
	{

		const _ = this;
		let enumerator:IEnumerator<IKeyValuePair<TKey, TElement[]>>;

		return new EnumeratorBase<Grouping<TKey, TElement>>(
			() =>
			{
				enumerator = _._dictionary.getEnumerator();
			},
			(yielder) =>
			{

				if(!enumerator.moveNext())
					return false;

				let current = <IKeyValuePair<TKey, TElement[]>>enumerator.current;
				return yielder.yieldReturn(new Grouping<TKey, TElement>(current.key, current.value));
			},
			() =>
			{
				if(enumerator) enumerator.dispose();
				enumerator = NULL;
			}
		);
	}

}


class OrderedEnumerable<T, TOrderBy extends Comparable>
	extends FiniteEnumerable<T>
	implements IOrderedEnumerable<T>
{

	constructor(
		private source:IEnumerable<T>,
		public keySelector:Selector<T, TOrderBy> | null,
		public order:Order,
		public parent?:OrderedEnumerable<T, any> | null,
		public comparer:Comparison<T> = compareValues)
	{
		super(NULL);
		throwIfEndless(source && source.isEndless);
		this._disposableObjectName = "OrderedEnumerable";
	}

	private createOrderedEnumerable(
		keySelector:Selector<T, TOrderBy>,
		order:Order):IOrderedEnumerable<T>
	{
		this.throwIfDisposed();
		return new OrderedEnumerable<T, TOrderBy>(this.source, keySelector, order, this);
	}

	thenBy(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Ascending);
	}

	thenUsing(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T, any>(this.source, null, Order.Ascending, this, comparison);
	}

	thenByDescending(keySelector:(value:T) => TOrderBy):IOrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, Order.Descending);
	}

	thenUsingReversed(comparison:Comparison<T>):IOrderedEnumerable<T>
	{
		return new OrderedEnumerable<T, any>(this.source, null, Order.Descending, this, comparison);
	}

	getEnumerator():EnumeratorBase<T>
	{
		const _ = this;
		_.throwIfDisposed();

		let buffer:T[];
		let indexes:number[];
		let index:number = 0;

		return new EnumeratorBase<T>(
			() =>
			{
				_.throwIfDisposed();
				index = 0;
				buffer = Enumerable.toArray(_.source);
				indexes = createSortContext(_)
					.generateSortedIndexes(buffer);
			},

			(yielder) =>
			{
				_.throwIfDisposed();
				return (index<indexes.length)
					? yielder.yieldReturn(buffer[indexes[index++]])
					: false;
			},

			() =>
			{
				if(buffer)
					buffer.length = 0;
				buffer = NULL;
				if(indexes)
					indexes.length = 0;
				indexes = NULL;
			},

			false
		);
	}

	protected _onDispose():void
	{
		const _:this = this;
		super._onDispose();
		_.source = NULL;
		_.keySelector = NULL;
		_.order = NULL;
		_.parent = NULL;
	}

}

// A private static helper for the weave function.
function nextEnumerator<T>(queue:Queue<IEnumerator<T>>, e:IEnumerator<T>):IEnumerator<T> | null
{
	if(e)
	{
		if(e.moveNext())
		{
			queue.enqueue(e);
		}
		else
		{
			if(e) e.dispose();
			return null;
		}
	}
	return e;
}

/**
 * Recursively builds a SortContext chain.
 * @param orderedEnumerable
 * @param currentContext
 * @returns {any}
 */
function createSortContext<T, TOrderBy extends Comparable>(
	orderedEnumerable:OrderedEnumerable<T, TOrderBy>,
	currentContext:IComparer<T> | null = null):KeySortedContext<T, TOrderBy>
{

	const context = new KeySortedContext<T, TOrderBy>(
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

function throwIfDisposed(disposed:true):true
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:false):never
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:boolean):true | never
//noinspection JSUnusedLocalSymbols
function throwIfDisposed(disposed:boolean):true | never
{
	if(disposed) throw new ObjectDisposedException("Enumerable");
	return true;
}
// #endregion

export function Enumerable<T>(
	source:InfiniteValueFactory<T>):InfiniteLinqEnumerable<T>
export function Enumerable<T>(
	source:ForEachEnumerable<T>,
	...additional:Array<ForEachEnumerable<T>>):LinqEnumerable<T>
export function Enumerable<T>(
	source:ForEachEnumerable<T> | InfiniteValueFactory<T>,
	...additional:Array<ForEachEnumerable<T>>):LinqEnumerable<T>
{
	return enumerableFrom(source, additional);
}

function enumerableFrom<T>(
	source:ForEachEnumerable<T> | InfiniteValueFactory<T>,
	additional?:Array<ForEachEnumerable<T>>):LinqEnumerable<T>
{
	let e = Enumerable.fromAny<T>(<any>source);
	if(!e) throw new UnsupportedEnumerableException();

	return (additional && additional.length)
		? <any>e.merge(additional)
		: <any>e;
}

export module Enumerable
{
	/**
	 * Universal method for converting a primitive enumerables into a LINQ enabled ones.
	 *
	 * Is not limited to TypeScript usages.
	 */
	export function from<T>(source:InfiniteValueFactory<T>):InfiniteLinqEnumerable<T>
	export function from<T>(
		source:ForEachEnumerable<T>,
		...additional:Array<ForEachEnumerable<T>>):LinqEnumerable<T>
	export function from<T>(
		source:ForEachEnumerable<T> | InfiniteValueFactory<T>,
		...additional:Array<ForEachEnumerable<T>>):LinqEnumerable<T>
	{
		return enumerableFrom(source, additional);
	}

	export function fromAny<T>(
		source:InfiniteValueFactory<T>):InfiniteLinqEnumerable<T>

	export function fromAny<T>(
		source:ForEachEnumerable<T>):LinqEnumerable<T>

	export function fromAny(
		source:any):LinqEnumerable<any> | undefined

	export function fromAny<T>(
		source:ForEachEnumerable<T>,
		defaultEnumerable:LinqEnumerable<T>):LinqEnumerable<T>

	export function fromAny<T>(
		source:any,
		defaultEnumerable?:LinqEnumerable<T>):LinqEnumerable<T> | InfiniteLinqEnumerable<T> | undefined
	{
		if(Type.isObject(source) || Type.isString(source))
		{
			if(source instanceof InfiniteLinqEnumerable)
				return source;

			if(Type.isArrayLike<T>(source))
				return new ArrayEnumerable<T>(source);

			if(isEnumerable<T>(source))
				return new LinqEnumerable<T>(
					() => source.getEnumerator(),
					null, source.isEndless);

			if(isEnumerator<T>(source))
				return new LinqEnumerable<T>(
					() => source, null, source.isEndless);

			if(isIterator<T>(source))
				return fromAny(new IteratorEnumerator(source));
		}
		else if(Type.isFunction(source))
		{
			return new InfiniteLinqEnumerable<T>(
				() => new InfiniteEnumerator<T>(source));
		}

		return defaultEnumerable;
	}

	export function fromThese<T>(sources:ForEachEnumerable<T>[]):LinqEnumerable<T>
	{
		switch(sources ? sources.length : 0)
		{
			case 0:
				return empty<T>();
			case 1:
				// Allow for validation and throwing...
				return enumerableFrom<T>(sources[0]);
			default:
				return empty<T>().merge(sources);
		}
	}

	export function fromOrEmpty<T>(source:ForEachEnumerable<T>):LinqEnumerable<T>
	{
		return fromAny(source) || empty<T>();
	}

	/**
	 * Static helper for converting enumerables to an array.
	 * @param source
	 * @returns {any}
	 */
	export function toArray<T>(source:ForEachEnumerable<T>):T[]
	{
		if(source instanceof LinqEnumerable)
			return source.toArray();

		return enumUtil.toArray(source);
	}


	export function _choice<T>(values:T[]):InfiniteLinqEnumerable<T>
	{
		return new InfiniteLinqEnumerable<T>(
			() => new EnumeratorBase<T>(
				null,
				(yielder) =>
				{
					throwIfDisposed(!values);
					return yielder.yieldReturn(Random.select.one(values));
				},
				true // Is endless!
			),
			() =>
			{
				values.length = 0;
				values = NULL;
			}
		);
	}

	export function choice<T>(values:ArrayLike<T>):InfiniteLinqEnumerable<T>
	{
		let len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		return _choice(copy(values));
	}

	export function chooseFrom<T>(arg:T, ...args:T[]):InfiniteLinqEnumerable<T>
	export function chooseFrom<T>(...args:T[]):InfiniteLinqEnumerable<T>
	{
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!args.length)
			throw new ArgumentOutOfRangeException('length', length);

		return _choice(args);
	}

	function _cycle<T>(values:T[]):InfiniteLinqEnumerable<T>
	{
		return new InfiniteLinqEnumerable<T>(
			() =>
			{
				let index:number = 0;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
					}, // Reinitialize the value just in case the enumerator is restarted.
					(yielder) =>
					{
						throwIfDisposed(!values);
						if(index>=values.length) index = 0;
						return yielder.yieldReturn(values[index++]);
					},
					true // Is endless!
				);
			},
			() =>
			{
				values.length = 0;
				values = NULL;
			}
		);
	}

	export function cycle<T>(values:ArrayLike<T>):InfiniteLinqEnumerable<T>
	{
		let len = values && values.length;
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!len || !isFinite(len))
			throw new ArgumentOutOfRangeException('length', length);

		// Make a copy to avoid modifying the collection as we go.
		return _cycle(copy(values));
	}

	export function cycleThrough<T>(arg:T, ...args:T[]):InfiniteLinqEnumerable<T>
	export function cycleThrough<T>(...args:T[]):InfiniteLinqEnumerable<T>
	{
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!args.length)
			throw new ArgumentOutOfRangeException('length', length);

		return _cycle(args);
	}

	export function empty<T>():FiniteEnumerable<T>
	{
		// Could be single export function instance, but for safety, we'll make a new one.
		return new FiniteEnumerable<T>(getEmptyEnumerator);
	}

	export function repeat<T>(element:T):InfiniteLinqEnumerable<T>;
	export function repeat<T>(element:T, count:number):FiniteEnumerable<T>;
	export function repeat<T>(element:T, count:number = Infinity):LinqEnumerable<T>
	{
		if(!(count>0))
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			? new FiniteEnumerable<T>(
				() =>
				{
					let c:number = count;
					let index:number = 0;

					return new EnumeratorBase<T>(
						() => { index = 0; },
						(yielder) => (index++<c) && yielder.yieldReturn(element),
						null,
						false
					);
				}
			)
			: new LinqEnumerable<T>(
				() =>
					new EnumeratorBase<T>(
						null,
						(yielder) => yielder.yieldReturn(element),
						true // Is endless!
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
		finalizer:Closure):InfiniteLinqEnumerable<T>
	export function repeatWithFinalize<T>(
		initializer:() => T,
		finalizer?:Action<T>):InfiniteLinqEnumerable<T>
	export function repeatWithFinalize<T>(
		initializer:() => T,
		finalizer?:Action<T>):InfiniteLinqEnumerable<T>
	{
		if(!initializer)
			throw new ArgumentNullException("initializer");

		return new InfiniteLinqEnumerable<T>(
			() =>
			{
				let element:T;
				return new EnumeratorBase<T>(
					() =>
					{
						if(initializer)
							element = initializer();
					},

					(yielder) =>
					{
						return initializer
							? yielder.yieldReturn(element)
							: yielder.yieldBreak();
					},

					() =>
					{
						element = NULL;
						if(finalizer) finalizer(element);
					},

					true // Is endless!

				);
			},
			() =>
			{
				initializer = NULL;
				finalizer = VOID0;
			}
		);
	}

	/**
	 * Creates an enumerable of one element.
	 * @param element
	 * @returns {FiniteEnumerable<T>}
	 */
	export function make<T>(element:T):FiniteEnumerable<T>
	{
		return repeat<T>(element, 1);
	}

// start and step can be other than integer.

	export function range(
		start:number,
		count:number,
		step:number = 1):FiniteEnumerable<number>
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

		return new FiniteEnumerable<number>(
			() =>
			{
				let value:number;
				let c:number = count; // Force integer evaluation.
				let index:number = 0;

				return new EnumeratorBase<number>(
					() =>
					{
						index = 0;
						value = start;
					},

					(yielder) =>
					{
						let result:boolean =
							    index++<c
							    && yielder.yieldReturn(value);

						if(result && index<count)
							value += step;

						return result;
					},

					false
				);
			});
	}

	export function rangeDown(
		start:number,
		count:number,
		step:number = 1):FiniteEnumerable<number>
	{
		step = Math.abs(step)* -1;

		return range(start, count, step);
	}

// step = -1 behaves the same as toNegativeInfinity;
	export function toInfinity(
		start:number = 0,
		step:number  = 1):InfiniteLinqEnumerable<number>
	{
		if(!isFinite(start))
			throw new ArgumentOutOfRangeException("start", start, "Must be a finite number.");

		if(!step)
			throw new ArgumentOutOfRangeException("step", step, "Must be a valid value");

		if(!isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite number.");

		return new InfiniteLinqEnumerable<number>(
			() =>
			{
				let value:number;

				return new EnumeratorBase<number>(
					() =>
					{
						value = start;
					},

					(yielder) =>
					{
						let current:number = value;
						value += step;
						return yielder.yieldReturn(current);
					},

					true // Is endless!
				);
			}
		);
	}

	export function toNegativeInfinity(
		start:number = 0,
		step:number  = 1):InfiniteLinqEnumerable<number>
	{
		return toInfinity(start, -step);
	}

	export function rangeTo(
		start:number,
		to:number,
		step:number = 1):FiniteEnumerable<number>
	{
		if(isNaN(to) || !isFinite(to))
			throw new ArgumentOutOfRangeException("to", to, "Must be a finite number.");

		if(step && !isFinite(step))
			throw new ArgumentOutOfRangeException("step", step, "Must be a finite non-zero number.");

// This way we adjust for the delta from start and to so the user can say +/- step and it will work as expected.
		step = Math.abs(step);

		return new FiniteEnumerable<number>(
			() =>
			{
				let value:number;

				return new EnumeratorBase<number>(() => { value = start; },
					start<to
						? yielder =>
					{
						let result:boolean = value<=to && yielder.yieldReturn(value);

						if(result)
							value += step;

						return result;
					}
						: yielder =>
					{
						let result:boolean = value>=to && yielder.yieldReturn(value);

						if(result)
							value -= step;

						return result;
					}
					, false);
			}
		);
	}

	export function matches(
		input:string, pattern:any,
		flags:string = ""):FiniteEnumerable<RegExpExecArray>
	{
		if(input==null)
			throw new ArgumentNullException("input");
		const type = typeof input;
		if(type!=Type.STRING)
			throw new Error("Cannot exec RegExp matches of type '" + type + "'.");

		if(pattern instanceof RegExp)
		{
			flags += (pattern.ignoreCase) ? "i" : "";
			flags += (pattern.multiline) ? "m" : "";
			pattern = pattern.source;
		}

		if(flags.indexOf("g")=== -1) flags += "g";

		return new FiniteEnumerable<RegExpExecArray>(
			() =>
			{
				let regex:RegExp;
				return new EnumeratorBase<RegExpExecArray>(
					() =>
					{
						regex = new RegExp(pattern, flags);
					},

					(yielder) =>
					{
						// Calling regex.exec consecutively on the same input uses the lastIndex to start the next match.
						let match = regex.exec(input);
						return match!=null
							? yielder.yieldReturn(match)
							: yielder.yieldBreak();
					}
				);
			}
		);
	}

	export function generate<T>(factory:() => T):InfiniteLinqEnumerable<T>;
	export function generate<T>(factory:() => T, count:number):FiniteEnumerable<T>;
	export function generate<T>(factory:(index:number) => T):InfiniteLinqEnumerable<T>;
	export function generate<T>(factory:(index:number) => T, count:number):FiniteEnumerable<T>;
	export function generate<T>(
		factory:(index?:number) => T,
		count:number = Infinity):InfiniteLinqEnumerable<T>
	{
		if(!factory)
			throw new ArgumentNullException("factory");

		if(isNaN(count) || count<=0)
			return Enumerable.empty<T>();

		return isFinite(count) && Integer.assert(count, "count")
			? new FiniteEnumerable<T>(
				() =>
				{
					let c:number = count;
					let index:number = 0;

					return new EnumeratorBase<T>(
						() =>
						{
							index = 0;
						},

						(yielder) =>
						{
							throwIfDisposed(!factory);
							let current:number = index++;
							return current<c && yielder.yieldReturn(factory(current));
						},

						false
					);
				},
				() =>
				{
					factory = NULL;
				})
			: new InfiniteLinqEnumerable<T>(
				() =>
				{
					let index:number = 0;
					return new EnumeratorBase<T>(
						() =>
						{
							index = 0;
						},

						(yielder) =>
						{
							throwIfDisposed(!factory);
							return yielder.yieldReturn(factory(index++));
						},

						true // Is endless!
					);
				},
				() =>
				{
					factory = NULL;
				});
	}


	export module random
	{
		export function floats(maxExclusive:number = 1):InfiniteLinqEnumerable<number>
		{
			return generate(Random.generate(maxExclusive));
		}

		export function integers(boundary:number, inclusive?:boolean):InfiniteLinqEnumerable<number>
		{
			return generate(Random.generate.integers(boundary, inclusive));
		}
	}

	export function unfold<T>(
		seed:T,
		valueFactory:SelectorWithIndex<T, T>,
		skipSeed:Boolean = false):InfiniteLinqEnumerable<T>
	{
		if(!valueFactory)
			throw new ArgumentNullException("factory");

		return new InfiniteLinqEnumerable<T>(
			() =>
			{
				let index:number = 0;
				let value:T;
				let isFirst:boolean;
				return new EnumeratorBase<T>(
					() =>
					{
						index = 0;
						value = seed;
						isFirst = !skipSeed;
					},

					(yielder) =>
					{
						throwIfDisposed(!valueFactory);
						let i = index++;
						if(isFirst)
							isFirst = false;
						else
							value = valueFactory(value, i);
						return yielder.yieldReturn(value);
					},

					true // Is endless!
				);
			},
			() =>
			{
				valueFactory = NULL;
			}
		);
	}

	export function forEach<T>(
		e:ForEachEnumerable<T>,
		action:ActionWithIndex<T>,
		max?:number):number

	export function forEach<T>(
		e:ForEachEnumerable<T>,
		action:PredicateWithIndex<T>,
		max?:number):number

	export function forEach<T>(
		enumerable:ForEachEnumerable<T>,
		action:ActionWithIndex<T> | PredicateWithIndex<T>,
		max:number = Infinity):number
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return enumUtil.forEach(enumerable, action, max);
	}

	export function map<T, TResult>(
		enumerable:ForEachEnumerable<T>,
		selector:SelectorWithIndex<T, TResult>):TResult[]
	{
		// Will properly dispose created enumerable.
		// Will throw if enumerable is endless.
		return enumUtil.map(enumerable, selector);
	}

// Slightly optimized versions for numbers.
	export function max(values:FiniteEnumerable<number>):number
	{
		const v = values
			.takeUntil(v => v== +Infinity, true)
			.aggregate(Functions.Greater);

		return v===VOID0 ? NaN : v;
	}

	export function min(values:FiniteEnumerable<number>):number
	{
		const v = values
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
		enumerables:ForEachEnumerable<ForEachEnumerable<T>>):LinqEnumerable<T>
	{
		if(!enumerables)
			throw new ArgumentNullException('enumerables');

		let disposed = false;
		return new LinqEnumerable<T>(
			() =>
			{
				let queue:Queue<IEnumerator<T>>;
				let mainEnumerator:IEnumerator<ForEachEnumerable<T>> | null;
				let index:number;

				return new EnumeratorBase<T>(
					() =>
					{
						throwIfDisposed(disposed);
						index = 0;
						queue = new Queue<IEnumerator<T>>();
						mainEnumerator = enumUtil.from(enumerables);
					},

					(yielder) =>
					{
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

						while(!e && queue.tryDequeue(value =>
						{
							e = nextEnumerator(queue, enumUtil.from<T>(value));
						}))
						{ }

						return e
							? yielder.yieldReturn(e.current)
							: yielder.yieldBreak();

					},

					() =>
					{
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
			() =>
			{
				disposed = true;
			}
		);
	}

}

export default Enumerable;
