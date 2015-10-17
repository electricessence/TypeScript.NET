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

var _Compare = require('../Compare');

var _TimeUnit = require('./TimeUnit');

var _TimeUnit2 = _interopRequireDefault(_TimeUnit);

var _TimeSpan = require('./TimeSpan');

var _TimeSpan2 = _interopRequireDefault(_TimeSpan);

var TimeUnitValue = (function () {
    function TimeUnitValue(value, _type) {
        _classCallCheck(this, TimeUnitValue);

        this.value = value;
        this._type = _type;
        assertValidUnit(_type);
    }

    _createClass(TimeUnitValue, [{
        key: 'coerce',
        value: function coerce(other) {
            var type = this._type;
            assertValidUnit(type);
            if (other instanceof _TimeSpan2['default']) {
                other = other.toTimeUnitValue(type);
            } else if (other instanceof TimeUnitValue) {
                if (type !== other.type) other = other.to(type);
            } else return null;
            return other;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            var o = this.coerce(other);
            if (o == null) return false;
            return (0, _Compare.areEqual)(this.value, o.value);
        }
    }, {
        key: 'compareTo',
        value: function compareTo(other) {
            if (other == null) return 1 | 0;
            assertComparisonType(other);
            return (0, _Compare.compare)(this.value, this.coerce(other).value);
        }
    }, {
        key: 'toTimeSpan',
        value: function toTimeSpan() {
            return new _TimeSpan2['default'](this.value, this.type);
        }
    }, {
        key: 'to',
        value: function to() {
            var units = arguments.length <= 0 || arguments[0] === undefined ? this.type : arguments[0];

            return this.toTimeSpan().toTimeUnitValue(units);
        }
    }, {
        key: 'type',
        get: function get() {
            return this._type;
        }
    }, {
        key: 'total',
        get: function get() {
            return this.toTimeSpan();
        }
    }]);

    return TimeUnitValue;
})();

exports['default'] = TimeUnitValue;

function assertComparisonType(other) {
    if (!(other instanceof TimeUnitValue || other instanceof _TimeSpan2['default'])) throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.");
}
function assertValidUnit(unit) {
    if (isNaN(unit) || unit > _TimeUnit2['default'].Days || unit < _TimeUnit2['default'].Ticks || Math.floor(unit) !== unit) throw new Error("Invalid TimeUnit.");
    return true;
}
module.exports = exports['default'];
//# sourceMappingURL=TimeUnitValue.js.map
