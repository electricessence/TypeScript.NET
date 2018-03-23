/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import IEventListener from "./IEventListener";
import IEventDispatcher from "./IEventDispatcher";
import DisposableBase from "../Disposable/DisposableBase";
import EventDispatcherEntry from "./EventDispatcherEntry";
import shallowCopy from "../Utility/shallowCopy";
import removeElement from "../Collections/Array/removeElement";
import dispose from "../Disposable/dispose";

const DISPOSING:string = 'disposing',
      DISPOSED:string  = 'disposed';

// The following interfaces are exported for sub class implementation.

export interface IEventBase<TTarget>
{
	type:string;
	target:TTarget;
}

export interface IEvent extends IEventBase<any>
{

}

export interface IEntryParams
{
	priority:number;
	dispatcher:EventDispatcherBase;
}

function entryFinalizer()
{
	// @ts-ignore
	const _ = <any>this;
	const p:IEntryParams = _.params;
	p.dispatcher.removeEntry(_);
	(<any>p).dispatcher = null;
}

const NAME = "EventDispatcherBase";

export default
class EventDispatcherBase extends DisposableBase implements IEventDispatcher
{

	constructor() {
		super(NAME);
	}

	protected _entries:EventDispatcherEntry<IEntryParams>[]|undefined;

	addEventListener(
		type:string,
		listener:IEventListener,
		priority:number = 0):void
	{
		let e = this._entries;
		if(!e) this._entries = e = [];

		// flash/vibe.js means of adding is indiscriminate and will double add listeners...
		// we can then avoid double adds by including a 'registerEventListener' method.
		e.push(
			new EventDispatcherEntry(type, listener, {
					priority: priority || 0,
					dispatcher: this
				},
				entryFinalizer));
	}

	removeEntry(entry:EventDispatcherEntry<IEntryParams>):boolean
	{
		return !!this._entries && removeElement(this._entries, entry)!=0;
	}

	// Allow for simple add once mechanism.
	registerEventListener(
		type:string,
		listener:IEventListener,
		priority:number = 0):void//, useWeakReference: boolean= false)
	{
		if(!this.hasEventListener(type, listener))
			this.addEventListener(type, listener, priority);
	}

	hasEventListener(type:string, listener?:IEventListener):boolean
	{
		const e = this._entries;
		return !!e && e.some(
				(value:EventDispatcherEntry<IEntryParams>):boolean =>
				type==value.type && (!listener || listener==value.listener)
			);
	}

	removeEventListener(
		type:string,
		listener:IEventListener):void
	{
		const e = this._entries;
		if(e) dispose.these.noCopy(e.filter(entry=> entry.matches(type, listener)));
	}

	dispatchEvent(type:string, params?:any):boolean;
	dispatchEvent(event:IEvent):boolean;
	dispatchEvent(e:any, params?:any):boolean
	{

		const _ = this;


		let l = _._entries;
		if(!l || !l.length)
			return false;

		let event:IEventBase<any>;

		if(typeof e=='string')
		{
			event = <any>(Event && Object.create(Event) || {});
			if(!params)
				params = {};
			if(params['cancellable'])
				(<any>event).cancellable = true;
			event.target = _;
			event.type = e;
		}
		else
			event = e;

		const type = event.type;

		// noinspection JSMismatchedCollectionQueryUpdate
		const entries:EventDispatcherEntry<IEntryParams>[] = l.filter(e => e.type==type);//, propagate = true, prevent = false;
		if(!entries.length)
			return false;

		entries.sort((a, b)=>
			(b.params ? b.params.priority : 0)
			- (a.params ? a.params.priority : 0)
		);

		// For now... Just use simple...
		entries.forEach(
			entry=>
			{
				const newEvent:any = Object.create(Event);
				shallowCopy(event, newEvent);
				newEvent.target = this;
				entry.dispatch(newEvent);
			}
		);

		return true;

	}

	static get DISPOSING() { return DISPOSING; }

	static get DISPOSED() { return DISPOSED; }

	// When dispatching events, we need a way to prevent recursion when disposing.
	private _isDisposing:boolean = false;
	get isDisposing():boolean
	{
		return this._isDisposing;
	}

	// Override the public method here since EventDispatcher will end up doing things a bit differently from here on.
	public dispose()
	{

		// Having a disposing event can allow for child objects to automatically release themselves when their parent is disposed.
		const _ = this;
		if(!_.wasDisposed && !_._isDisposing)
		{
			_._isDisposing = true;
			_.dispatchEvent(DISPOSING);

			super.dispose();

			_.dispatchEvent(DISPOSED);

			const l = _._entries;
			if(l)
			{
				this._entries = <any>null;
				l.forEach(e=> e.dispose());
			}
		}
	}


}

