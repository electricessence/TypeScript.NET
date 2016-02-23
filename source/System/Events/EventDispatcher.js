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
        define(["require", "exports", '../Utility/shallowCopy', '../Disposable/DisposableBase', '../Collections/Array/Utility'], factory);
    }
})(function (require, exports) {
    'use strict';
    var shallowCopy_1 = require('../Utility/shallowCopy');
    var DisposableBase_1 = require('../Disposable/DisposableBase');
    var AU = require('../Collections/Array/Utility');
    var DISPOSING = 'disposing', DISPOSED = 'disposed';
    var EventDispatcherEntry = (function (_super) {
        __extends(EventDispatcherEntry, _super);
        function EventDispatcherEntry(type, listener, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            _super.call(this);
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
        EventDispatcherEntry.prototype.dispose = function () {
            this.listener = null;
        };
        Object.defineProperty(EventDispatcherEntry.prototype, "wasDisposed", {
            get: function () {
                return this.listener == null;
            },
            enumerable: true,
            configurable: true
        });
        EventDispatcherEntry.prototype.matches = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            var _ = this;
            return _.type == type
                && _.listener == listener
                && _.useCapture == useCapture;
        };
        EventDispatcherEntry.prototype.equals = function (other) {
            var _ = this;
            return _.type == other.type
                && _.listener == other.listener
                && _.useCapture == other.useCapture
                && _.priority == other.priority;
        };
        return EventDispatcherEntry;
    }(DisposableBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDispatcherEntry;
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            _super.apply(this, arguments);
            this._isDisposing = false;
        }
        EventDispatcher.prototype.addEventListener = function (type, listener, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            var l = this._listeners;
            if (!l)
                this._listeners = l = [];
            l.push(new EventDispatcherEntry(type, listener, useCapture, priority));
        };
        EventDispatcher.prototype.registerEventListener = function (type, listener, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            if (!this.hasEventListener(type, listener, useCapture))
                this.addEventListener(type, listener, useCapture, priority);
        };
        EventDispatcher.prototype.hasEventListener = function (type, listener, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            var l = this._listeners;
            return l && l.some(function (value) {
                return type == value.type && (!listener || listener == value.listener && useCapture == value.useCapture);
            });
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, userCapture) {
            if (userCapture === void 0) { userCapture = false; }
            var l = this._listeners;
            if (l) {
                var i = AU.findIndex(l, function (entry) { return entry.matches(type, listener, userCapture); });
                if (i != -1) {
                    var e = l[i];
                    l.splice(i, 1);
                    e.dispose();
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (e, params) {
            var _this = this;
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
            l.forEach(function (e) { if (e.type == type)
                entries.push(e); });
            if (!entries.length)
                return false;
            entries.sort(function (a, b) { return b.priority - a.priority; });
            entries.forEach(function (entry) {
                var newEvent = Object.create(Event);
                shallowCopy_1.default(event, newEvent);
                newEvent.target = _this;
                entry.listener(newEvent);
            });
            return true;
        };
        Object.defineProperty(EventDispatcher, "DISPOSING", {
            get: function () { return DISPOSING; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventDispatcher, "DISPOSED", {
            get: function () { return DISPOSED; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventDispatcher.prototype, "isDisposing", {
            get: function () {
                return this._isDisposing;
            },
            enumerable: true,
            configurable: true
        });
        EventDispatcher.prototype.dispose = function () {
            var _ = this;
            if (!_.wasDisposed && !_._isDisposing) {
                _._isDisposing = true;
                _.dispatchEvent(DISPOSING);
                _super.prototype.dispose.call(this);
                _.dispatchEvent(DISPOSED);
                var l = _._listeners;
                if (l) {
                    this._listeners = null;
                    l.forEach(function (e) { return e.dispose(); });
                }
            }
        };
        return EventDispatcher;
    }(DisposableBase_1.default));
});
//# sourceMappingURL=EventDispatcher.js.map