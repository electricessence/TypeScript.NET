/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as AU from "../Collections/Array/Utility";
import { shallowCopy } from "../Utility/shallowCopy";
import { DisposableBase } from "../Disposable/DisposableBase";
import { dispose } from "../Disposable/dispose";
import { EventDispatcherEntry } from "./EventDispatcherEntry";
// noinspection JSUnusedLocalSymbols
const DISPOSING = 'disposing', DISPOSED = 'disposed';
function entryFinalizer() {
    const p = this.params;
    p.dispatcher.removeEntry(this);
    p.dispatcher = null;
}
const NAME = "EventDispatcherBase";
export default class EventDispatcherBase extends DisposableBase {
    constructor() {
        super();
        // When dispatching events, we need a way to prevent recursion when disposing.
        this._isDisposing = false;
        this._disposableObjectName = NAME;
    }
    addEventListener(type, listener, priority = 0) {
        let e = this._entries;
        if (!e)
            this._entries = e = [];
        // flash/vibe.js means of adding is indiscriminate and will double add listeners...
        // we can then avoid double adds by including a 'registerEventListener' method.
        e.push(new EventDispatcherEntry(type, listener, {
            priority: priority || 0,
            dispatcher: this
        }, entryFinalizer));
    }
    removeEntry(entry) {
        return !!this._entries && AU.remove(this._entries, entry) != 0;
    }
    // Allow for simple add once mechanism.
    registerEventListener(type, listener, priority = 0) {
        if (!this.hasEventListener(type, listener))
            this.addEventListener(type, listener, priority);
    }
    hasEventListener(type, listener) {
        const e = this._entries;
        return e && e.some((value) => type == value.type && (!listener || listener == value.listener));
    }
    removeEventListener(type, listener) {
        dispose.these.noCopy(this._entries.filter(entry => entry.matches(type, listener)));
    }
    dispatchEvent(e, params) {
        const _ = this;
        let l = _._entries;
        if (!l || !l.length)
            return false;
        let event;
        if (typeof e == 'string') {
            event = (Event && Object.create(Event) || {});
            if (!params)
                params = {};
            if (params['cancellable'])
                event.cancellable = true;
            event.target = _;
            event.type = e;
        }
        else
            event = e;
        const type = event.type;
        // noinspection JSMismatchedCollectionQueryUpdate
        const entries = l.filter(e => e.type == type); //, propagate = true, prevent = false;
        if (!entries.length)
            return false;
        entries.sort((a, b) => (b.params ? b.params.priority : 0)
            - (a.params ? a.params.priority : 0));
        // For now... Just use simple...
        entries.forEach(entry => {
            const newEvent = Object.create(Event);
            shallowCopy(event, newEvent);
            newEvent.target = this;
            entry.dispatch(newEvent);
        });
        return true;
    }
    static get DISPOSING() { return DISPOSING; }
    static get DISPOSED() { return DISPOSED; }
    get isDisposing() {
        return this._isDisposing;
    }
    // Override the public method here since EventDispatcher will end up doing things a bit differently from here on.
    dispose() {
        // Having a disposing event can allow for child objects to automatically release themselves when their parent is disposed.
        const _ = this;
        if (!_.wasDisposed && !_._isDisposing) {
            _._isDisposing = true;
            _.dispatchEvent(DISPOSING);
            super.dispose();
            _.dispatchEvent(DISPOSED);
            const l = _._entries;
            if (l) {
                this._entries = null;
                l.forEach(e => e.dispose());
            }
        }
    }
}
//# sourceMappingURL=EventDispatcherBase.js.map