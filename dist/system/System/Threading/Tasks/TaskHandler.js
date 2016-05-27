/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./TaskHandlerBase", "../../Exceptions/ArgumentNullException"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TaskHandlerBase_1, ArgumentNullException_1;
    var TaskHandler;
    return {
        setters:[
            function (TaskHandlerBase_1_1) {
                TaskHandlerBase_1 = TaskHandlerBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            }],
        execute: function() {
            TaskHandler = (function (_super) {
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
            exports_1("TaskHandler", TaskHandler);
            exports_1("default",TaskHandler);
        }
    }
});
//# sourceMappingURL=TaskHandler.js.map