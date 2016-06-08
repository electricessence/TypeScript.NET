/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */


import {LinkedNodeList} from "../Collections/LinkedNodeList";
import {dispose} from "../Disposable/dispose";
import {Subscription} from "./Subscription";
import {ILinkedNodeWithValue} from "../Collections/ILinkedListNode";
import {IDisposable} from "../Disposable/IDisposable";
import {DisposableBase} from "../Disposable/DisposableBase";

// This class is very much akin to a registry or 'Set' but uses an intermediary (Subscription) for releasing the registration.
export class SubscribableBase<TSubscriber>
extends DisposableBase
{

	// Use a linked list since it's much easier to remove a subscriber from anywhere in the list.
	private __subscriptions:LinkedNodeList<ILinkedNodeWithValue<Subscription<TSubscriber>>>;

	protected _getSubscribers():TSubscriber[]
	{
		var s = this.__subscriptions;
		return s && s.map(node=>node.value && node.value.subscriber);
	}

	constructor()
	{
		super();
	}

	private _findEntryNode(
		subscriber:TSubscriber):ILinkedNodeWithValue<Subscription<TSubscriber>>
	{
		var s = this.__subscriptions;
		return s && s.find(n=>n.value.subscriber===subscriber);
	}

	// It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
	subscribe(subscriber:TSubscriber):IDisposable
	{
		const _ = this;
		_.throwIfDisposed();

		var n = _._findEntryNode(subscriber);
		if(n) // Ensure only one instance of the existing subscription exists.
			return n.value;

		var _s = _.__subscriptions;
		if(!_s) _.__subscriptions = _s = new LinkedNodeList<ILinkedNodeWithValue<Subscription<TSubscriber>>>();

		var s = new Subscription(_, subscriber);
		_s.addNode({value: s});

		return s;
	}

	unsubscribe(subscriber:TSubscriber):void
	{
		const _ = this;
		// _.throwIfDisposed(); If it was disposed, then it's still safe to try and unsubscribe.
		var n = _._findEntryNode(subscriber);
		if(n)
		{
			var s = n.value;
			_.__subscriptions.removeNode(n);
			s.dispose(); // Prevent further usage of a dead subscription.
		}
	}

	protected _unsubscribeAll(returnSubscribers:boolean = false):TSubscriber[]
	{
		var _ = this, _s = _.__subscriptions;
		if(!_s) return null;
		var s = _s.map(n=>n.value);
		var u = returnSubscribers ? s.map(o=>o.subscriber) : null;
		_s.clear(); // Reset...

		dispose.these(s);

		return u;
	}

	unsubscribeAll():void
	{
		this._unsubscribeAll();
	}

	protected _onDispose()
	{
		super._onDispose();
		this._unsubscribeAll();
		var s = this.__subscriptions;
		this.__subscriptions = null;
		dispose(s);
	}

}

export default SubscribableBase;
