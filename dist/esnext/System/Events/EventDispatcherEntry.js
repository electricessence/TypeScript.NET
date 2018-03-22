/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import { Type } from "../Types";
import { DisposableBase } from "../Disposable/DisposableBase";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { areEquivalent } from "../Compare";
var NAME = "EventDispatcherEntry";
var EventDispatcherEntry = /** @class */ (function (_super) {
    tslib_1.__extends(EventDispatcherEntry, _super);
    function EventDispatcherEntry(type, listener, params, finalizer) {
        var _this = _super.call(this, NAME, finalizer) || this;
        _this.type = type;
        _this.listener = listener;
        _this.params = params;
        if (!listener)
            throw new ArgumentNullException('listener');
        if (Type.isObject(listener) && !Type.hasMemberOfType(listener, "handleEvent", TypeOfValue.Function))
            throw new ArgumentException('listener', "is invalid type.  Must be a function or an object with 'handleEvent'.");
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
            if (Type.isFunction(l))
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
            && areEquivalent(_.params, other.params, false);
    };
    return EventDispatcherEntry;
}(DisposableBase));
export { EventDispatcherEntry };
export default EventDispatcherEntry;
//# sourceMappingURL=EventDispatcherEntry.js.map