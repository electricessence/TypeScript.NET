(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", '../../System/Collections/Queue', '../../System/Exceptions/ArgumentNullException', '../NextTick'], function (require, exports) {
    var Queue_1 = require('../../System/Collections/Queue');
    var ArgumentNullException_1 = require('../../System/Exceptions/ArgumentNullException');
    var NextTick_1 = require('../NextTick');
    var _lastId = 0 | 0;
    var _defaultScheduler;
    var _currentScheduler;
    var MAX_INT32_SIGNED = 2147483647 | 0;
    var TaskScheduler = (function () {
        function TaskScheduler() {
            this._id = ++_lastId;
            this._queue = new Queue_1.default();
        }
        Object.defineProperty(TaskScheduler, "current", {
            get: function () {
                return _currentScheduler || TaskScheduler.default;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskScheduler, 'default', {
            get: function () {
                if (!_defaultScheduler)
                    _defaultScheduler = new TaskScheduler();
                return _defaultScheduler;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskScheduler.prototype, "id", {
            get: function () {
                return this._id;
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
            if (!_._worker) {
                _._worker = NextTick_1.default.queue(function () {
                    _._worker = null;
                    _currentScheduler = _this;
                    var currentTasks = _._queue.dump();
                    for (var _i = 0; _i < currentTasks.length; _i++) {
                        var task = currentTasks[_i];
                        _._tryExecuteTask(task);
                    }
                    _currentScheduler = null;
                });
            }
        };
        TaskScheduler.prototype.queueTask = function (task) {
            if (!task)
                throw new ArgumentNullException_1.default("task");
            this._queue.enqueue(task);
            this._ensureWorkerReady();
        };
        TaskScheduler.prototype._tryDequeue = function (task) {
            return this._queue.remove(task) !== 0;
        };
        TaskScheduler.prototype._tryExecuteTask = function (task) {
            if (task['_executingTaskScheduler'] != this)
                throw new Error("Executed Task on wrong TaskScheduler.");
            return task['_executeEntry'](true);
        };
        TaskScheduler.prototype._tryExecuteTaskInline = function (task, taskWasPreviouslyQueued) {
            if (taskWasPreviouslyQueued && !this._tryDequeue(task))
                return false;
            return this._tryExecuteTask(task);
        };
        return TaskScheduler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskScheduler;
});
//# sourceMappingURL=TaskScheduler.js.map