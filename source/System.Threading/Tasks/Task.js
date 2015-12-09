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
})(["require", "exports", "../../System/Types", "../../System/Time/TimeSpan", "../../System/Disposable/DisposableBase", "../CancellationToken", "./TaskFactory"], function (require, exports) {
    ///<reference path="ITask"/>
    ///<reference path="TaskCreationOptions.d.ts"/>
    ///<reference path="../../System/Promises/IPromise.d.ts"/>
    var Types_1 = require("../../System/Types");
    var TimeSpan_1 = require("../../System/Time/TimeSpan");
    var DisposableBase_1 = require("../../System/Disposable/DisposableBase");
    var CancellationToken_1 = require("../CancellationToken");
    var TaskFactory_1 = require("./TaskFactory");
    var _factory = new TaskFactory_1.default();
    var _current;
    var Task = (function (_super) {
        __extends(Task, _super);
        function Task(_task, _asyncState, _cancellationToken, _creationOptions) {
            if (_creationOptions === void 0) { _creationOptions = 0; }
            _super.call(this);
            this._task = _task;
            this._asyncState = _asyncState;
            this._cancellationToken = _cancellationToken;
            this._creationOptions = _creationOptions;
            this._result = void 0;
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
                return this._status === 3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCancelled", {
            get: function () {
                return this._status === 7;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isCompleted", {
            get: function () {
                return this._status === 6;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Task.prototype, "isFaulted", {
            get: function () {
                return this._status === 8;
            },
            enumerable: true,
            configurable: true
        });
        Task.run = function (task, asyncState, cancellationToken, creationOptions) {
            if (creationOptions === void 0) { creationOptions = 0; }
            var t = new Task(task, asyncState, cancellationToken, creationOptions);
            t._startUnsafe();
            return t;
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
            if (Types_1.default.isInstanceOf(timeOrCancel, CancellationToken_1.default))
                token = timeOrCancel;
            var milliseconds = Types_1.default.isNumber(timeOrCancel)
                ? timeOrCancel
                : 0;
            if (Types_1.default.isInstanceOf(timeOrCancel, TimeSpan_1.default))
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
});
//# sourceMappingURL=Task.js.map