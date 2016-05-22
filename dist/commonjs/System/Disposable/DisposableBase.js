/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectDisposedException_1 = require("./ObjectDisposedException");

var DisposableBase = function () {
    function DisposableBase(__finalizer) {
        _classCallCheck(this, DisposableBase);

        this.__finalizer = __finalizer;
        this.__wasDisposed = false;
    }

    _createClass(DisposableBase, [{
        key: "throwIfDisposed",
        value: function throwIfDisposed(message) {
            var objectName = arguments.length <= 1 || arguments[1] === undefined ? this._disposableObjectName : arguments[1];

            if (this.__wasDisposed) throw new ObjectDisposedException_1.ObjectDisposedException(objectName, message);
            return true;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            var _ = this;
            if (!_.__wasDisposed) {
                _.__wasDisposed = true;
                try {
                    _._onDispose();
                } finally {
                    if (_.__finalizer) {
                        _.__finalizer();
                        _.__finalizer = void 0;
                    }
                }
            }
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {}
    }, {
        key: "wasDisposed",
        get: function get() {
            return this.__wasDisposed;
        }
    }]);

    return DisposableBase;
}();

exports.DisposableBase = DisposableBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisposableBase;
//# sourceMappingURL=DisposableBase.js.map
