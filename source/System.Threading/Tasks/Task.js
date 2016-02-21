/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
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
})(["require", "exports", "../../System/Types", "../../System/Time/TimeSpan", "../../System/Disposable/DisposableBase", "../CancellationToken", "./TaskFactory", "../../System/Exceptions/ArgumentNullException", "./TaskScheduler", "../../System/Exceptions/InvalidOperationException", "../ThreadAbortException", "./TaskSchedulerException", "./TaskCancelledException", "../../System/Exceptions/AggregateException"], function (require, exports) {
    ///<reference path="ITask"/>
    ///<reference path="TaskCreationOptions.d.ts"/>
    ///<reference path="../../System/Promises/IPromise.d.ts"/>
    ///<reference path="../../System/FunctionTypes.d.ts"/>
    var Types_1 = require("../../System/Types");
    var TimeSpan_1 = require("../../System/Time/TimeSpan");
    var DisposableBase_1 = require("../../System/Disposable/DisposableBase");
    var CancellationToken_1 = require("../CancellationToken");
    var TaskFactory_1 = require("./TaskFactory");
    var ArgumentNullException_1 = require("../../System/Exceptions/ArgumentNullException");
    var TaskScheduler_1 = require("./TaskScheduler");
    var InvalidOperationException_1 = require("../../System/Exceptions/InvalidOperationException");
    var ThreadAbortException_1 = require("../ThreadAbortException");
    var TaskSchedulerException_1 = require("./TaskSchedulerException");
    var TaskCancelledException_1 = require("./TaskCancelledException");
    var AggregateException_1 = require("../../System/Exceptions/AggregateException");
    var _factory = new TaskFactory_1.default();
    var _current;
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task(_task, _asyncState, _parent, _cancellationToken, _options, _internalOptions, _scheduler) {
            if (_options === void 0) { _options = 0; }
            _super.call(this);
            this._task = _task;
            this._asyncState = _asyncState;
            this._parent = _parent;
            this._cancellationToken = _cancellationToken;
            this._options = _options;
            this._internalOptions = _internalOptions;
            this._scheduler = _scheduler;
            this._result = void 0;
            this._stateFlags = 33554432 | _options;
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
                return this._options & ~65280;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "status", {
            get: function () {
                var s;
                var sf = this._stateFlags;
                if ((sf & 2097152) != 0)
                    s = 8;
                else if ((sf & 4194304) != 0)
                    s = 7;
                else if ((sf & 16777216) != 0)
                    s = 6;
                else if ((sf & 8388608) != 0)
                    s = 5;
                else if ((sf & 131072) != 0)
                    s = 3;
                else if ((sf & 65536) != 0)
                    s = 2;
                else if ((sf & 33554432) != 0)
                    s = 1;
                else
                    s = 0;
                return s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCancelled", {
            get: function () {
                return (this._stateFlags & (4194304 | 2097152)) == 4194304;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCompleted", {
            get: function () {
                return taskStateIsCompleted(this._stateFlags);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isFaulted", {
            get: function () {
                return ((this._stateFlags & 2097152) != 0);
            },
            enumerable: true,
            configurable: true
        });
        Task.run = function (task, asyncState, cancellationToken, creationOptions, scheduler) {
            if (creationOptions === void 0) { creationOptions = 0; }
            if (scheduler === void 0) { scheduler = TaskScheduler_1.default.default; }
            return Task._internalStartNew(null, task, asyncState, cancellationToken, scheduler, creationOptions);
        };
        Task._internalStartNew = function (creatingTask, action, state, cancellationToken, scheduler, options, internalOptions) {
            if (options === void 0) { options = 0; }
            if (internalOptions === void 0) { internalOptions = 0; }
            if (!scheduler)
                throw new ArgumentNullException_1.default("scheduler");
            var t = new Task(action, state, creatingTask, cancellationToken, options, internalOptions | 8192, scheduler);
            t._scheduleAndStart(false);
            return t;
        };
        Task.prototype._stateUpdate = function (newBits, illegalBits) {
            do {
                var oldFlags = this._stateFlags;
                if ((oldFlags & illegalBits) != 0)
                    return false;
                this._stateFlags = oldFlags | newBits;
            } while (this._stateFlags != oldFlags);
            return true;
        };
        Task.prototype._markStarted = function () {
            return this._stateUpdate(65536, 4194304 | 65536);
        };
        Task.prototype._scheduleAndStart = function (needsProtection) {
            var _ = this;
            var scheduler = _._scheduler;
            if (!scheduler)
                throw new InvalidOperationException_1.default("expected a task scheduler to have been selected");
            if ((_._stateFlags & 65536) == 0)
                throw new InvalidOperationException_1.default("task has already started");
            if (needsProtection) {
                if (!this._markStarted()) {
                    return;
                }
            }
            else {
                _._stateFlags |= 65536;
            }
            try {
                scheduler.internalQueueTask(this);
            }
            catch (e) {
                if (e instanceof ThreadAbortException_1.default) {
                    _._addException(e);
                    _._finishThreadAbortedTask(true, false);
                    return;
                }
                _._addException(new TaskSchedulerException_1.default(e));
                _._finish(false);
                if ((_._options & 512) == 0) {
                    m_contingentProperties.m_exceptionsHolder.MarkAsHandled(false);
                }
                throw tse;
            }
        };
        Task.prototype._addException = function (exceptionObject, representsCancellation) {
            if (!exceptionObject)
                throw new ArgumentNullException_1.default("exceptionObject", "Task.addException: Expected a non-null exception object");
            var holder = this._exceptionsHolder;
            if (!holder)
                this._exceptionsHolder = holder = [];
            holder.push({ exception: exceptionObject, cancellation: representsCancellation });
        };
        Task.prototype.getExceptions = function (includeTaskCanceledExceptions) {
            var canceledException = null;
            if (includeTaskCanceledExceptions && this.isCancelled) {
                canceledException = new TaskCancelledException_1.default(this);
            }
            if (this.exceptionRecorded) {
                return m_contingentProperties.m_exceptionsHolder.CreateExceptionObject(false, canceledException);
            }
            else if (canceledException != null) {
                return new AggregateException_1.default(canceledException);
            }
            return null;
        };
        Task.completedTask = function (canceled, creationOptions, ct) {
            var task = new Task();
            if (canceled) {
                task._stateFlags = 4194304 | 1048576 | creationOptions;
            }
            else
                task._stateFlags = 16777216 | creationOptions;
            return task;
        };
        Task.prototype.runSynchronously = function (scheduler) {
        };
        Task.prototype._startUnsafe = function (scheduler) {
        };
        Task.prototype.start = function (scheduler) {
        };
        Task.prototype.then = function (onFulfilled, onRejected) {
            throw 'not implemented yet';
        };
        Task.prototype.waitWith = function (continuationAction, timeOrCancel, token) {
            if (timeOrCancel instanceof CancellationToken_1.default)
                token = timeOrCancel;
            var milliseconds = Types_1.default.isNumber(timeOrCancel)
                ? timeOrCancel
                : 0;
            if (timeOrCancel instanceof TimeSpan_1.default)
                milliseconds = timeOrCancel.milliseconds;
            return null;
        };
        Task.prototype.equals = function (other) {
            return this === other || this.id === other.id;
        };
        Task.prototype.delay = function (time) {
            throw 'not implemented yet';
        };
        Task.prototype.continueWith = function (continuationAction, a, b, c, d) {
            throw 'not implemented yet';
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
    })(DisposableBase_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Task;
    function taskStateIsCompleted(flags) {
        return (flags & 23068672) != 0;
    }
});
//# sourceMappingURL=Task.js.map