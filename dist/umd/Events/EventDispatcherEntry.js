/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../Disposable/DisposableBase", "../Exceptions/ArgumentNullException", "../Exceptions/ArgumentException", "../Reflection/hasMemberOfType", "../Comparison/areEquivalent", "../Reflection/isObject"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var DisposableBase_1 = require("../Disposable/DisposableBase");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var hasMemberOfType_1 = require("../Reflection/hasMemberOfType");
    var areEquivalent_1 = require("../Comparison/areEquivalent");
    var isObject_1 = require("../Reflection/isObject");
    var NAME = "EventDispatcherEntry";
    var EventDispatcherEntry = /** @class */ (function (_super) {
        tslib_1.__extends(EventDispatcherEntry, _super);
        function EventDispatcherEntry(type, listener, params, finalizer) {
            var _this = _super.call(this, NAME, finalizer) || this;
            _this.type = type;
            _this.listener = listener;
            _this.params = params;
            if (!listener)
                throw new ArgumentNullException_1.default('listener');
            if (isObject_1.default(listener) && !hasMemberOfType_1.default(listener, "handleEvent", "function" /* Function */))
                throw new ArgumentException_1.default('listener', "is invalid type.  Must be a function or an object with 'handleEvent'.");
            var _ = _this;
            _.type = type;
            _.listener = listener;
            _.params = params;
            return _this;
        }
        EventDispatcherEntry.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this.listener = null;
        };
        /**
         * Safely dispatches an event if entry is not disposed and type matches.
         * @param e
         * @returns {IEventListener|boolean}
         */
        EventDispatcherEntry.prototype.dispatch = function (e) {
            var _ = this;
            if (_.wasDisposed)
                return false;
            var l = _.listener, d = l && e.type == _.type;
            if (d) {
                if (typeof l == 'function')
                    _.listener(e); // Use 'this' to ensure call reference.
                else
                    l.handleEvent(e);
            }
            return d;
        };
        /**
         * Compares type and listener object only.
         * @param type
         * @param listener
         * @returns {boolean}
         */
        EventDispatcherEntry.prototype.matches = function (type, listener) {
            var _ = this;
            return _.type == type
                && _.listener == listener;
        };
        /**
         * Compares type, listener, and priority.
         * @param other
         * @returns {boolean}
         */
        EventDispatcherEntry.prototype.equals = function (other) {
            var _ = this;
            return _.matches(other.type, other.listener)
                && areEquivalent_1.areEquivalent(_.params, other.params, false);
        };
        return EventDispatcherEntry;
    }(DisposableBase_1.default));
    exports.default = EventDispatcherEntry;
});
//# sourceMappingURL=EventDispatcherEntry.js.map