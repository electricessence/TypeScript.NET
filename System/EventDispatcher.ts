///<reference path="System.ts"/>
///<reference path="IDisposable.ts"/>
///<reference path="Collections/ArrayUtility.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System {

	var AU = System.Collections.ArrayUtility;
	var Types = System.Types;
	var copyTo = System.copyTo;

	export interface IEventDispatcher extends EventTarget, IDisposable {

		addEventListener(type: string, listener: EventListener, useCapture?: boolean, priority?: number):void;//, useWeakReference?: boolean);
		dispatchEvent(event: Event): boolean;
		hasEventListener(type: string): boolean;
		removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
		// willTrigger(type: string);
		// toString(): string;

	}

	class EventDispatcherEntry extends DisposableBase {

		constructor(type: string, listener: EventListener, useCapture: boolean = false, priority: number= 0)//, useWeakReference: boolean = false)
		{
			super();

			this.type = type;
			this.listener = listener;
			this.useCapture = useCapture;
			this.priority = priority;
			// this.useWeakReference = useWeakReference;
		}

		type: string;
		listener: EventListener;
		useCapture: boolean;
		priority: number;
		// useWeakReference: boolean;

		dispose(): void {
			this.listener = null;
		}

		get wasDisposed(): boolean {
			return this.listener == null;
		}

		matches(type: string, listener: EventListener, useCapture: boolean = false): boolean {
			var _ = this;
			return _.type == type
				&& _.listener == listener
				&& _.useCapture == useCapture;
		}

		equals(other: EventDispatcherEntry): boolean {
			var _ = this;
			return _.type == other.type
				&& _.listener == other.listener
				&& _.useCapture == other.useCapture
				&& _.priority == other.priority
				// && this.useWeakReference == other.useWeakReference
			;
		}
	}

	export class EventDispatcher extends DisposableBase implements IEventDispatcher {

		private _listeners: EventDispatcherEntry[];

		addEventListener(type: string, listener: EventListener, useCapture: boolean = false, priority: number= 0): void//, useWeakReference: boolean= false)
		{
			var l:EventDispatcherEntry[] = this._listeners;
			if (!l)
				this._listeners = l = [];

			// flash/vibejs means of adding is indiscriminant and will double add listeners...
			// we can then avoid double adds by including a 'registerEventListener' method.
			l.push(new EventDispatcherEntry(type, listener, useCapture, priority));//, useWeakReference));
		}

		// Allow for simple add once mechanism.
		registerEventListener(type: string, listener: EventListener, useCapture: boolean = false, priority: number= 0): void//, useWeakReference: boolean= false)
		{
			if (!this.hasEventListener(type, listener, useCapture))
				this.addEventListener(type, listener, useCapture, priority);
		}

		hasEventListener(type: string, listener?: EventListener, useCapture: boolean = false):boolean {
			var l = this._listeners;
			return l && l.some(
				(value: EventDispatcherEntry): boolean =>
					type == value.type && (!listener || listener == value.listener && useCapture == value.useCapture));

		}

		removeEventListener(type: string, listener: EventListener, userCapture: boolean = false): void {

			var l = this._listeners;

			if (l) {
				var i = AU.findIndex(l, entry=> entry.matches(type, listener, userCapture));
				if (i != -1) {
					var e = l[i];
					l.splice(i, 1);
					e.dispose();
				}
			}

		}
		
		dispatchEvent(event: Event): boolean; // Event created outside or originated elsewhere.
		dispatchEvent(type: string, params?:any): boolean;
		dispatchEvent(e: any, params?: any): boolean {

			var _ = this, l = _._listeners;
			if (!l || !l.length)
				return false;

			var event: Event;

			if (Types.isString(e))
			{
				// New event...
				event = new Event();
				copyTo(params, event);
				if(!event.target) event.target = _;
				event.currentTarget = _;
				event.type = e;
			}
			else
			{
				event = <Event>e;
			}

			var type = event.type;

			// noinspection JSMismatchedCollectionQueryUpdate
			var entries:EventDispatcherEntry[] = [];//, propagate = true, prevent = false;
			l.forEach((e: EventDispatcherEntry): void => { if (e.type == type) entries.push(e); });
			if (!entries.length)
				return false;

			entries.sort(function (a, b) { return b.priority - a.priority; });

			// For now... Just use simple bubbling...
			entries.forEach(entry=> {
				var newEvent = new Event();
				copyTo(event, newEvent);
				newEvent.currentTarget = this
				entry.listener(newEvent);
			});

			return true;

		}

		static get DISPOSING() { return "disposing"; }
		static get DISPOSED() { return "disposed"; }

		// When dispatching events, we need a way to prevent recursion when disposing.
		private _isDisposing: boolean = false;
		get isDisposing(): boolean {
			return this._isDisposing;
		}

		// Override the public method here since EventDispatcher will end up doing things a bit differently from here on.
		public dispose() {

			// Having a disposing event can allow for child objects to automatically release themselves when their parent is disposed.
			var _ = this;
			if (!_.wasDisposed && !_._isDisposing) {
				_._isDisposing = true;
				_.dispatchEvent(EventDispatcher.DISPOSING);

				super.dispose();

				_.dispatchEvent(EventDispatcher.DISPOSED);

				var l = _._listeners;
				if (l) {
					this._listeners = null;
					l.forEach(e=> e.dispose());
				}
			}
		}


	}

}
