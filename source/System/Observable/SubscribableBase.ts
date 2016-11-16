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
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const NAME = "SubscribableBase";
// This class is very much akin to a registry or 'Set' but uses an intermediary (Subscription) for releasing the registration.
export class SubscribableBase<TSubscriber>
extends DisposableBase
{

	// Use a linked list since it's much easier to remove a subscriber from anywhere in the list.
	private __subscriptions:LinkedNodeList<ILinkedNodeWithValue<Subscription<TSubscriber>>>;

	protected _getSubscribers():TSubscriber[]|null
	{
		const s = this.__subscriptions;
		return s
			? s.map(node=><TSubscriber>(node && node.value && node.value.subscriber))
			: null;
	}

	constructor()
	{
		super();
		this._disposableObjectName = NAME;
	}

	private _findEntryNode(
		subscriber:TSubscriber):ILinkedNodeWithValue<Subscription<TSubscriber>>|null
	{
		const s = this.__subscriptions;
		return s && s.find(n=>!!n.value && n.value.subscriber===subscriber);
	}

	// It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the subscriber.
	subscribe(subscriber:TSubscriber):IDisposable
	{
		const _ = this;
		_.throwIfDisposed();

		const n = _._findEntryNode(subscriber);
		if(n) // Ensure only one instance of the existing subscription exists.
			return <IDisposable>n.value;

		let _s = _.__subscriptions;
		if(!_s) _.__subscriptions = _s
			= new LinkedNodeList<ILinkedNodeWithValue<Subscription<TSubscriber>>>();

		const s = new Subscription(_, subscriber);
		_s.addNode({value: s});

		return s;
	}

	unsubscribe(subscriber:TSubscriber):void
	{
		const _ = this;
		// _.throwIfDisposed(); If it was disposed, then it's still safe to try and unsubscribe.
		const n = _._findEntryNode(subscriber);
		if(n)
		{
			const s = n.value;
			_.__subscriptions.removeNode(n);
			if(s) s.dispose(); // Prevent further usage of a dead subscription.
		}
	}

	protected _unsubscribeAll(returnSubscribers:boolean = false):TSubscriber[]|null
	{
		const _ = this;
		let _s = _.__subscriptions;
		if(!_s) return null;
		const s = _s.map(n => n.value);
		const u = returnSubscribers ? s.map(o => o!.subscriber) : null;
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
		const s = this.__subscriptions;
		this.__subscriptions = <any>null;
		dispose(s);
	}

}

export default SubscribableBase;
