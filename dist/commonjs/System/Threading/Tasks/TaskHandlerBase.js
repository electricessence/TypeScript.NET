"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var DisposableBase_1 = require("../../Disposable/DisposableBase");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var NAME = "TaskHandlerBase";
/**
 * A simple class for handling potentially repeated executions either deferred or immediate.
 */
var TaskHandlerBase = /** @class */ (function (_super) {
    __extends(TaskHandlerBase, _super);
    function TaskHandlerBase() {
        var _this = _super.call(this, NAME) || this;
        _this._timeoutId = null;
        _this._status = 0 /* Created */;
        return _this;
    }
    Object.defineProperty(TaskHandlerBase.prototype, "isScheduled", {
        get: function () {
            return !!this._timeoutId;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Schedules/Reschedules triggering the task.
     * @param defer Optional time to wait until triggering.
     */
    TaskHandlerBase.prototype.start = function (defer) {
        if (defer === void 0) { defer = 0; }
        this.throwIfDisposed();
        this.cancel();
        this._status = 1 /* WaitingToRun */;
        if (!(defer > 0))
            defer = 0; // A negation is used to catch edge cases.
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
    // Use a static function here to avoid recreating a new function every time.
    TaskHandlerBase._handler = function (d) {
        d.cancel();
        d._status = 2 /* Running */;
        try {
            d._onExecute();
            d._status = 3 /* RanToCompletion */;
        }
        catch (ex) {
            d._status = 5 /* Faulted */;
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
            this._status = 4 /* Cancelled */;
            return true;
        }
        return false;
    };
    return TaskHandlerBase;
}(DisposableBase_1.DisposableBase));
exports.TaskHandlerBase = TaskHandlerBase;
exports.default = TaskHandlerBase;
//# sourceMappingURL=TaskHandlerBase.js.map