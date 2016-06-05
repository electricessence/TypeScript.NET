/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisposableBase_1 = require("../../Disposable/DisposableBase");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;

var TaskHandlerBase = function (_DisposableBase_1$Dis) {
    _inherits(TaskHandlerBase, _DisposableBase_1$Dis);

    function TaskHandlerBase() {
        _classCallCheck(this, TaskHandlerBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskHandlerBase).call(this));

        _this._timeoutId = null;
        _this._status = 0;
        return _this;
    }

    _createClass(TaskHandlerBase, [{
        key: "start",
        value: function start(defer) {
            this.throwIfDisposed();
            this.cancel();
            this._status = 1;
            if (!(defer > 0)) defer = 0;
            if (isFinite(defer)) this._timeoutId = setTimeout(TaskHandlerBase._handler, defer, this);
        }
    }, {
        key: "runSynchronously",
        value: function runSynchronously() {
            this.throwIfDisposed();
            TaskHandlerBase._handler(this);
        }
    }, {
        key: "getStatus",
        value: function getStatus() {
            return this._status;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            this.cancel();
            this._status = null;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            var id = this._timeoutId;
            if (id) {
                clearTimeout(id);
                this._timeoutId = null;
                this._status = 4;
                return true;
            }
            return false;
        }
    }, {
        key: "isScheduled",
        get: function get() {
            return !!this._timeoutId;
        }
    }, {
        key: "status",
        get: function get() {
            return this.getStatus();
        }
    }], [{
        key: "_handler",
        value: function _handler(d) {
            d.cancel();
            d._status = 2;
            try {
                d._onExecute();
                d._status = 3;
            } catch (ex) {
                d._status = 5;
            }
        }
    }]);

    return TaskHandlerBase;
}(DisposableBase_1.DisposableBase);

exports.TaskHandlerBase = TaskHandlerBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TaskHandlerBase;
//# sourceMappingURL=TaskHandlerBase.js.map
