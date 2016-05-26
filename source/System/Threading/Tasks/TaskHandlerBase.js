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
        define(["require", "exports", "../../Disposable/DisposableBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var DisposableBase_1 = require("../../Disposable/DisposableBase");
    var TaskHandlerBase = (function (_super) {
        __extends(TaskHandlerBase, _super);
        function TaskHandlerBase() {
            _super.call(this);
            this._timeoutId = null;
            this._status = 0;
        }
        Object.defineProperty(TaskHandlerBase.prototype, "isScheduled", {
            get: function () {
                return !!this._timeoutId;
            },
            enumerable: true,
            configurable: true
        });
        TaskHandlerBase.prototype.start = function (defer) {
            this.throwIfDisposed();
            this.cancel();
            this._status = 1;
            if (!(defer > 0))
                defer = 0;
            if (isFinite(defer))
                this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
        };
        TaskHandlerBase.prototype.runSynchronously = function () {
            this.throwIfDisposed();
            TaskHandlerBase._handler(this);
        };
        TaskHandlerBase.prototype.getStatus = function () {
            return this._status;
        };
        Object.defineProperty(TaskHandlerBase.prototype, "status", {
            get: function () {
                return this.getStatus();
            },
            enumerable: true,
            configurable: true
        });
        TaskHandlerBase._handler = function (d) {
            d.cancel();
            d._status = 2;
            try {
                d._onExecute();
                d._status = 3;
            }
            catch (ex) {
                d._status = 5;
            }
        };
        TaskHandlerBase.prototype._onDispose = function () {
            this.cancel();
            this._status = null;
        };
        TaskHandlerBase.prototype.cancel = function () {
            var id = this._timeoutId;
            if (id) {
                clearTimeout(id);
                this._timeoutId = null;
                this._status = 4;
                return true;
            }
            return false;
        };
        return TaskHandlerBase;
    }(DisposableBase_1.DisposableBase));
    exports.TaskHandlerBase = TaskHandlerBase;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskHandlerBase;
});
//# sourceMappingURL=TaskHandlerBase.js.map