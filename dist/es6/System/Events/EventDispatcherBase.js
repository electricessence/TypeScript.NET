import * as AU from "../Collections/Array/Utility";
import { shallowCopy } from "../Utility/shallowCopy";
import { DisposableBase } from "../Disposable/DisposableBase";
import { dispose } from "../Disposable/dispose";
import { EventDispatcherEntry } from "./EventDispatcherEntry";
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
        this._isDisposing = false;
        this._disposableObjectName = NAME;
    }
    addEventListener(type, listener, priority = 0) {
        let e = this._entries;
        if (!e)
            this._entries = e = [];
        e.push(new EventDispatcherEntry(type, listener, {
            priority: priority || 0,
            dispatcher: this
        }, entryFinalizer));
    }
    removeEntry(entry) {
        return !!this._entries && AU.remove(this._entries, entry) != 0;
    }
    registerEventListener(type, listener, priority = 0) {
        if (!this.hasEventListener(type, listener))
            this.addEventListener(type, listener, priority);
    }
    hasEventListener(type, listener) {
        const e = this._entries;
        return e && e.some((value) => type == value.type && (!listener || listener == value.listener));
    }
    removeEventListener(type, listener) {
        dispose.these(this._entries.filter(entry => entry.matches(type, listener)));
    }
    dispatchEvent(e, params) {
        const _ = this;
        let l = _._entries;
        if (!l || !l.length)
            return false;
        let event;
        if (typeof e == "string") {
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
        const entries = l.filter(e => e.type == type);
        if (!entries.length)
            return false;
        entries.sort((a, b) => (b.params ? b.params.priority : 0)
            - (a.params ? a.params.priority : 0));
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
    dispose() {
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