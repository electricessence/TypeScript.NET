/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeferBase = function () {
    function DeferBase() {
        _classCallCheck(this, DeferBase);
    }

    _createClass(DeferBase, [{
        key: "dispose",
        value: function dispose() {
            this.cancel();
        }
    }]);

    return DeferBase;
}();

var Defer = function (_DeferBase) {
    _inherits(Defer, _DeferBase);

    function Defer(task, delay, payload) {
        _classCallCheck(this, Defer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Defer).call(this));

        if (!(delay > 0)) delay = 0;
        _this._id = setTimeout(Defer.handler, delay, task, _this, payload);
        return _this;
    }

    _createClass(Defer, [{
        key: "cancel",
        value: function cancel() {
            var id = this._id;
            if (id) {
                clearTimeout(id);
                this._id = null;
                return true;
            }
            return false;
        }
    }], [{
        key: "handler",
        value: function handler(task, d, payload) {
            d.cancel();
            task(payload);
        }
    }]);

    return Defer;
}(DeferBase);

var DeferInterval = function (_DeferBase2) {
    _inherits(DeferInterval, _DeferBase2);

    function DeferInterval(task, interval) {
        var _remaining = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

        _classCallCheck(this, DeferInterval);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DeferInterval).call(this));

        _this2._remaining = _remaining;
        if (interval === null || interval === void 0) throw "'interval' must be a valid number.";
        if (interval < 0) throw "'interval' cannot be negative.";
        _this2._id = setInterval(DeferInterval.handler, interval, task, _this2);
        return _this2;
    }

    _createClass(DeferInterval, [{
        key: "cancel",
        value: function cancel() {
            var id = this._id;
            if (id) {
                clearInterval(id);
                this._id = null;
                return true;
            }
            return false;
        }
    }], [{
        key: "handler",
        value: function handler(task, d) {
            if (! --d._remaining) d.cancel();
            task();
        }
    }]);

    return DeferInterval;
}(DeferBase);

function defer(task, delay, payload) {
    return new Defer(task, delay, payload);
}
exports.defer = defer;
function interval(task, interval) {
    var count = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

    return new DeferInterval(task, interval, count);
}
exports.interval = interval;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defer;
//# sourceMappingURL=defer.js.map
