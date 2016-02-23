/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import shallowCopy from '../Utility/shallowCopy';
import DisposableBase from '../Disposable/DisposableBase';
import * as AU from '../Collections/Array/Utility';
const DISPOSING = 'disposing', DISPOSED = 'disposed';
export default class EventDispatcherEntry extends DisposableBase {
    constructor(type, listener, useCapture = false, priority = 0) {
        super();
        this.type = type;
        this.listener = listener;
        this.useCapture = useCapture;
        this.priority = priority;
        var _ = this;
        _.type = type;
        _.listener = listener;
        _.useCapture = useCapture;
        _.priority = priority;
    }
    dispose() {
        this.listener = null;
    }
    get wasDisposed() {
        return this.listener == null;
    }
    matches(type, listener, useCapture = false) {
        var _ = this;
        return _.type == type
            && _.listener == listener
            && _.useCapture == useCapture;
    }
    equals(other) {
        var _ = this;
        return _.type == other.type
            && _.listener == other.listener
            && _.useCapture == other.useCapture
            && _.priority == other.priority;
    }
}
class EventDispatcher extends DisposableBase {
    constructor(...args) {
        super(...args);
        this._isDisposing = false;
    }
    addEventListener(type, listener, useCapture = false, priority = 0) {
        var l = this._listeners;
        if (!l)
            this._listeners = l = [];
        l.push(new EventDispatcherEntry(type, listener, useCapture, priority));
    }
    registerEventListener(type, listener, useCapture = false, priority = 0) {
        if (!this.hasEventListener(type, listener, useCapture))
            this.addEventListener(type, listener, useCapture, priority);
    }
    hasEventListener(type, listener, useCapture = false) {
        var l = this._listeners;
        return l && l.some((value) => type == value.type && (!listener || listener == value.listener && useCapture == value.useCapture));
    }
    removeEventListener(type, listener, userCapture = false) {
        var l = this._listeners;
        if (l) {
            var i = AU.findIndex(l, entry => entry.matches(type, listener, userCapture));
            if (i != -1) {
                var e = l[i];
                l.splice(i, 1);
                e.dispose();
            }
        }
    }
    dispatchEvent(e, params) {
        var _ = this, l = _._listeners;
        if (!l || !l.length)
            return false;
        var event;
        if (typeof e == "string") {
            event = Object.create(Event);
            if (!params)
                params = {};
            event.cancelable = !!params.cancelable;
            event.target = _;
            event.type = e;
        }
        else
            event = e;
        var type = event.type;
        var entries = [];
        l.forEach((e) => { if (e.type == type)
            entries.push(e); });
        if (!entries.length)
            return false;
        entries.sort(function (a, b) { return b.priority - a.priority; });
        entries.forEach(entry => {
            var newEvent = Object.create(Event);
            shallowCopy(event, newEvent);
            newEvent.target = this;
            entry.listener(newEvent);
        });
        return true;
    }
    static get DISPOSING() { return DISPOSING; }
    static get DISPOSED() { return DISPOSED; }
    get isDisposing() {
        return this._isDisposing;
    }
    dispose() {
        var _ = this;
        if (!_.wasDisposed && !_._isDisposing) {
            _._isDisposing = true;
            _.dispatchEvent(DISPOSING);
            super.dispose();
            _.dispatchEvent(DISPOSED);
            var l = _._listeners;
            if (l) {
                this._listeners = null;
                l.forEach(e => e.dispose());
            }
        }
    }
}
//# sourceMappingURL=EventDispatcher.js.map