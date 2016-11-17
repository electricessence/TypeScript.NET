System.register(["../Types", "../Disposable/DisposableBase", "../Exceptions/ArgumentNullException", "../Exceptions/ArgumentException", "../Compare", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Types_1, DisposableBase_1, ArgumentNullException_1, ArgumentException_1, Compare_1, extends_1, __extends, NAME, EventDispatcherEntry;
    return {
        setters: [
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (DisposableBase_1_1) {
                DisposableBase_1 = DisposableBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ArgumentException_1_1) {
                ArgumentException_1 = ArgumentException_1_1;
            },
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            __extends = extends_1.default;
            NAME = "EventDispatcherEntry";
            EventDispatcherEntry = (function (_super) {
                __extends(EventDispatcherEntry, _super);
                function EventDispatcherEntry(type, listener, params, finalizer) {
                    var _this = _super.call(this, finalizer) || this;
                    _this.type = type;
                    _this.listener = listener;
                    _this.params = params;
                    if (!listener)
                        throw new ArgumentNullException_1.ArgumentNullException('listener');
                    if (Types_1.Type.isObject(listener) && !Types_1.Type.hasMemberOfType(listener, "handleEvent", Types_1.Type.FUNCTION))
                        throw new ArgumentException_1.ArgumentException('listener', "is invalid type.  Must be a function or an object with 'handleEvent'.");
                    var _ = _this;
                    _.type = type;
                    _.listener = listener;
                    _.params = params;
                    _._disposableObjectName = NAME;
                    return _this;
                }
                EventDispatcherEntry.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this.listener = null;
                };
                EventDispatcherEntry.prototype.dispatch = function (e) {
                    var _ = this;
                    if (_.wasDisposed)
                        return false;
                    var l = _.listener, d = l && e.type == _.type;
                    if (d) {
                        if (Types_1.Type.isFunction(l))
                            _.listener(e);
                        else
                            l.handleEvent(e);
                    }
                    return d;
                };
                EventDispatcherEntry.prototype.matches = function (type, listener) {
                    var _ = this;
                    return _.type == type
                        && _.listener == listener;
                };
                EventDispatcherEntry.prototype.equals = function (other) {
                    var _ = this;
                    return _.matches(other.type, other.listener)
                        && Compare_1.areEquivalent(_.params, other.params, false);
                };
                return EventDispatcherEntry;
            }(DisposableBase_1.DisposableBase));
            exports_1("EventDispatcherEntry", EventDispatcherEntry);
            exports_1("default", EventDispatcherEntry);
        }
    };
});
//# sourceMappingURL=EventDispatcherEntry.js.map