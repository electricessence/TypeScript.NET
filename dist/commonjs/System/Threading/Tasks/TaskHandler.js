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

var TaskHandler = function (_TaskHandlerBase_1$Ta) {
    _inherits(TaskHandler, _TaskHandlerBase_1$Ta);

    function TaskHandler(_action) {
        _classCallCheck(this, TaskHandler);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskHandler).call(this));

        _this._action = _action;
        if (!_action) throw new ArgumentNullException_1.ArgumentNullException('action');
        return _this;
    }

    _createClass(TaskHandler, [{
        key: "_onExecute",
        value: function _onExecute() {
            this._action();
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(TaskHandler.prototype), "_onDispose", this).call(this);
            this._action = null;
        }
    }]);

    return TaskHandler;
}(TaskHandlerBase_1.TaskHandlerBase);

exports.TaskHandler = TaskHandler;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TaskHandler;
//# sourceMappingURL=TaskHandler.js.map
