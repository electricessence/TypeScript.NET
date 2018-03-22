/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import TaskHandlerBase from "./TaskHandlerBase";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
var TaskHandler = /** @class */ (function (_super) {
    tslib_1.__extends(TaskHandler, _super);
    function TaskHandler(_action) {
        var _this = _super.call(this) || this;
        _this._action = _action;
        if (!_action)
            throw new ArgumentNullException('action');
        return _this;
    }
    TaskHandler.prototype._onExecute = function () {
        this._action();
    };
    TaskHandler.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._action = null;
    };
    return TaskHandler;
}(TaskHandlerBase));
export default TaskHandler;
//# sourceMappingURL=TaskHandler.js.map