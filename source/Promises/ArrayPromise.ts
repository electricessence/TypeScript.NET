/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import Promise from "./Promise";
import PromiseBase from "./PromiseBase";

/**
 * By providing an ArrayPromise we expose useful methods/shortcuts for dealing with array results.
 */
export default class ArrayPromise<T>
	extends Promise<T[]>
{

	/**
	 * Simplifies the use of a map function on an array of results when the source is assured to be an array.
	 * @param transform
	 * @returns {PromiseBase<Array<any>>}
	 */
	map<U>(transform:(value:T) => U):ArrayPromise<U>
	{
		this.throwIfDisposed();
		return new ArrayPromise<U>(resolve => {
			this.doneNow(result => resolve(result.map(transform)));
		}, true);
	}

	reduce(
		reduction:(previousValue:T, currentValue:T, i?:number, array?:T[]) => T,
		initialValue?:T):PromiseBase<T>

	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:T[]) => U,
		initialValue:U):PromiseBase<U>

	/**
	 * Simplifies the use of a reduce function on an array of results when the source is assured to be an array.
	 * @param reduction
	 * @param initialValue
	 * @returns {PromiseBase<any>}
	 */
	reduce<U>(
		reduction:(previousValue:U, currentValue:T, i?:number, array?:T[]) => U,
		initialValue?:U):PromiseBase<U>
	{

		return this
			.thenSynchronous(result => result.reduce(reduction, <any>initialValue));
	}

	static fulfilled<T>(value:T[]):ArrayPromise<T>
	{
		return new ArrayPromise<T>(resolve => value, true);
	}
}

