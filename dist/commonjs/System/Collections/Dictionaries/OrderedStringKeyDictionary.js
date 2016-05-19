/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArrayUtility = require("../Array/Utility");
var StringKeyDictionary_1 = require("./StringKeyDictionary");
var ArgumentOutOfRangeException_1 = require("../../Exceptions/ArgumentOutOfRangeException");
var VOID0 = void 0;

var OrderedStringKeyDictionary = function (_StringKeyDictionary_) {
    _inherits(OrderedStringKeyDictionary, _StringKeyDictionary_);

    function OrderedStringKeyDictionary() {
        _classCallCheck(this, OrderedStringKeyDictionary);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OrderedStringKeyDictionary).call(this));

        _this._order = [];
        return _this;
    }

    _createClass(OrderedStringKeyDictionary, [{
        key: "indexOfKey",
        value: function indexOfKey(key) {
            var o = this._order;
            return o.length ? o.indexOf(key, 0) : -1;
        }
    }, {
        key: "getValueByIndex",
        value: function getValueByIndex(index) {
            var o = this._order;
            return index < o.length ? this.getValue(o[index]) : VOID0;
        }
    }, {
        key: "setValue",
        value: function setValue(key, value, keepIndex) {
            var _ = this,
                exists = _.indexOfKey(key) != -1;
            if (!exists && (value !== VOID0 || keepIndex)) _._order.push(key);else if (exists && value === VOID0 && !keepIndex) ArrayUtility.remove(_._order, key);
            return _get(Object.getPrototypeOf(OrderedStringKeyDictionary.prototype), "setValue", this).call(this, key, value);
        }
    }, {
        key: "setByIndex",
        value: function setByIndex(index, value) {
            var _ = this,
                order = _._order;
            if (index < 0) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, 'Is less than zero.');
            if (index >= order.length) throw new ArgumentOutOfRangeException_1.ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
            return _.setValue(order[index], value);
        }
    }, {
        key: "importValues",
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
        key: "setValues",
        value: function setValues() {
            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
                values[_key] = arguments[_key];
            }

            return this.importValues(values);
        }
    }, {
        key: "removeByIndex",
        value: function removeByIndex(index) {
            return this.setByIndex(index, VOID0);
        }
    }, {
        key: "getKeys",
        value: function getKeys() {
            var _ = this,
                o = _._order;
            return o.length && o.filter(function (key) {
                return _.containsKey(key);
            }) || [];
        }
    }]);

    return OrderedStringKeyDictionary;
}(StringKeyDictionary_1.StringKeyDictionary);

exports.OrderedStringKeyDictionary = OrderedStringKeyDictionary;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrderedStringKeyDictionary;
//# sourceMappingURL=OrderedStringKeyDictionary.js.map
