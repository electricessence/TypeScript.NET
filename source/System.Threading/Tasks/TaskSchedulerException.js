/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.threading.tasks.taskschedulerexception%28v=vs.110%29.aspx
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../System/Exception"], function (require, exports) {
    var Exception_1 = require("../../System/Exception");
    var NAME = 'TaskSchedulerException';
    var TaskSchedulerException = (function (_super) {
        __extends(TaskSchedulerException, _super);
        function TaskSchedulerException() {
            _super.apply(this, arguments);
        }
        TaskSchedulerException.prototype.getName = function () {
            return NAME;
        };
        return TaskSchedulerException;
    })(Exception_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskSchedulerException;
});
//# sourceMappingURL=TaskSchedulerException.js.map