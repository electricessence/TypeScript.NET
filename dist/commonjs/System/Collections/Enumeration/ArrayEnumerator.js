/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _IndexEnumerator2 = require('./IndexEnumerator');

var _IndexEnumerator3 = _interopRequireDefault(_IndexEnumerator2);

var _Types = require('../../Types');

var _Types2 = _interopRequireDefault(_Types);

var ArrayEnumerator = (function (_IndexEnumerator) {
    _inherits(ArrayEnumerator, _IndexEnumerator);

    function ArrayEnumerator(arrayOrFactory) {
        var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

        _classCallCheck(this, ArrayEnumerator);

        _get(Object.getPrototypeOf(ArrayEnumerator.prototype), 'constructor', this).call(this, function () {
            var array = _Types2['default'].isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
            return { source: array, pointer: start, length: array ? array.length : 0, step: step };
        });
    }

    return ArrayEnumerator;
})(_IndexEnumerator3['default']);

exports['default'] = ArrayEnumerator;
module.exports = exports['default'];
//# sourceMappingURL=ArrayEnumerator.js.map
