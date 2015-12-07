/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * .NET Reference:
 *	http://msdn.microsoft.com/en-us/library/dd321424%28v=vs.110%29.aspx
 *	http://referencesource.microsoft.com/#mscorlib/system/threading/Tasks/Task.cs
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _SystemTypes = require("../../System/Types");

var _SystemTypes2 = _interopRequireDefault(_SystemTypes);

var _SystemTimeTimeSpan = require("../../System/Time/TimeSpan");

var _SystemTimeTimeSpan2 = _interopRequireDefault(_SystemTimeTimeSpan);

var _SystemDisposableDisposableBase = require("../../System/Disposable/DisposableBase");

var _SystemDisposableDisposableBase2 = _interopRequireDefault(_SystemDisposableDisposableBase);

var _CancellationToken = require("../CancellationToken");

var _CancellationToken2 = _interopRequireDefault(_CancellationToken);

var Task = (function (_DisposableBase) {
    _inherits(Task, _DisposableBase);

    function Task(_task, _asyncState, _cancellationToken) {
        var _creationOptions = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        _classCallCheck(this, Task);

        _get(Object.getPrototypeOf(Task.prototype), "constructor", this).call(this);
        this._task = _task;
        this._asyncState = _asyncState;
        this._cancellationToken = _cancellationToken;
        this._creationOptions = _creationOptions;
        this._result = void 0;
        this._status = 0;
    }

    _createClass(Task, [{
        key: "runSynchronously",
        value: function runSynchronously(scheduler) {}
    }, {
        key: "start",
        value: function start(scheduler) {}
    }, {
        key: "then",
        value: function then(onFulfilled, onRejected) {
            throw 'not implemented yet';
        }
    }, {
        key: "waitWith",
        value: function waitWith(continuationAction, timeOrCancel, token) {
            if (_SystemTypes2["default"].isInstanceOf(timeOrCancel, _CancellationToken2["default"])) token = timeOrCancel;
            var milliseconds = _SystemTypes2["default"].isNumber(timeOrCancel) ? timeOrCancel : 0;
            if (_SystemTypes2["default"].isInstanceOf(timeOrCancel, _SystemTimeTimeSpan2["default"])) milliseconds = timeOrCancel.milliseconds;
            return null;
        }
    }, {
        key: "equals",
        value: function equals(other) {
            return this === other || this.id === other.id;
        }
    }, {
        key: "delay",
        value: function delay(time) {
            throw 'not implemented yet';
        }
    }, {
        key: "continueWith",
        value: function continueWith(continuationAction, a, b, c, d) {
            throw 'not implemented yet';
        }
    }, {
        key: "_executeEntry",
        value: function _executeEntry(bPreventDoubleExecution) {
            return true;
        }
    }, {
        key: "id",
        get: function get() {
            return this._id;
        }
    }, {
        key: "result",
        get: function get() {
            return this._result;
        }
    }, {
        key: "exception",
        get: function get() {
            return this._exception;
        }
    }, {
        key: "asyncState",
        get: function get() {
            return this._asyncState;
        }
    }, {
        key: "creationOptions",
        get: function get() {
            return this._creationOptions;
        }
    }, {
        key: "status",
        get: function get() {
            return this._status;
        }
    }, {
        key: "isRunning",
        get: function get() {
            return this._status == 3;
        }
    }, {
        key: "isCancelled",
        get: function get() {
            return this._status == 7;
        }
    }, {
        key: "isCompleted",
        get: function get() {
            return this._status == 6;
        }
    }, {
        key: "isFaulted",
        get: function get() {
            return this._status == 8;
        }
    }, {
        key: "_executingTaskScheduler",
        get: function get() {
            return this._scheduler;
        }
    }]);

    return Task;
})(_SystemDisposableDisposableBase2["default"]);

exports["default"] = Task;
module.exports = exports["default"];
//# sourceMappingURL=Task.js.map
