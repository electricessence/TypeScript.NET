/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DisposableDisposableBase = require('./Disposable/DisposableBase');

var _DisposableDisposableBase2 = _interopRequireDefault(_DisposableDisposableBase);

var Lazy = (function (_DisposableBase) {
    _inherits(Lazy, _DisposableBase);

    function Lazy(_closure) {
        _classCallCheck(this, Lazy);

        _get(Object.getPrototypeOf(Lazy.prototype), 'constructor', this).call(this);
        this._closure = _closure;
        this._disposableObjectName = 'Lazy';
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
})(_DisposableDisposableBase2['default']);

exports['default'] = Lazy;
module.exports = exports['default'];
//# sourceMappingURL=Lazy.js.map
