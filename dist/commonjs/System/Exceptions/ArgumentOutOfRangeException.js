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

var _ArgumentException2 = require('./ArgumentException');

var _ArgumentException3 = _interopRequireDefault(_ArgumentException2);

var NAME = 'ArgumentOutOfRangeException';

var ArgumentOutOfRangeException = (function (_ArgumentException) {
    _inherits(ArgumentOutOfRangeException, _ArgumentException);

    function ArgumentOutOfRangeException(paramName, actualValue) {
        var message = arguments.length <= 2 || arguments[2] === undefined ? ' ' : arguments[2];
        var innerException = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        _classCallCheck(this, ArgumentOutOfRangeException);

        _get(Object.getPrototypeOf(ArgumentOutOfRangeException.prototype), 'constructor', this).call(this, paramName, message, innerException, function (_) {
            _.actualValue = actualValue;
        });
    }

    _createClass(ArgumentOutOfRangeException, [{
        key: 'getName',
        value: function getName() {
            return NAME;
        }
    }]);

    return ArgumentOutOfRangeException;
})(_ArgumentException3['default']);

exports['default'] = ArgumentOutOfRangeException;
module.exports = exports['default'];
//# sourceMappingURL=ArgumentOutOfRangeException.js.map
