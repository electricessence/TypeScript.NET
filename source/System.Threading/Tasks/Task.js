var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../System/Types', '../../System/Time/TimeSpan', '../../System/Disposable/DisposableBase', '../CancellationToken'], function (require, exports, Types, TimeSpan, DisposableBase, CancellationToken) {
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task(_task, _asyncState, _cancellationToken, _creationOptions) {
            if (_creationOptions === void 0) { _creationOptions = 0; }
            _super.call(this);
            this._task = _task;
            this._asyncState = _asyncState;
            this._cancellationToken = _cancellationToken;
            this._creationOptions = _creationOptions;
            this._result = undefined;
            this._status = 0;
        }
        Object.defineProperty(Task.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "result", {
            get: function () {
                return this._result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "exception", {
            get: function () {
                return this._exception;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "asyncState", {
            get: function () {
                return this._asyncState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "creationOptions", {
            get: function () {
                return this._creationOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isRunning", {
            get: function () {
                return this._status == 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCancelled", {
            get: function () {
                return this._status == 7;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCompleted", {
            get: function () {
                return this._status == 6;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isFaulted", {
            get: function () {
                return this._status == 8;
            },
            enumerable: true,
            configurable: true
        });
        Task.prototype.runSynchronously = function (scheduler) {
        };
        Task.prototype.start = function (scheduler) {
        };
        Task.prototype.wait = function (timeOrCancel, token) {
            if (timeOrCancel instanceof CancellationToken)
                token = timeOrCancel;
            var milliseconds = Types.isNumber(timeOrCancel)
                ? timeOrCancel
                : 0;
            if (timeOrCancel instanceof TimeSpan)
                milliseconds = timeOrCancel.milliseconds;
        };
        Task.prototype.equals = function (other) {
            return this == other || this.id == other.id;
        };
        Object.defineProperty(Task.prototype, "_executingTaskScheduler", {
            get: function () {
                return this._scheduler;
            },
            enumerable: true,
            configurable: true
        });
        Task.prototype._executeEntry = function (bPreventDoubleExecution) {
            return true;
        };
        return Task;
    })(DisposableBase);
    exports.Task = Task;
});
//# sourceMappingURL=Task.js.map