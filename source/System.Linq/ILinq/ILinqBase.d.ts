/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import FiniteEnumerableOrArrayLike from "../../System/Collections/FiniteEnumerableOrArrayLike";
import {IDisposable} from "../../System/Disposable/IDisposable";
import {Action, Closure, HashSelector, PredicateWithIndex} from "../../System/FunctionTypes";
import NotEmpty from "./ILinqNotEmpty";

export default interface ILinqBase<T>
	extends IDisposable
{
	force():void

	takeWhile(predicate:PredicateWithIndex<T>):this

	takeUntil(predicate:PredicateWithIndex<T>, includeUntilValue?:boolean):this

	elementAt(index:number):T

	elementAtOrDefault(index:number):T | undefined

	elementAtOrDefault(index:number, defaultValue:T):T

	first():T

	firstOrDefault():T | undefined

	firstOrDefault(defaultValue:T):T

	single():T

	singleOrDefault():T | undefined

	singleOrDefault(defaultValue:T):T

	singleOrDefault(defaultValue?:T):T | undefined

	any():boolean

	isEmpty():boolean

	memoize():this

	skip(count:number):this

	where(predicate:PredicateWithIndex<T>):this

	nonNull():this

	except(
		second:FiniteEnumerableOrArrayLike<T>,
		compareSelector?:HashSelector<T>):this

	distinct(compareSelector?:HashSelector<T>):this

	distinctUntilChanged(compareSelector?:HashSelector<T>):this

	defaultIfEmpty(defaultValue?:T):this & NotEmpty<T>

	insertAt(index:number, other:FiniteEnumerableOrArrayLike<T>):this

	alternateMultiple(sequence:FiniteEnumerableOrArrayLike<T>):this

	alternateSingle(value:T):this

	catchError(handler:Action<any>):this

	finallyAction(action:Closure):this

	share():this

	// traverse():TraversalController<T>
	//
	// flatten<TFlat>():ILinqBase<TFlat>
	// flatten():ILinqBase<any>
}