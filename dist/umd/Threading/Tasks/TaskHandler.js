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
        define(["require", "exports", "tslib", "./TaskHandlerBase", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var TaskHandlerBase_1 = require("./TaskHandlerBase");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var TaskHandler = /** @class */ (function (_super) {
        tslib_1.__extends(TaskHandler, _super);
        function TaskHandler(_action) {
            var _this = _super.call(this) || this;
            _this._action = _action;
            if (!_action)
                throw new ArgumentNullException_1.default('action');
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
    }(TaskHandlerBase_1.default));
    exports.default = TaskHandler;
});
//# sourceMappingURL=TaskHandler.js.map