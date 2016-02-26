/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compare_1 = require('../../Compare');
var EnumeratorBase_1 = require('../Enumeration/EnumeratorBase');
var ArgumentNullException_1 = require('../../Exceptions/ArgumentNullException');
var InvalidOperationException_1 = require('../../Exceptions/InvalidOperationException');
var KeyValueExtract_1 = require('../../KeyValueExtract');
var Enumerator_1 = require('../Enumeration/Enumerator');
var VOID0 = void 0;

var DictionaryBase = function () {
    function DictionaryBase() {
        _classCallCheck(this, DictionaryBase);

        this._updateRecursion = 0;
    }

    _createClass(DictionaryBase, [{
        key: '_onValueUpdate',
        value: function _onValueUpdate(key, value, old) {
            if (!Compare_1.areEqual(value, old, true)) {
                var _ = this;
                if (_.onValueChanged) _.onValueChanged(key, value, old);
                if (_._updateRecursion == 0) _._onUpdated();
            }
        }
    }, {
        key: '_onUpdated',
        value: function _onUpdated() {
            var _ = this;
            if (_.onUpdated) _.onUpdated();
        }
    }, {
        key: 'handleUpdate',
        value: function handleUpdate(closure) {
            var _ = this,
                result;
            if (closure) {
                _._updateRecursion++;
                try {
                    result = closure();
                } finally {
                    _._updateRecursion--;
                }
            } else result = _._updateRecursion == 0;
            if (result && _._updateRecursion == 0) _._onUpdated();
            return result;
        }
    }, {
        key: 'add',
        value: function add(item) {
            var _this = this;

            if (!item) throw new ArgumentNullException_1.default('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            KeyValueExtract_1.default(item, function (key, value) {
                return _this.addByKeyValue(key, value);
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            var _ = this,
                keys = _.keys,
                count = keys.length;
            if (count) _.handleUpdate(function () {
                keys.forEach(function (key) {
                    _.removeByKey(key);
                });
                return true;
            });
            if (_.count != 0) console.warn("Dictionary clear() results in mismatched count.");
            return count;
        }
    }, {
        key: 'contains',
        value: function contains(item) {
            var _this2 = this;

            if (!item) return false;
            return KeyValueExtract_1.default(item, function (key, value) {
                var v = _this2.getValue(key);
                return Compare_1.areEqual(value, v);
            });
        }
    }, {
        key: 'copyTo',
        value: function copyTo(array) {
            var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (!array) throw new ArgumentNullException_1.default('array');
            var e = this.getEnumerator();
            while (e.moveNext()) {
                array[index++] = e.current;
            }
            return array;
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            return this.copyTo([], 0);
        }
    }, {
        key: 'remove',
        value: function remove(item) {
            var _this3 = this;

            if (!item) return 0;
            return KeyValueExtract_1.default(item, function (key, value) {
                var v = _this3.getValue(key);
                return Compare_1.areEqual(value, v) && _this3.removeByKey(key) ? 1 : 0;
            });
        }
    }, {
        key: 'addByKeyValue',
        value: function addByKeyValue(key, value) {
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new InvalidOperationException_1.default("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            _.setValue(key, value);
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            var value = this.getValue(key);
            return value !== VOID0;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            var e = this.getEnumerator(),
                equal = Compare_1.areEqual;
            while (e.moveNext()) {
                if (equal(e.current, value, true)) {
                    e.dispose();
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'removeByKey',
        value: function removeByKey(key) {
            return this.setValue(key, undefined);
        }
    }, {
        key: 'removeByValue',
        value: function removeByValue(value) {
            var _ = this,
                count = 0,
                equal = Compare_1.areEqual;
            _.keys.forEach(function (key) {
                if (equal(_.getValue(key), value, true)) {
                    _.removeByKey(key);
                    ++count;
                }
            });
            return count;
        }
    }, {
        key: 'importPairs',
        value: function importPairs(pairs) {
            var _ = this;
            if (!pairs) return false;
            return _.handleUpdate(function () {
                var changed = false;
                Enumerator_1.forEach(pairs, function (pair) {
                    return KeyValueExtract_1.default(pair, function (key, value) {
                        _.setValue(key, value);
                        changed = true;
                    });
                });
                return changed;
            });
        }
    }, {
        key: 'getEnumerator',
        value: function getEnumerator() {
            var _ = this;
            var keys,
                len,
                i = 0;
            return new EnumeratorBase_1.default(function () {
                keys = _.keys;
                len = keys.length;
            }, function (yielder) {
                while (i < len) {
                    var key = keys[i++],
                        value = _.getValue(key);
                    if (value !== VOID0) return yielder.yieldReturn({ key: key, value: value });
                }
                return yielder.yieldBreak();
            });
        }
    }, {
        key: 'isUpdating',
        get: function get() {
            return this._updateRecursion != 0;
        }
    }, {
        key: 'isReadOnly',
        get: function get() {
            return false;
        }
    }, {
        key: 'count',
        get: function get() {
            return this.getCount();
        }
    }, {
        key: 'keys',
        get: function get() {
            return this.getKeys();
        }
    }, {
        key: 'values',
        get: function get() {
            return this.getValues();
        }
    }]);

    return DictionaryBase;
}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DictionaryBase;
//# sourceMappingURL=DictionaryBase.js.map
