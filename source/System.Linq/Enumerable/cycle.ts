/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import {EndlessEnumeratorBase} from "../../System/Collections/Enumeration/EnumeratorBase";
import ArgumentOutOfRangeException from "../../System/Exceptions/ArgumentOutOfRangeException";
import copy from "../../System/Collections/Array/copy";
import EndlessLinqEnumerable, {ILinqEndless} from "../EndlessLinqEnumerable";
import throwObjectDisposed from "../throwObjectDisposed";

function _cycle<T>(values:T[]):ILinqEndless<T>
{
	return new EndlessLinqEnumerable<T>(
		() => {
			let index:number = 0;
			return new EndlessEnumeratorBase<T>(
				() => {
					index = 0;
				}, // Reinitialize the value just in case the enumerator is restarted.
				(yielder) => {
					throwObjectDisposed(!values);
					if(index>=values.length) index = 0;
					return yielder.yieldReturn(values[index++]);
				}
			);
		},
		() => {
			values.length = 0;
			values = <any>null;
		}
	);
}

export function cycle<T>(values:ArrayLike<T>):ILinqEndless<T>
{
	let len = values && values.length;
	// We could return empty if no length, but that would break the typing and produce unexpected results.
	// Enforcing that there must be at least 1 choice is key.
	if(!len || !isFinite(len))
		throw new ArgumentOutOfRangeException('length', length);

	// Make a copy to avoid modifying the collection as we go.
	return _cycle(copy(values));
}

export namespace cycle {
	export function through<T>(arg:T, ...args:T[]):ILinqEndless<T>
	export function through<T>(...args:T[]):ILinqEndless<T>
	{
		// We could return empty if no length, but that would break the typing and produce unexpected results.
		// Enforcing that there must be at least 1 choice is key.
		if(!args.length)
			throw new ArgumentOutOfRangeException('length', length);

		return _cycle(args);
	}
}

export default cycle;
