/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */

///<reference path="../Disposable/IDisposable.d.ts"/>
///<reference path="../FunctionTypes.d.ts"/>
'use strict'; // For compatibility with (let, const, function, class);

import LinkedList from '../Collections/LinkedList';
import * as DisposeUtility from '../Disposable/Utility'
import Subscription from './Subscription';

// This class is very much akin to a registry or 'Set' but uses an intermediary (Subscription) for releasing the registration.

export default
class SubscribableBase<TSubscriber>
implements IDisposable
{

	// Use a linked list since it's much easier to remove a subscriber from anywhere in the list.
	private __subscriptions:LinkedList<Subscription<TSubscriber>>;

	protected _getSubscribers():TSubscriber[] {
		return this.__subscriptions
			.toArray()
			.map(s=>s.subscriber);
	}

	constructor()
	{
		this.__subscriptions = new LinkedList<Subscription<TSubscriber>>();
	}

	private _findEntryNode(
		subscriber:TSubscriber):ILinkedListNode<Subscription<TSubscriber>>
	{
		var node = this.__subscriptions.first;
		while(node)
		{
			if(node.value.subscriber===subscriber)
			{
				break;
			}
			else
			{
				node = node.next;
			}
		}

		return node;
	}

	// It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
	subscribe(subscriber:TSubscriber):IDisposable
	{
		var _ = this;
		var n = _._findEntryNode(subscriber);
		if(n) // Ensure only one instance of the existing subscription exists.
			return n.value;

		var s = new Subscription(_, subscriber);
		_.__subscriptions.add(s);

		return s;
	}

	unsubscribe(subscriber:TSubscriber):void
	{
		var n = this._findEntryNode(subscriber);
		if(n)
		{
			var s = n.value;
			n.remove();
			s.dispose(); // Prevent further usage of a dead subscription.
		}
	}

	protected _unsubscribeAll(returnSubscribers:boolean = false):TSubscriber[] {
		var _ = this, _s = _.__subscriptions;
		var s = _s.toArray();
		var u = returnSubscribers ? s.map(o=>o.subscriber) : null;
		_s.clear(); // Reset...

		DisposeUtility.disposeThese(s);

		return u;
	}

	unsubscribeAll():void {
		this._unsubscribeAll();
	}

	dispose() {
		this._unsubscribeAll();
	}

}
