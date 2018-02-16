"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TaskHandlerBase_1 = require("./TaskHandlerBase");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var Lazy_1 = require("../../Lazy");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/**
 * A simplified synchronous (but deferrable) version of Task<T>
 * Asynchronous operations should use Promise<T>.
 */
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task(valueFactory) {
        var _this = _super.call(this) || this;
        if (!valueFactory)
            throw new ArgumentNullException_1.ArgumentNullException('valueFactory');
        _this._result = new Lazy_1.Lazy(valueFactory, false);
        return _this;
    }
    Task.prototype._onExecute = function () {
        this._result.getValue();
    };
    Task.prototype.getResult = function () {
        return this._result.value; // This will detect any potential recursion.
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
        if (this.getStatus() == 0 /* Created */) {
            _super.prototype.start.call(this, defer);
        }
    };
    Task.prototype.runSynchronously = function () {
        if (this.getStatus() == 0 /* Created */) {
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
exports.default = Task;
//# sourceMappingURL=Task.js.map