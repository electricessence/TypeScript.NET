/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import * as AU from "../Collections/Array/Utility";
import { shallowCopy } from "../Utility/shallowCopy";
import { DisposableBase } from "../Disposable/DisposableBase";
import { dispose } from "../Disposable/dispose";
import { EventDispatcherEntry } from "./EventDispatcherEntry";
var DISPOSING = 'disposing', DISPOSED = 'disposed';
function entryFinalizer() {
    // @ts-ignore
    var _ = this;
    var p = _.params;
    p.dispatcher.removeEntry(_);
    p.dispatcher = null;
}
var NAME = "EventDispatcherBase";
var EventDispatcherBase = /** @class */ (function (_super) {
    tslib_1.__extends(EventDispatcherBase, _super);
    function EventDispatcherBase() {
        var _this = _super.call(this, NAME) || this;
        // When dispatching events, we need a way to prevent recursion when disposing.
        _this._isDisposing = false;
        return _this;
    }
    EventDispatcherBase.prototype.addEventListener = function (type, listener, priority) {
        if (priority === void 0) { priority = 0; }
        var e = this._entries;
        if (!e)
            this._entries = e = [];
        // flash/vibe.js means of adding is indiscriminate and will double add listeners...
        // we can then avoid double adds by including a 'registerEventListener' method.
        e.push(new EventDispatcherEntry(type, listener, {
            priority: priority || 0,
            dispatcher: this
        }, entryFinalizer));
    };
    EventDispatcherBase.prototype.removeEntry = function (entry) {
        return !!this._entries && AU.remove(this._entries, entry) != 0;
    };
    // Allow for simple add once mechanism.
    EventDispatcherBase.prototype.registerEventListener = function (type, listener, priority) {
        if (priority === void 0) { priority = 0; }
        if (!this.hasEventListener(type, listener))
            this.addEventListener(type, listener, priority);
    };
    EventDispatcherBase.prototype.hasEventListener = function (type, listener) {
        var e = this._entries;
        return !!e && e.some(function (value) {
            return type == value.type && (!listener || listener == value.listener);
        });
    };
    EventDispatcherBase.prototype.removeEventListener = function (type, listener) {
        var e = this._entries;
        if (e)
            dispose.these.noCopy(e.filter(function (entry) { return entry.matches(type, listener); }));
    };
    EventDispatcherBase.prototype.dispatchEvent = function (e, params) {
        var _this = this;
        var _ = this;
        var l = _._entries;
        if (!l || !l.length)
            return false;
        var event;
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
        var type = event.type;
        // noinspection JSMismatchedCollectionQueryUpdate
        var entries = l.filter(function (e) { return e.type == type; }); //, propagate = true, prevent = false;
        if (!entries.length)
            return false;
        entries.sort(function (a, b) {
            return (b.params ? b.params.priority : 0)
                - (a.params ? a.params.priority : 0);
        });
        // For now... Just use simple...
        entries.forEach(function (entry) {
            var newEvent = Object.create(Event);
            shallowCopy(event, newEvent);
            newEvent.target = _this;
            entry.dispatch(newEvent);
        });
        return true;
    };
    Object.defineProperty(EventDispatcherBase, "DISPOSING", {
        get: function () { return DISPOSING; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventDispatcherBase, "DISPOSED", {
        get: function () { return DISPOSED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventDispatcherBase.prototype, "isDisposing", {
        get: function () {
            return this._isDisposing;
        },
        enumerable: true,
        configurable: true
    });
    // Override the public method here since EventDispatcher will end up doing things a bit differently from here on.
    EventDispatcherBase.prototype.dispose = function () {
        // Having a disposing event can allow for child objects to automatically release themselves when their parent is disposed.
        var _ = this;
        if (!_.wasDisposed && !_._isDisposing) {
            _._isDisposing = true;
            _.dispatchEvent(DISPOSING);
            _super.prototype.dispose.call(this);
            _.dispatchEvent(DISPOSED);
            var l = _._entries;
            if (l) {
                this._entries = null;
                l.forEach(function (e) { return e.dispose(); });
            }
        }
    };
    return EventDispatcherBase;
}(DisposableBase));
export default EventDispatcherBase;
//# sourceMappingURL=EventDispatcherBase.js.map