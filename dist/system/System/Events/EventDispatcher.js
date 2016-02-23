/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../Utility/shallowCopy', '../Disposable/DisposableBase', '../Collections/Array/Utility'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var shallowCopy_1, DisposableBase_1, AU;
    var DISPOSING, DISPOSED, EventDispatcherEntry, EventDispatcher;
    return {
        setters:[
            function (shallowCopy_1_1) {
                shallowCopy_1 = shallowCopy_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (AU_1) {
                AU = AU_1;
            }],
        execute: function() {
            DISPOSING = 'disposing', DISPOSED = 'disposed';
            EventDispatcherEntry = (function (_super) {
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
            exports_1("default", EventDispatcherEntry);
            EventDispatcher = (function (_super) {
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
        }
    }
});
//# sourceMappingURL=EventDispatcher.js.map