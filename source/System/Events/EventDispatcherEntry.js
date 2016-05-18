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
        define(["require", "exports", "../Types", "../Disposable/DisposableBase", "../Exceptions/ArgumentNullException", "../Exceptions/ArgumentException", "../Compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var Compare_1 = require("../Compare");
    var EventDispatcherEntry = (function (_super) {
        __extends(EventDispatcherEntry, _super);
        function EventDispatcherEntry(type, listener, params, finalizer) {
            if (params === void 0) { params = null; }
            _super.call(this, finalizer);
            this.type = type;
            this.listener = listener;
            this.params = params;
            if (!listener)
                throw new ArgumentNullException_1.ArgumentNullException('listener');
            if (Types_1.Type.isObject(listener) && !Types_1.Type.hasMemberOfType(listener, "handleEvent", Types_1.Type.FUNCTION))
                throw new ArgumentException_1.ArgumentException('listener', "is invalid type.  Must be a function or an object with 'handleEvent'.");
            var _ = this;
            _.type = type;
            _.listener = listener;
            _.params = params;
            _._disposableObjectName = "EventDispatcherEntry";
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
    exports.EventDispatcherEntry = EventDispatcherEntry;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventDispatcherEntry;
});
//# sourceMappingURL=EventDispatcherEntry.js.map