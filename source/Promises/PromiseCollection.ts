/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import {Fulfilled, handleSyncIfPossible} from "./Promise";
import DisposableBase from "../Disposable/DisposableBase";
import ArrayPromise from "./ArrayPromise";
import all from "./Functions/all";
import race from "./Functions/race";
import waitAll from "./Functions/waitAll";
import PromiseBase from "./PromiseBase";
import wrap from "./Functions/wrap";
import isPromise from "./Functions/isPromise";

/**
 * A Promise collection exposes useful methods for handling a collection of promises and their results.
 */
export default class PromiseCollection<T>
	extends DisposableBase
{
	private _source:PromiseLike<T>[];

	constructor(source:PromiseLike<T>[] | null | undefined)
	{
		super("PromiseCollection");
		this._source = source && source.slice() || [];
	}

	protected _onDispose()
	{
		super._onDispose();
		this._source.length = 0;
		(<any>this)._source = null;
	}

	/**
	 * Returns a copy of the source promises.
	 * @returns {PromiseLike<PromiseLike<any>>[]}
	 */
	get promises():PromiseLike<T>[]
	{
		this.throwIfDisposed();
		return this._source.slice();
	}

	/**
	 * Returns a promise that is fulfilled with an array containing the fulfillment value of each promise, or is rejected with the same rejection reason as the first promise to be rejected.
	 * @returns {PromiseBase<any>}
	 */
	all():ArrayPromise<T>
	{
		this.throwIfDisposed();
		return all(this._source);
	}

	/**
	 * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
	 * or rejected.
	 * @returns {PromiseBase<any>} A new Promise.
	 */
	race():PromiseBase<T>
	{
		this.throwIfDisposed();
		return race(this._source);
	}

	/**
	 * Returns a promise that is fulfilled with array of provided promises when all provided promises have resolved (fulfill or reject).
	 * Unlike .all this method waits for all rejections as well as fulfillment.
	 * @returns {PromiseBase<PromiseLike<any>[]>}
	 */
	waitAll():ArrayPromise<PromiseLike<T>>
	{
		this.throwIfDisposed();
		return waitAll(this._source);
	}

	/**
	 * Waits for all the values to resolve and then applies a transform.
	 * @param transform
	 * @returns {PromiseBase<Array<any>>}
	 */
	map<U>(transform:(value:T) => U):ArrayPromise<U>
	{
		this.throwIfDisposed();
		return new ArrayPromise<U>(resolve => {
			this.all()
				.doneNow(result => resolve(result.map(transform)));
		}, true);
	}

	/**
	 * Applies a transform to each promise and defers the result.
	 * Unlike map, this doesn't wait for all promises to resolve, ultimately improving the async nature of the request.
	 * @param transform
	 * @returns {PromiseCollection<U>}
	 */

	pipe<U>(transform:(value:T) => U | PromiseLike<U>):PromiseCollection<U>
	{
		this.throwIfDisposed();
		return new PromiseCollection<U>(
			this._source.map(p => handleSyncIfPossible(p, transform))
		);
	}

	reduce(
		reduction:(previousValue:T, currentValue:T, i?:number, array?:PromiseLike<T>[]) => T,
		initialValue?:T | PromiseLike<T>):PromiseBase<T>

	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:PromiseLike<T>[]) => U,
		initialValue:U | PromiseLike<U>):PromiseBase<U>

	/**
	 * Behaves like array reduce.
	 * Creates the promise chain necessary to produce the desired result.
	 * @param reduction
	 * @param initialValue
	 * @returns {PromiseBase<PromiseLike<any>>}
	 */
	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:PromiseLike<T>[]) => U,
		initialValue?:U | PromiseLike<U>):PromiseBase<U>
	{
		this.throwIfDisposed();
		return wrap<U>(this._source
			.reduce(
				(
					previous:PromiseLike<U>,
					current:PromiseLike<T>,
					i:number,
					array:PromiseLike<T>[]) =>
					handleSyncIfPossible(previous,
						(p:U) => handleSyncIfPossible(current, (c:T) => reduction(p, c, i, array))),

				isPromise(initialValue)
					? initialValue
					: new Fulfilled(<any>initialValue)
			)
		);
	}
}
