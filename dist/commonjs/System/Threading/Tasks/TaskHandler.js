"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TaskHandlerBase_1 = require("./TaskHandlerBase");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var TaskHandler = /** @class */ (function (_super) {
    __extends(TaskHandler, _super);
    function TaskHandler(_action) {
        var _this = _super.call(this) || this;
        _this._action = _action;
        if (!_action)
            throw new ArgumentNullException_1.ArgumentNullException('action');
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
}(TaskHandlerBase_1.TaskHandlerBase));
exports.TaskHandler = TaskHandler;
exports.default = TaskHandler;
//# sourceMappingURL=TaskHandler.js.map