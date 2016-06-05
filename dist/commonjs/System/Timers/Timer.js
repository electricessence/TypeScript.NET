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

var ObservableBase_1 = require("../Observable/ObservableBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;

var Timer = function (_ObservableBase_1$Obs) {
    _inherits(Timer, _ObservableBase_1$Obs);

    function Timer(_interval) {
        var _maxCount = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

        var _initialDelay = arguments.length <= 2 || arguments[2] === undefined ? _interval : arguments[2];

        _classCallCheck(this, Timer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Timer).call(this));

        _this._interval = _interval;
        _this._maxCount = _maxCount;
        _this._initialDelay = _initialDelay;
        _this._count = 0;
        if (_interval === null || _interval === void 0) throw "'interval' must be a valid number.";
        if (_interval < 0) throw "'interval' cannot be negative.";
        return _this;
    }

    _createClass(Timer, [{
        key: "start",
        value: function start() {
            var _ = this;
            if (!_._cancel && _._count < _._maxCount) {
                if (_._count || _._initialDelay == _._interval) {
                    (function () {
                        var i = setInterval(Timer._onTick, _._interval, _);
                        _._cancel = function () {
                            clearInterval(i);
                        };
                    })();
                } else {
                    (function () {
                        var i = setTimeout(Timer._onTick, _._initialDelay, _, true);
                        _._cancel = function () {
                            clearTimeout(i);
                        };
                    })();
                }
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            this.cancel();
        }
    }, {
        key: "reset",
        value: function reset() {
            this.stop();
            this._count = 0;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (this._cancel) {
                this._cancel();
                this._cancel = null;
                return true;
            }
            return false;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.cancel();
            _get(Object.getPrototypeOf(Timer.prototype), "dispose", this).call(this);
        }
    }, {
        key: "isRunning",
        get: function get() {
            return !!this._cancel;
        }
    }, {
        key: "count",
        get: function get() {
            return this._count;
        }
    }], [{
        key: "startNew",
        value: function startNew(millisecondInterval) {
            var maxCount = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];
            var initialDelay = arguments.length <= 2 || arguments[2] === undefined ? millisecondInterval : arguments[2];

            var t = new Timer(millisecondInterval, maxCount, millisecondInterval);
            t.start();
            return t;
        }
    }, {
        key: "_onTick",
        value: function _onTick(timer, reInitTimer) {
            var index = timer._count++,
                max = timer._maxCount,
                isComplete = timer._count >= max;
            if (reInitTimer) {
                timer.cancel();
                timer.start();
            }
            if (isComplete) {
                timer.stop();
            }
            if (index < max) {
                timer._onNext(index);
            }
            if (isComplete) {
                timer._onCompleted();
            }
        }
    }]);

    return Timer;
}(ObservableBase_1.ObservableBase);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Timer;
//# sourceMappingURL=Timer.js.map
