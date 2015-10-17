/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ObjectDisposedException = require('./ObjectDisposedException');

var _ObjectDisposedException2 = _interopRequireDefault(_ObjectDisposedException);

var DisposableBase = (function () {
    function DisposableBase(_finalizer) {
        _classCallCheck(this, DisposableBase);

        this._finalizer = _finalizer;
        this._wasDisposed = false;
    }

    _createClass(DisposableBase, [{
        key: 'throwIfDisposed',
        value: function throwIfDisposed(message) {
            var objectName = arguments.length <= 1 || arguments[1] === undefined ? this._disposableObjectName : arguments[1];

            if (this._wasDisposed) throw new _ObjectDisposedException2['default'](objectName, message);
            return true;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var _ = this;
            if (!_._wasDisposed) {
                _._wasDisposed = true;
                try {
                    _._onDispose();
                } finally {
                    if (_._finalizer) _._finalizer();
                }
            }
        }
    }, {
        key: '_onDispose',
        value: function _onDispose() {}
    }, {
        key: 'wasDisposed',
        get: function get() {
            return this._wasDisposed;
        }
    }]);

    return DisposableBase;
})();

exports['default'] = DisposableBase;
module.exports = exports['default'];
//# sourceMappingURL=DisposableBase.js.map
