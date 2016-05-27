/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TaskHandlerBase_1 = require("./TaskHandlerBase");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var Lazy_1 = require("../../Lazy");

var Task = function (_TaskHandlerBase_1$Ta) {
    _inherits(Task, _TaskHandlerBase_1$Ta);

    function Task(valueFactory) {
        _classCallCheck(this, Task);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Task).call(this));

        if (!valueFactory) throw new ArgumentNullException_1.ArgumentNullException('valueFactory');
        _this._result = new Lazy_1.Lazy(valueFactory, false);
        return _this;
    }

    _createClass(Task, [{
        key: "_onExecute",
        value: function _onExecute() {
            this._result.getValue();
        }
    }, {
        key: "getResult",
        value: function getResult() {
            return this._result.value;
        }
    }, {
        key: "getState",
        value: function getState() {
            var r = this._result;
            return r && {
                status: this.getStatus(),
                result: r.isValueCreated ? r.value : void 0,
                error: r.error
            };
        }
    }, {
        key: "start",
        value: function start(defer) {
            if (this.getStatus() == 0) {
                _get(Object.getPrototypeOf(Task.prototype), "start", this).call(this, defer);
            }
        }
    }, {
        key: "runSynchronously",
        value: function runSynchronously() {
            if (this.getStatus() == 0) {
                _get(Object.getPrototypeOf(Task.prototype), "runSynchronously", this).call(this);
            }
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(Task.prototype), "_onDispose", this).call(this);
            var r = this._result;
            if (r) {
                this._result = null;
                r.dispose();
            }
        }
    }, {
        key: "state",
        get: function get() {
            return this.getState();
        }
    }, {
        key: "result",
        get: function get() {
            this.throwIfDisposed();
            this.runSynchronously();
            return this.getResult();
        }
    }, {
        key: "error",
        get: function get() {
            this.throwIfDisposed();
            return this._result.error;
        }
    }]);

    return Task;
}(TaskHandlerBase_1.TaskHandlerBase);

exports.Task = Task;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task;
//# sourceMappingURL=Task.js.map
