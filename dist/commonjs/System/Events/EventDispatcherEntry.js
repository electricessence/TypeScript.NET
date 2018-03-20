"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../Types");
var DisposableBase_1 = require("../Disposable/DisposableBase");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var Compare_1 = require("../Compare");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = "EventDispatcherEntry";
var EventDispatcherEntry = /** @class */ (function (_super) {
    __extends(EventDispatcherEntry, _super);
    function EventDispatcherEntry(type, listener, params, finalizer) {
        var _this = _super.call(this, NAME, finalizer) || this;
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
            if (Types_1.Type.isFunction(l))
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
            && Compare_1.areEquivalent(_.params, other.params, false);
    };
    return EventDispatcherEntry;
}(DisposableBase_1.DisposableBase));
exports.EventDispatcherEntry = EventDispatcherEntry;
exports.default = EventDispatcherEntry;
//# sourceMappingURL=EventDispatcherEntry.js.map