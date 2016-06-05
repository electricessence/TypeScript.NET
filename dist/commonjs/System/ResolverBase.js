/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisposableBase_1 = require("./Disposable/DisposableBase");
var ArgumentNullException_1 = require("./Exceptions/ArgumentNullException");
var extends_1 = require("../extends");
var __extends = extends_1.default;

var ResolverBase = function (_DisposableBase_1$Dis) {
    _inherits(ResolverBase, _DisposableBase_1$Dis);

    function ResolverBase(_valueFactory, _trapExceptions, _allowReset) {
        _classCallCheck(this, ResolverBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ResolverBase).call(this));

        _this._valueFactory = _valueFactory;
        _this._trapExceptions = _trapExceptions;
        _this._allowReset = _allowReset;
        if (!_valueFactory) throw new ArgumentNullException_1.ArgumentNullException("valueFactory");
        _this._isValueCreated = false;
        return _this;
    }

    _createClass(ResolverBase, [{
        key: "getError",
        value: function getError() {
            return this._error;
        }
    }, {
        key: "getValue",
        value: function getValue() {
            var _ = this;
            _.throwIfDisposed();
            if (_._isValueCreated === null) throw new Error("Recursion detected.");
            if (!_._isValueCreated && _._valueFactory) {
                _._isValueCreated = null;
                try {
                    var c = undefined;
                    if (!_._isValueCreated && (c = _._valueFactory)) {
                        _._isValueCreated = null;
                        if (!this._allowReset) this._valueFactory = null;
                        var v = c();
                        _._value = v;
                        _._error = void 0;
                        return v;
                    }
                } catch (ex) {
                    _._error = ex;
                    if (!_._trapExceptions) throw ex;
                } finally {
                    _._isValueCreated = true;
                }
            }
            return _._value;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            this._valueFactory = null;
            this._value = null;
            this._isValueCreated = null;
        }
    }, {
        key: "tryReset",
        value: function tryReset() {
            var _ = this;
            if (!_._valueFactory) return false;else {
                _._isValueCreated = false;
                _._value = null;
                _._error = void 0;
                return true;
            }
        }
    }, {
        key: "error",
        get: function get() {
            return this.getError();
        }
    }, {
        key: "canReset",
        get: function get() {
            return this._allowReset && !!this._valueFactory;
        }
    }]);

    return ResolverBase;
}(DisposableBase_1.DisposableBase);

exports.ResolverBase = ResolverBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResolverBase;
//# sourceMappingURL=ResolverBase.js.map
