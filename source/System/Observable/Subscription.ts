/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */


import {IDisposableAware} from "../Disposable/IDisposableAware";
import {ISubscribable} from "./ISubscribable"; // For compatibility with (let, const, function, class);

/**
 * A registration that an IObservable returns that can be disposed in order to cancel sending data to the observer.
 */
export class Subscription<T> implements IDisposableAware
{
	constructor(
		private _subscribable: ISubscribable<T>,
		private _subscriber: T)
	{
		if (!_subscribable || !_subscriber)
			throw 'Subscribable and subscriber cannot be null.';
	}

	get subscriber():T {
		return this._subscriber;
	}

	/*
	 In the case where we could possibly have the following happen:

	 var u = observable.subscribe(observer);

	 ...

	 u.dispose(); // Should only be allowed to unsubscribe once and then it's useless.

	 // Resubscribing creates a new instance.
	 var x = observable.subscribe(observer);

	 u.dispose(); // Calling this again should do nothing and 'x' should still work.
	 */

	get wasDisposed(): boolean
	{
		return !this._subscribable || !this._subscriber;
	}

	dispose(): void
	{
		var subscriber = this.subscriber;
		var subscribable = this._subscribable;

		// Release the references.  Will prevent potential unwanted recursion.
		this._subscriber = null;
		this._subscribable = null;


		if (subscriber && subscribable)
		{
			subscribable.unsubscribe(subscriber);
		}
	}
}

export default Subscription;
