/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Compare_1 = require("../../Compare");
var DictionaryBase_1 = require("./DictionaryBase");
var VOID0 = void 0;

var StringKeyDictionary = function (_DictionaryBase_1$Dic) {
    _inherits(StringKeyDictionary, _DictionaryBase_1$Dic);

    function StringKeyDictionary() {
        var _Object$getPrototypeO;

        _classCallCheck(this, StringKeyDictionary);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(StringKeyDictionary)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this._count = 0;
        _this._map = {};
        return _this;
    }

    _createClass(StringKeyDictionary, [{
        key: "_getEntry",
        value: function _getEntry(key) {
            return !this.containsKey(key) ? null : {
                key: key,
                value: this.getValue(key)
            };
        }
    }, {
        key: "containsKey",
        value: function containsKey(key) {
            if (key === null || key === VOID0 || !this._count) return false;
            return key in this._map;
        }
    }, {
        key: "containsValue",
        value: function containsValue(value) {
            if (!this._count) return false;
            var map = this._map,
                equal = Compare_1.areEqual;
            for (var key in map) {
                if (map.hasOwnProperty(key) && equal(map[key], value)) return true;
            }
            return false;
        }
    }, {
        key: "getValue",
        value: function getValue(key) {
            if (key === null || key === VOID0 || !this._count) return VOID0;
            return this._map[key];
        }
    }, {
        key: "_setValueInternal",
        value: function _setValueInternal(key, value) {
            var _ = this,
                map = _._map,
                old = map[key];
            if (old !== value) {
                if (value === VOID0) {
                    if (key in map) {
                        delete map[key];
                        _._count--;
                    }
                } else {
                    if (!map.hasOwnProperty(key)) _._count++;
                    map[key] = value;
                }
                return true;
            }
            return false;
        }
    }, {
        key: "importMap",
        value: function importMap(values) {
            var _ = this;
            return _.handleUpdate(function () {
                var changed = false;
                for (var key in values) {
                    if (values.hasOwnProperty(key) && _.setValue(key, values[key])) changed = true;
                }
                return changed;
            });
        }
    }, {
        key: "toMap",
        value: function toMap(selector) {
            var _ = this,
                result = {};
            if (_._count) for (var key in _._map) {
                if (_._map.hasOwnProperty(key)) {
                    var value = _._map[key];
                    if (selector) value = selector(key, value);
                    if (value !== VOID0) result[key] = value;
                }
            }
            return result;
        }
    }, {
        key: "getKeys",
        value: function getKeys() {
            return Object.keys(this._map);
        }
    }, {
        key: "getValues",
        value: function getValues() {
            if (!this._count) return [];
            var result = Object.keys(this._map);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = this._map[result[i]];
            }
            return result;
        }
    }, {
        key: "getCount",
        value: function getCount() {
            return this._count;
        }
    }]);

    return StringKeyDictionary;
}(DictionaryBase_1.DictionaryBase);

exports.StringKeyDictionary = StringKeyDictionary;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StringKeyDictionary;
//# sourceMappingURL=StringKeyDictionary.js.map
