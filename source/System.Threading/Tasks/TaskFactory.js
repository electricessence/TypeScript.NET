///<reference path="../../System/FunctionTypes.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/TaskFactory.cs
 */
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "./TaskScheduler", "../../System/Exceptions/ArgumentOutOfRangeException"], function (require, exports) {
    var TaskScheduler_1 = require("./TaskScheduler");
    var ArgumentOutOfRangeException_1 = require("../../System/Exceptions/ArgumentOutOfRangeException");
    var TaskFactory = (function () {
        function TaskFactory(_cancellationToken, _creationOptions, _continuationOptions, _scheduler) {
            if (_creationOptions === void 0) { _creationOptions = 0; }
            if (_continuationOptions === void 0) { _continuationOptions = 0; }
            this._cancellationToken = _cancellationToken;
            this._creationOptions = _creationOptions;
            this._continuationOptions = _continuationOptions;
            this._scheduler = _scheduler;
        }
        Object.defineProperty(TaskFactory.prototype, "cancellationToken", {
            get: function () {
                return this._cancellationToken;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskFactory.prototype, "creationOptions", {
            get: function () {
                return this._creationOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskFactory.prototype, "continuationOptions", {
            get: function () {
                return this._continuationOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskFactory.prototype, "scheduler", {
            get: function () {
                return this._scheduler;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TaskFactory.prototype, "_defaultScheduler", {
            get: function () {
                return this._scheduler || TaskScheduler_1.default.current;
            },
            enumerable: true,
            configurable: true
        });
        TaskFactory.prototype.getDefaultScheduler = function (task) {
            var s = this._scheduler;
            if (s)
                return s;
            else if (task && ((task.creationOptions & 16) == 0))
                return task._executingTaskScheduler;
            else
                return TaskScheduler_1.default.default;
        };
        TaskFactory._checkCreationOptions = function (creationOptions) {
            if ((creationOptions & ~(4 |
                8 |
                16 |
                2 |
                1 |
                64)) != 0) {
                throw new ArgumentOutOfRangeException_1.default("creationOptions", creationOptions);
            }
        };
        TaskFactory.prototype.startNew = function (f, token, creationOptions, scheduler) {
            if (creationOptions === void 0) { creationOptions = 0; }
        };
        return TaskFactory;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TaskFactory;
});
//# sourceMappingURL=TaskFactory.js.map