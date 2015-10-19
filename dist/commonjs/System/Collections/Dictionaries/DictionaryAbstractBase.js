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

var _Compare = require('../../Compare');

var _EnumerationEnumeratorBase = require('../Enumeration/EnumeratorBase');

var _EnumerationEnumeratorBase2 = _interopRequireDefault(_EnumerationEnumeratorBase);

var _ExceptionsNotImplementedException = require('../../Exceptions/NotImplementedException');

var _ExceptionsNotImplementedException2 = _interopRequireDefault(_ExceptionsNotImplementedException);

var _ExceptionsArgumentException = require('../../Exceptions/ArgumentException');

var _ExceptionsArgumentException2 = _interopRequireDefault(_ExceptionsArgumentException);

var _ExceptionsArgumentNullException = require('../../Exceptions/ArgumentNullException');

var _ExceptionsArgumentNullException2 = _interopRequireDefault(_ExceptionsArgumentNullException);

var _ExceptionsInvalidOperationException = require('../../Exceptions/InvalidOperationException');

var _ExceptionsInvalidOperationException2 = _interopRequireDefault(_ExceptionsInvalidOperationException);

var DictionaryAbstractBase = (function () {
    function DictionaryAbstractBase() {
        _classCallCheck(this, DictionaryAbstractBase);

        this._updateRecursion = 0;
    }

    _createClass(DictionaryAbstractBase, [{
        key: '_onValueUpdate',
        value: function _onValueUpdate(key, value, old) {
            if (!(0, _Compare.areEqual)(value, old, true)) {
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
            if (!item) throw new _ExceptionsArgumentException2['default']('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            this.addByKeyValue(item.key, item.value);
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
            if (!item) return false;
            var value = this.getValue(item.key);
            return (0, _Compare.areEqual)(value, item.value);
        }
    }, {
        key: 'copyTo',
        value: function copyTo(array) {
            var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (!array) throw new _ExceptionsArgumentNullException2['default']('array');
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
            if (!item) return 0;
            var key = item.key,
                value = this.getValue(key);
            return (0, _Compare.areEqual)(value, item.value) && this.removeByKey(key) ? 1 : 0;
        }
    }, {
        key: 'addByKeyValue',
        value: function addByKeyValue(key, value) {
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new _ExceptionsInvalidOperationException2['default']("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            _.setValue(key, value);
        }
    }, {
        key: 'getValue',
        value: function getValue(key) {
            throw notImplemented("getValue(key: TKey): TValue", "When calling for key: " + key);
        }
    }, {
        key: 'setValue',
        value: function setValue(key, value) {
            throw notImplemented("setValue(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + ".");
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            var value = this.getValue(key);
            return value !== undefined;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            var e = this.getEnumerator(),
                equal = _Compare.areEqual;
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
                equal = _Compare.areEqual;
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
            return _.handleUpdate(function () {
                var changed = false;
                pairs.forEach(function (pair) {
                    _.setValue(pair.key, pair.value);
                    changed = true;
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
            return new _EnumerationEnumeratorBase2['default'](function () {
                keys = _.keys;
                len = keys.length;
            }, function (yielder) {
                while (i < len) {
                    var key = keys[i++],
                        value = _.getValue(key);
                    if (value !== undefined) return yielder.yieldReturn({ key: key, value: value });
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
            throw notImplemented("count");
        }
    }, {
        key: 'keys',
        get: function get() {
            throw notImplemented("keys");
        }
    }, {
        key: 'values',
        get: function get() {
            throw notImplemented("values");
        }
    }]);

    return DictionaryAbstractBase;
})();

exports['default'] = DictionaryAbstractBase;

function notImplemented(name) {
    var log = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

    console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
    return new _ExceptionsNotImplementedException2['default']("DictionaryAbstractBase." + name + ": Not implemented.");
}
module.exports = exports['default'];
//# sourceMappingURL=DictionaryAbstractBase.js.map
