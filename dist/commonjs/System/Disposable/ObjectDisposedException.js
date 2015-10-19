/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ExceptionsInvalidOperationException = require('../Exceptions/InvalidOperationException');

var _ExceptionsInvalidOperationException2 = _interopRequireDefault(_ExceptionsInvalidOperationException);

var NAME = 'ObjectDisposedException';

var ObjectDisposedException = (function (_InvalidOperationException) {
    _inherits(ObjectDisposedException, _InvalidOperationException);

    function ObjectDisposedException(objectName) {
        var message = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var innerException = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, ObjectDisposedException);

        _get(Object.getPrototypeOf(ObjectDisposedException.prototype), 'constructor', this).call(this, message, innerException, function (_) {
            _.objectName = objectName;
        });
    }

    _createClass(ObjectDisposedException, [{
        key: 'getName',
        value: function getName() {
            return NAME;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _ = this,
                oName = _.objectName;
            oName = oName ? '{' + oName + '} ' : '';
            return '[' + _.name + ': ' + oName + _.message + ']';
        }
    }], [{
        key: 'throwIfDisposed',
        value: function throwIfDisposed(disposable, objectName, message) {
            if (disposable.wasDisposed) throw new ObjectDisposedException(objectName, message);
        }
    }]);

    return ObjectDisposedException;
})(_ExceptionsInvalidOperationException2['default']);

exports['default'] = ObjectDisposedException;
module.exports = exports['default'];
//# sourceMappingURL=ObjectDisposedException.js.map
