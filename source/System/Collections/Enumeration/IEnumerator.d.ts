/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path='../../Disposable/IDisposable.d.ts'/>

// IIterator is added for future compatibility.
interface IEnumerator<T> extends IIterator<T>, IDisposable {

	/**
	 * The current value within the enumeration.
	 */
	current: T;

	/**
	 * Safely moves to the next entry and returns true if there is one.
	 */
	moveNext(): boolean;

	/**
	 * Restarts the enumeration.
	 */
	reset(): void;

	/**
	 * Calls .moveNext() and returns .current
	 */
	nextValue():T;
}
