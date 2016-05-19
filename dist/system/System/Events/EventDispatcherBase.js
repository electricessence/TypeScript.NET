/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Collections/Array/Utility", "../Utility/shallowCopy", "../Disposable/DisposableBase", "../Disposable/dispose", "./EventDispatcherEntry"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var AU, shallowCopy_1, DisposableBase_1, dispose_1, EventDispatcherEntry_1;
    var DISPOSING, DISPOSED, EventDispatcherBase;
    function entryFinalizer() {
        var p = this.params;
        p.dispatcher.removeEntry(this);
        p.dispatcher = null;
    }
    return {
        setters:[
            function (AU_1) {
                AU = AU_1;
            },
            function (shallowCopy_1_1) {
                shallowCopy_1 = shallowCopy_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (dispose_1_1) {
                dispose_1 = dispose_1_1;
            },
            function (EventDispatcherEntry_1_1) {
                EventDispatcherEntry_1 = EventDispatcherEntry_1_1;
            }],
        execute: function() {
            DISPOSING = 'disposing', DISPOSED = 'disposed';
            EventDispatcherBase = (function (_super) {
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
            exports_1("default", EventDispatcherBase);
        }
    }
});
//# sourceMappingURL=EventDispatcherBase.js.map