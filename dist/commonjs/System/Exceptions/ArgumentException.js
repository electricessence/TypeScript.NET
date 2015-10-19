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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _SystemException2 = require('./SystemException');

var _SystemException3 = _interopRequireDefault(_SystemException2);

var _TextUtility = require('../Text/Utility');

var NAME = 'ArgumentException';

var ArgumentException = (function (_SystemException) {
    _inherits(ArgumentException, _SystemException);

    function ArgumentException(paramName, message, innerException, beforeSealing) {
        if (message === undefined) message = null;
        if (innerException === undefined) innerException = null;

        _classCallCheck(this, ArgumentException);

        var pn = paramName ? '{' + paramName + '} ' : '';
        _get(Object.getPrototypeOf(ArgumentException.prototype), 'constructor', this).call(this, (0, _TextUtility.trim)(pn + message), innerException, function (_) {
            _.paramName = paramName;
            if (beforeSealing) beforeSealing(_);
        });
    }

    _createClass(ArgumentException, [{
        key: 'getName',
        value: function getName() {
            return NAME;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _ = this;
            return '[' + _.name + ': ' + _.message + ']';
        }
    }]);

    return ArgumentException;
})(_SystemException3['default']);

exports['default'] = ArgumentException;
module.exports = exports['default'];
//# sourceMappingURL=ArgumentException.js.map
