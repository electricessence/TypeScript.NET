/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise_1 = require("./Promise");
var defer_1 = require("../Threading/defer");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var VOID0 = void 0;

var LazyPromise = function (_Promise_1$Promise) {
    _inherits(LazyPromise, _Promise_1$Promise);

    function LazyPromise(_resolver) {
        _classCallCheck(this, LazyPromise);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LazyPromise).call(this));

        _this._resolver = _resolver;
        if (!_resolver) throw new ArgumentNullException_1.ArgumentNullException("resolver");
        _this._resolvedCalled = true;
        return _this;
    }

    _createClass(LazyPromise, [{
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(LazyPromise.prototype), "_onDispose", this).call(this);
            this._resolver = VOID0;
        }
    }, {
        key: "_onThen",
        value: function _onThen() {
            var r = this._resolver;
            if (r) {
                this._resolver = VOID0;
                this._resolvedCalled = false;
                this.resolveUsing(r);
            }
        }
    }, {
        key: "thenSynchronous",
        value: function thenSynchronous(onFulfilled, onRejected) {
            this._onThen();
            return _get(Object.getPrototypeOf(LazyPromise.prototype), "thenSynchronous", this).call(this, onFulfilled, onRejected);
        }
    }, {
        key: "thenThis",
        value: function thenThis(onFulfilled, onRejected) {
            this._onThen();
            return _get(Object.getPrototypeOf(LazyPromise.prototype), "thenThis", this).call(this, onFulfilled, onRejected);
        }
    }, {
        key: "delayFromNow",
        value: function delayFromNow() {
            var _this2 = this;

            var milliseconds = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.throwIfDisposed();
            if (!this._resolver || this.isSettled) return _get(Object.getPrototypeOf(LazyPromise.prototype), "delayFromNow", this).call(this, milliseconds);
            var _pass;
            var timedOut = false;
            var timeout = defer_1.defer(function () {
                timedOut = true;
                if (_pass) _pass();
            }, milliseconds);
            return new LazyPromise(function (resolve, reject) {
                _pass = function pass() {
                    _this2.thenThis(function (v) {
                        return resolve(v);
                    }, function (e) {
                        return reject(e);
                    });
                    timeout.dispose();
                    timeout = null;
                    _pass = null;
                };
                if (timedOut) _pass();
            });
        }
    }, {
        key: "delayAfterResolve",
        value: function delayAfterResolve() {
            var _this3 = this;

            var milliseconds = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            this.throwIfDisposed();
            if (!this._resolver || this.isSettled) return _get(Object.getPrototypeOf(LazyPromise.prototype), "delayAfterResolve", this).call(this, milliseconds);
            var pass;
            var timeout;
            var _finalize = function finalize() {
                if (timeout) {
                    timeout.dispose();
                    timeout = null;
                }
                if (pass) pass();
                _finalize = null;
            };
            {
                var detector = function detector() {
                    if (_finalize) timeout = defer_1.defer(_finalize, milliseconds);
                };
                _get(Object.getPrototypeOf(LazyPromise.prototype), "thenThis", this).call(this, detector, detector);
                detector = null;
            }
            return new LazyPromise(function (resolve, reject) {
                if (_this3.isPending) {
                    _this3.thenThis(function (v) {
                        return defer_1.defer(function () {
                            return resolve(v);
                        }, milliseconds);
                    }, function (e) {
                        return defer_1.defer(function () {
                            return reject(e);
                        }, milliseconds);
                    });
                    _finalize();
                } else {
                    pass = function pass() {
                        _this3.thenThis(function (v) {
                            return resolve(v);
                        }, function (e) {
                            return reject(e);
                        });
                    };
                    if (!_finalize) pass();
                }
            });
        }
    }]);

    return LazyPromise;
}(Promise_1.Promise);

exports.LazyPromise = LazyPromise;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LazyPromise;
//# sourceMappingURL=LazyPromise.js.map
