'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _SystemCollectionsQueue = require('../../System/Collections/Queue');

var _SystemCollectionsQueue2 = _interopRequireDefault(_SystemCollectionsQueue);

var _lastId = 0 | 0;
var _defaultScheduler;
var _currentScheduler;
var MAX_INT32_SIGNED = 2147483647 | 0;

var TaskScheduler = (function () {
    function TaskScheduler() {
        var _maximumConcurrencyLevel = arguments.length <= 0 || arguments[0] === undefined ? MAX_INT32_SIGNED : arguments[0];

        _classCallCheck(this, TaskScheduler);

        this._maximumConcurrencyLevel = _maximumConcurrencyLevel;
        this._id = ++_lastId;
        this._queue = new _SystemCollectionsQueue2['default']();
    }

    _createClass(TaskScheduler, [{
        key: '_getScheduledTasks',
        value: function _getScheduledTasks() {
            return this._queue.toArray();
        }
    }, {
        key: '_ensureWorkerReady',
        value: function _ensureWorkerReady() {
            var _this = this;

            var _ = this;
            if (!_._workerId) {
                _._workerId = setTimeout(function () {
                    _._workerId = 0;
                    _currentScheduler = _this;
                    while (_._queue.count) {
                        _._tryExecuteTask(_._queue.dequeue());
                    }
                    _currentScheduler = null;
                });
            }
        }
    }, {
        key: 'queueTask',
        value: function queueTask(task) {
            if (!task) throw new Error("ArgumentNullException");
            this._queue.enqueue(task);
            this._ensureWorkerReady();
        }
    }, {
        key: '_tryDequeue',
        value: function _tryDequeue(task) {
            return this._queue.remove(task) !== 0;
        }
    }, {
        key: '_tryExecuteTask',
        value: function _tryExecuteTask(task) {
            if (task['_executingTaskScheduler'] != this) throw new Error("Executed Task on wrong TaskScheduler.");
            return task['_executeEntry'](true);
        }
    }, {
        key: 'tryExecuteTaskInline',
        value: function tryExecuteTaskInline(task, taskWasPreviouslyQueued) {
            if (taskWasPreviouslyQueued && !this._tryDequeue(task)) return false;
            return this._tryExecuteTask(task);
        }
    }, {
        key: 'id',
        get: function get() {
            return this._id;
        }
    }, {
        key: 'maximumConcurrencyLevel',
        get: function get() {
            return this._maximumConcurrencyLevel;
        }
    }], [{
        key: 'fromCurrentSynchronizationContext',
        value: function fromCurrentSynchronizationContext() {
            return null;
        }
    }, {
        key: 'current',
        get: function get() {
            return _currentScheduler || TaskScheduler.defaultInstance;
        }
    }, {
        key: 'defaultInstance',
        get: function get() {
            if (!_defaultScheduler) _defaultScheduler = new TaskScheduler();
            return _defaultScheduler;
        }
    }]);

    return TaskScheduler;
})();

exports['default'] = TaskScheduler;
module.exports = exports['default'];
//# sourceMappingURL=TaskScheduler.js.map
