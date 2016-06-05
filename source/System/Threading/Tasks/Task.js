/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./TaskHandlerBase", "../../Exceptions/ArgumentNullException", "../../Lazy", "../../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TaskHandlerBase_1 = require("./TaskHandlerBase");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var Lazy_1 = require("../../Lazy");
    var extends_1 = require("../../../extends");
    var __extends = extends_1.default;
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task(valueFactory) {
            _super.call(this);
            if (!valueFactory)
                throw new ArgumentNullException_1.ArgumentNullException('valueFactory');
            this._result = new Lazy_1.Lazy(valueFactory, false);
        }
        Task.prototype._onExecute = function () {
            this._result.getValue();
        };
        Task.prototype.getResult = function () {
            return this._result.value;
        };
        Task.prototype.getState = function () {
            var r = this._result;
            return r && {
                status: this.getStatus(),
                result: r.isValueCreated ? r.value : void 0,
                error: r.error
            };
        };
        Task.prototype.start = function (defer) {
            if (this.getStatus() == 0) {
                _super.prototype.start.call(this, defer);
            }
        };
        Task.prototype.runSynchronously = function () {
            if (this.getStatus() == 0) {
                _super.prototype.runSynchronously.call(this);
            }
        };
        Object.defineProperty(Task.prototype, "state", {
            get: function () {
                return this.getState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "result", {
            get: function () {
                this.throwIfDisposed();
                this.runSynchronously();
                return this.getResult();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "error", {
            get: function () {
                this.throwIfDisposed();
                return this._result.error;
            },
            enumerable: true,
            configurable: true
        });
        Task.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            var r = this._result;
            if (r) {
                this._result = null;
                r.dispose();
            }
        };
        return Task;
    }(TaskHandlerBase_1.TaskHandlerBase));
    exports.Task = Task;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Task;
});
//# sourceMappingURL=Task.js.map