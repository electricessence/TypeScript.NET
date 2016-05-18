/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Collections/Array/Utility", "../Utility/shallowCopy", "../Disposable/DisposableBase", "../Disposable/dispose", "./EventDispatcherEntry"], factory);
    }
})(function (require, exports) {
    "use strict";
    var AU = require("../Collections/Array/Utility");
    var shallowCopy_1 = require("../Utility/shallowCopy");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var dispose_1 = require("../Disposable/dispose");
    var EventDispatcherEntry_1 = require("./EventDispatcherEntry");
    var DISPOSING = 'disposing', DISPOSED = 'disposed';
    function entryFinalizer() {
        var p = this.params;
        p.dispatcher.removeEntry(this);
        p.dispatcher = null;
    }
    var EventDispatcherBase = (function (_super) {
        __extends(EventDispatcherBase, _super);
        function EventDispatcherBase() {
            _super.apply(this, arguments);
            this._isDisposing = false;
        }
        EventDispatcherBase.prototype.addEventListener = function (type, listener, priority) {
            if (priority === void 0) { priority = 0; }
            var e = this._entries;
            if (!e)
                this._entries = e = [];
            e.push(new EventDispatcherEntry_1.EventDispatcherEntry(type, listener, {
                priority: priority || 0,
                dispatcher: this
            }, entryFinalizer));
        };
        EventDispatcherBase.prototype.removeEntry = function (entry) {
            return !!this._entries && AU.remove(this._entries, entry) != 0;
        };
        EventDispatcherBase.prototype.registerEventListener = function (type, listener, priority) {
            if (priority === void 0) { priority = 0; }
            if (!this.hasEventListener(type, listener))
                this.addEventListener(type, listener, priority);
        };
        EventDispatcherBase.prototype.hasEventListener = function (type, listener) {
            var e = this._entries;
            return e && e.some(function (value) {
                return type == value.type && (!listener || listener == value.listener);
            });
        };
        EventDispatcherBase.prototype.removeEventListener = function (type, listener) {
            dispose_1.dispose.these(this._entries.filter(function (entry) { return entry.matches(type, listener); }));
        };
        EventDispatcherBase.prototype.dispatchEvent = function (e, params) {
            var _this = this;
            var _ = this, l = _._entries;
            if (!l || !l.length)
                return false;
            var event;
            if (typeof e == "string") {
                event = Event && Object.create(Event) || {};
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
            var entries = l.filter(function (e) { return e.type == type; });
            if (!entries.length)
                return false;
            entries.sort(function (a, b) { return b.params.priority - a.params.priority; });
            entries.forEach(function (entry) {
                var newEvent = Object.create(Event);
                shallowCopy_1.shallowCopy(event, newEvent);
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
        EventDispatcherBase.prototype.dispose = function () {
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
    }(DisposableBase_1.DisposableBase));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDispatcherBase;
});
//# sourceMappingURL=EventDispatcherBase.js.map