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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ArrayUtility = require('../Array/Utility');

var ArrayUtility = _interopRequireWildcard(_ArrayUtility);

var _StringKeyDictionary2 = require('./StringKeyDictionary');

var _StringKeyDictionary3 = _interopRequireDefault(_StringKeyDictionary2);

var _ExceptionsArgumentOutOfRangeException = require('../../Exceptions/ArgumentOutOfRangeException');

var _ExceptionsArgumentOutOfRangeException2 = _interopRequireDefault(_ExceptionsArgumentOutOfRangeException);

var OrderedStringKeyDictionary = (function (_StringKeyDictionary) {
    _inherits(OrderedStringKeyDictionary, _StringKeyDictionary);

    function OrderedStringKeyDictionary() {
        _classCallCheck(this, OrderedStringKeyDictionary);

        _get(Object.getPrototypeOf(OrderedStringKeyDictionary.prototype), 'constructor', this).call(this);
        this._order = [];
    }

    _createClass(OrderedStringKeyDictionary, [{
        key: 'indexOfKey',
        value: function indexOfKey(key) {
            return this._order.indexOf(key, 0);
        }
    }, {
        key: 'getValueByIndex',
        value: function getValueByIndex(index) {
            return this.getValue(this._order[index]);
        }
    }, {
        key: 'setValue',
        value: function setValue(key, value, keepIndex) {
            var _ = this,
                exists = _.indexOfKey(key) != -1;
            if (!exists && (value !== undefined || keepIndex)) _._order.push(key);else if (exists && value === undefined && !keepIndex) ArrayUtility.remove(_._order, key);
            return _get(Object.getPrototypeOf(OrderedStringKeyDictionary.prototype), 'setValue', this).call(this, key, value);
        }
    }, {
        key: 'setByIndex',
        value: function setByIndex(index, value) {
            var _ = this,
                order = _._order;
            if (index < 0) throw new _ExceptionsArgumentOutOfRangeException2['default']('index', index, 'Is less than zero.');
            if (index >= order.length) throw new _ExceptionsArgumentOutOfRangeException2['default']('index', index, 'Is greater than the count.');
            return _.setValue(order[index], value);
        }
    }, {
        key: 'importValues',
        value: function importValues(values) {
            var _ = this;
            return _.handleUpdate(function () {
                var changed = false;
                for (var i = 0; i < values.length; i++) {
                    if (_.setByIndex(i, values[i])) changed = true;
                }
                return changed;
            });
        }
    }, {
        key: 'setValues',
        value: function setValues() {
            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                values[_key] = arguments[_key];
            }

            return this.importValues(values);
        }
    }, {
        key: 'removeByIndex',
        value: function removeByIndex(index) {
            return this.setByIndex(index, undefined);
        }
    }, {
        key: 'keys',
        get: function get() {
            var _ = this;
            return _._order.filter(function (key) {
                return _.containsKey(key);
            });
        }
    }]);

    return OrderedStringKeyDictionary;
})(_StringKeyDictionary3['default']);

exports['default'] = OrderedStringKeyDictionary;
module.exports = exports['default'];
//# sourceMappingURL=OrderedStringKeyDictionary.js.map
