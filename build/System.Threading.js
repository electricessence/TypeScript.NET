var System;
(function (System) {
    (function (Threading) {
        var noneToken = new CancellationToken();

        var CancellationToken = (function () {
            function CancellationToken() {
            }
            Object.defineProperty(CancellationToken, "none", {
                get: function () {
                    return noneToken;
                },
                enumerable: true,
                configurable: true
            });
            return CancellationToken;
        })();
        Threading.CancellationToken = CancellationToken;
    })(System.Threading || (System.Threading = {}));
    var Threading = System.Threading;
})(System || (System = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisposableBase = System.DisposableBase;
var TimeSpan = System.TimeSpan;
var TaskScheduler = System.Threading.Tasks.TaskScheduler;

var System;
(function (System) {
    (function (Threading) {
        (function (Tasks) {
            var Task = (function (_super) {
                __extends(Task, _super);
                function Task(_task, _asyncState, _cancellationToken, _creationOptions) {
                    if (typeof _creationOptions === "undefined") { _creationOptions = 0 /* None */; }
                    _super.call(this);
                    this._task = _task;
                    this._asyncState = _asyncState;
                    this._cancellationToken = _cancellationToken;
                    this._creationOptions = _creationOptions;
                    this._result = undefined;
                    this._status = 0 /* Created */;
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
                        return this._status == 3 /* Running */;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Task.prototype, "isCancelled", {
                    get: function () {
                        return this._status == 7 /* Canceled */;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Task.prototype, "isCompleted", {
                    get: function () {
                        return this._status == 6 /* RanToCompletion */;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(Task.prototype, "isFaulted", {
                    get: function () {
                        return this._status == 8 /* Faulted */;
                    },
                    enumerable: true,
                    configurable: true
                });

                Task.prototype.runSynchronously = function (scheduler) {
                };

                Task.prototype.start = function (scheduler) {
                };

                Task.prototype.wait = function (time, token) {
                    if (time instanceof Threading.CancellationToken) {
                        token = time;
                    }

                    var milliseconds = System.Types.isNumber(time) ? time : 0;

                    if (time instanceof System.TimeSpan) {
                        milliseconds = time.milliseconds;
                    }
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
            })(System.DisposableBase);
            Tasks.Task = Task;

            (function (TaskStatus) {
                TaskStatus[TaskStatus["Created"] = 0] = "Created";

                TaskStatus[TaskStatus["WaitingForActivation"] = 1] = "WaitingForActivation";

                TaskStatus[TaskStatus["WaitingToRun"] = 2] = "WaitingToRun";

                TaskStatus[TaskStatus["Running"] = 3] = "Running";

                TaskStatus[TaskStatus["Blocked"] = 4] = "Blocked";

                TaskStatus[TaskStatus["WaitingForChildrenToComplete"] = 5] = "WaitingForChildrenToComplete";

                TaskStatus[TaskStatus["RanToCompletion"] = 6] = "RanToCompletion";

                TaskStatus[TaskStatus["Canceled"] = 7] = "Canceled";

                TaskStatus[TaskStatus["Faulted"] = 8] = "Faulted";
            })(Tasks.TaskStatus || (Tasks.TaskStatus = {}));
            var TaskStatus = Tasks.TaskStatus;

            (function (TaskCreationOptions) {
                TaskCreationOptions[TaskCreationOptions["None"] = 0x0] = "None";

                TaskCreationOptions[TaskCreationOptions["PreferFairness"] = 0x01] = "PreferFairness";

                TaskCreationOptions[TaskCreationOptions["LongRunning"] = 0x02] = "LongRunning";

                TaskCreationOptions[TaskCreationOptions["AttachedToParent"] = 0x04] = "AttachedToParent";

                TaskCreationOptions[TaskCreationOptions["DenyChildAttach"] = 0x08] = "DenyChildAttach";

                TaskCreationOptions[TaskCreationOptions["HideScheduler"] = 0x10] = "HideScheduler";
            })(Tasks.TaskCreationOptions || (Tasks.TaskCreationOptions = {}));
            var TaskCreationOptions = Tasks.TaskCreationOptions;

            var InternalTaskOptions;
            (function (InternalTaskOptions) {
                InternalTaskOptions[InternalTaskOptions["None"] = 0] = "None";

                InternalTaskOptions[InternalTaskOptions["InternalOptionsMask"] = 0x0000FF00] = "InternalOptionsMask";

                InternalTaskOptions[InternalTaskOptions["ChildReplica"] = 0x0100] = "ChildReplica";
                InternalTaskOptions[InternalTaskOptions["ContinuationTask"] = 0x0200] = "ContinuationTask";
                InternalTaskOptions[InternalTaskOptions["PromiseTask"] = 0x0400] = "PromiseTask";
                InternalTaskOptions[InternalTaskOptions["SelfReplicating"] = 0x0800] = "SelfReplicating";

                InternalTaskOptions[InternalTaskOptions["LazyCancellation"] = 0x1000] = "LazyCancellation";

                InternalTaskOptions[InternalTaskOptions["QueuedByRuntime"] = 0x2000] = "QueuedByRuntime";

                InternalTaskOptions[InternalTaskOptions["DoNotDispose"] = 0x4000] = "DoNotDispose";
            })(InternalTaskOptions || (InternalTaskOptions = {}));

            (function (TaskContinuationOptions) {
                TaskContinuationOptions[TaskContinuationOptions["None"] = 0] = "None";

                TaskContinuationOptions[TaskContinuationOptions["PreferFairness"] = 0x01] = "PreferFairness";

                TaskContinuationOptions[TaskContinuationOptions["LongRunning"] = 0x02] = "LongRunning";

                TaskContinuationOptions[TaskContinuationOptions["AttachedToParent"] = 0x04] = "AttachedToParent";

                TaskContinuationOptions[TaskContinuationOptions["DenyChildAttach"] = 0x08] = "DenyChildAttach";

                TaskContinuationOptions[TaskContinuationOptions["HideScheduler"] = 0x10] = "HideScheduler";

                TaskContinuationOptions[TaskContinuationOptions["LazyCancellation"] = 0x20] = "LazyCancellation";

                TaskContinuationOptions[TaskContinuationOptions["NotOnRanToCompletion"] = 0x10000] = "NotOnRanToCompletion";

                TaskContinuationOptions[TaskContinuationOptions["NotOnFaulted"] = 0x20000] = "NotOnFaulted";

                TaskContinuationOptions[TaskContinuationOptions["NotOnCanceled"] = 0x40000] = "NotOnCanceled";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnRanToCompletion"] = TaskContinuationOptions.NotOnFaulted | TaskContinuationOptions.NotOnCanceled] = "OnlyOnRanToCompletion";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnFaulted"] = TaskContinuationOptions.NotOnRanToCompletion | TaskContinuationOptions.NotOnCanceled] = "OnlyOnFaulted";

                TaskContinuationOptions[TaskContinuationOptions["OnlyOnCanceled"] = TaskContinuationOptions.NotOnRanToCompletion | TaskContinuationOptions.NotOnFaulted] = "OnlyOnCanceled";

                TaskContinuationOptions[TaskContinuationOptions["ExecuteSynchronously"] = 0x80000] = "ExecuteSynchronously";
            })(Tasks.TaskContinuationOptions || (Tasks.TaskContinuationOptions = {}));
            var TaskContinuationOptions = Tasks.TaskContinuationOptions;
        })(Threading.Tasks || (Threading.Tasks = {}));
        var Tasks = Threading.Tasks;
    })(System.Threading || (System.Threading = {}));
    var Threading = System.Threading;
})(System || (System = {}));
var Queue = System.Collections.Queue;

var System;
(function (System) {
    (function (Threading) {
        (function (Tasks) {
            var _lastId = 0 | 0;
            var _defaultScheduler;
            var _currentScheduler;

            var MAX_INT32_SIGNED = 2147483647 | 0;

            var TaskScheduler = (function () {
                function TaskScheduler(_maximumConcurrencyLevel) {
                    if (typeof _maximumConcurrencyLevel === "undefined") { _maximumConcurrencyLevel = MAX_INT32_SIGNED; }
                    this._maximumConcurrencyLevel = _maximumConcurrencyLevel;
                    this._id = ++_lastId;
                    this._queue = new Queue();
                }
                Object.defineProperty(TaskScheduler, "current", {
                    get: function () {
                        return _currentScheduler || TaskScheduler.default;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(TaskScheduler, "default", {
                    get: function () {
                        if (!_defaultScheduler)
                            _defaultScheduler = new TaskScheduler();
                        return _defaultScheduler;
                    },
                    enumerable: true,
                    configurable: true
                });

                TaskScheduler.fromCurrentSynchronizationContext = function () {
                    return null;
                };

                Object.defineProperty(TaskScheduler.prototype, "id", {
                    get: function () {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(TaskScheduler.prototype, "maximumConcurrencyLevel", {
                    get: function () {
                        return this._maximumConcurrencyLevel;
                    },
                    enumerable: true,
                    configurable: true
                });

                TaskScheduler.prototype._getScheduledTasks = function () {
                    return this._queue.toArray();
                };

                TaskScheduler.prototype._ensureWorkerReady = function () {
                    var _this = this;
                    var _ = this;
                    if (!_._workerId) {
                        _._workerId = setTimeout(function () {
                            _._workerId = 0;
                            _currentScheduler = _this;
                            while (_._queue.count)
                                _._tryExecuteTask(_._queue.dequeue());
                            _currentScheduler = null;
                        });
                    }
                };

                TaskScheduler.prototype.queueTask = function (task) {
                    if (!task)
                        throw new Error("ArgumentNullException");
                    this._queue.enqueue(task);
                    this._ensureWorkerReady();
                };

                TaskScheduler.prototype._tryDequeue = function (task) {
                    return this._queue.remove(task) !== 0;
                };

                TaskScheduler.prototype._tryExecuteTask = function (task) {
                    if (task._executingTaskScheduler != this)
                        throw new Error("Excecuted Task on wrong TaskScheduler.");

                    return task._executeEntry(true);
                };

                TaskScheduler.prototype.tryExecuteTaskInline = function (task, taskWasPreviouslyQueued) {
                    if (taskWasPreviouslyQueued && !this._tryDequeue(task))
                        return false;

                    return this._tryExecuteTask(task);
                };
                return TaskScheduler;
            })();
            Tasks.TaskScheduler = TaskScheduler;
        })(Threading.Tasks || (Threading.Tasks = {}));
        var Tasks = Threading.Tasks;
    })(System.Threading || (System.Threading = {}));
    var Threading = System.Threading;
})(System || (System = {}));
//# sourceMappingURL=System.Threading.js.map
