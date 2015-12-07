/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
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

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _TimeQuantity2 = require('./TimeQuantity');

var _TimeQuantity3 = _interopRequireDefault(_TimeQuantity2);

var TimeUnitValue = (function (_TimeQuantity) {
    _inherits(TimeUnitValue, _TimeQuantity);

    function TimeUnitValue(value, _units) {
        _classCallCheck(this, TimeUnitValue);

        _get(Object.getPrototypeOf(TimeUnitValue.prototype), 'constructor', this).call(this, typeof value == 'number' ? value : getUnitQuantityFrom(value, _units));
        this._units = _units;
        _TimeUnit2['default'].assertValid(_units);
    }

    _createClass(TimeUnitValue, [{
        key: 'getTotalMilliseconds',
        value: function getTotalMilliseconds() {
            return _TimeUnit2['default'].toMilliseconds(this._quantity, this._units);
        }
    }, {
        key: 'to',
        value: function to() {
            var units = arguments.length <= 0 || arguments[0] === undefined ? this.units : arguments[0];

            return TimeUnitValue.from(this, units);
        }
    }, {
        key: 'value',
        get: function get() {
            return this._quantity;
        },
        set: function set(v) {
            this._total = null;
            this._quantity = v;
        }
    }, {
        key: 'units',
        get: function get() {
            return this._units;
        }
    }], [{
        key: 'from',
        value: function from(value) {
            var units = arguments.length <= 1 || arguments[1] === undefined ? _TimeUnit2['default'].Milliseconds : arguments[1];

            return new TimeUnitValue(value, units);
        }
    }]);

    return TimeUnitValue;
})(_TimeQuantity3['default']);

exports['default'] = TimeUnitValue;

function getUnitQuantityFrom(q, units) {
    return _TimeUnit2['default'].fromMilliseconds(q.getTotalMilliseconds(), units);
}
module.exports = exports['default'];
//# sourceMappingURL=TimeUnitValue.js.map
