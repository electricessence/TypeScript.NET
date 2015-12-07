///<reference path="IDictionary.d.ts"/>
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Compare = require('../../Compare');

var _DictionaryBase2 = require('./DictionaryBase');

var _DictionaryBase3 = _interopRequireDefault(_DictionaryBase2);

var VOID0 = void 0;

var StringKeyDictionary = (function (_DictionaryBase) {
    _inherits(StringKeyDictionary, _DictionaryBase);

    function StringKeyDictionary() {
        _classCallCheck(this, StringKeyDictionary);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(StringKeyDictionary.prototype), 'constructor', this).apply(this, args);
        this._count = 0;
        this._map = {};
    }

    _createClass(StringKeyDictionary, [{
        key: 'containsKey',
        value: function containsKey(key) {
            return key in this._map;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            var map = this._map,
                equal = _Compare.areEqual;
            for (var key in map) {
                if (map.hasOwnProperty(key) && equal(map[key], value)) return true;
            }
            return false;
        }
    }, {
        key: 'getValue',
        value: function getValue(key) {
            return this._map[key];
        }
    }, {
        key: 'setValue',
        value: function setValue(key, value) {
            var _ = this,
                map = _._map,
                old = map[key];
            if (old !== value) {
                if (value === VOID0) {
                    if (key in map) {
                        delete map[key];
                        --_._count;
                    }
                } else {
                    if (!(key in map)) ++_._count;
                    map[key] = value;
                }
                _._onValueUpdate(key, value, old);
                return true;
            }
            return false;
        }
    }, {
        key: 'importMap',
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
        key: 'toMap',
        value: function toMap(selector) {
            var _ = this,
                result = {};
            for (var key in _._map) {
                if (_._map.hasOwnProperty(key)) {
                    var value = _._map[key];
                    if (selector) value = selector(key, value);
                    if (value !== VOID0) result[key] = value;
                }
            }
            return result;
        }
    }, {
        key: 'getKeys',
        value: function getKeys() {
            var _ = this,
                result = [];
            for (var key in _._map) {
                if (_._map.hasOwnProperty(key)) result.push(key);
            }
            return result;
        }
    }, {
        key: 'getValues',
        value: function getValues() {
            var _ = this,
                result = [];
            for (var key in _._map) {
                if (_._map.hasOwnProperty(key)) result.push(_._map[key]);
            }
            return result;
        }
    }, {
        key: 'getCount',
        value: function getCount() {
            return this._count;
        }
    }]);

    return StringKeyDictionary;
})(_DictionaryBase3['default']);

exports['default'] = StringKeyDictionary;
module.exports = exports['default'];
//# sourceMappingURL=StringKeyDictionary.js.map
