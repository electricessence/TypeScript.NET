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
        define(["require", "exports", "./TaskHandlerBase", "../../Exceptions/ArgumentNullException"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TaskHandlerBase_1 = require("./TaskHandlerBase");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var TaskHandler = (function (_super) {
        __extends(TaskHandler, _super);
        function TaskHandler(_action) {
            _super.call(this);
            this._action = _action;
            if (!_action)
                throw new ArgumentNullException_1.ArgumentNullException('action');
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskHandler;
});
//# sourceMappingURL=TaskHandler.js.map