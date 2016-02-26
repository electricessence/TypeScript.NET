/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DisposableBase_1 = require('./Disposable/DisposableBase');

var Lazy = function (_DisposableBase_1$def) {
    _inherits(Lazy, _DisposableBase_1$def);

    function Lazy(_closure) {
        _classCallCheck(this, Lazy);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Lazy).call(this));

        _this._closure = _closure;
        _this._disposableObjectName = 'Lazy';
        return _this;
    }

    _createClass(Lazy, [{
        key: 'reset',
        value: function reset(throwIfCannotReset) {
            var _ = this;
            if (throwIfCannotReset) _.throwIfDisposed();
            if (!_._closure) {
                if (throwIfCannotReset) throw new Error("Cannot reset.  This Lazy has already de-referenced its closure.");
                return false;
            } else {
                _._isValueCreated = false;
                _._value = null;
                return true;
            }
        }
    }, {
        key: 'getValue',
        value: function getValue(clearClosureReference) {
            var _ = this;
            _.throwIfDisposed();
            try {
                if (!_._isValueCreated && _._closure) {
                    var v = _._closure();
                    _._value = v;
                    _._isValueCreated = true;
                    return v;
                }
            } finally {
                if (clearClosureReference) _._closure = null;
            }
            return _._value;
        }
    }, {
        key: '_onDispose',
        value: function _onDispose() {
            this._closure = null;
            this._value = null;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            return this == other;
        }
    }, {
        key: 'valueEquals',
        value: function valueEquals(other) {
            return this.equals(other) || this.value === other.value;
        }
    }, {
        key: 'isValueCreated',
        get: function get() {
            return this._isValueCreated;
        }
    }, {
        key: 'canReset',
        get: function get() {
            return !this.wasDisposed && !!this._closure;
        }
    }, {
        key: 'value',
        get: function get() {
            return this.getValue();
        }
    }]);

    return Lazy;
}(DisposableBase_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Lazy;
//# sourceMappingURL=Lazy.js.map
