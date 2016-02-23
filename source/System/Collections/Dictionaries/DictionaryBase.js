/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../Compare', '../Enumeration/EnumeratorBase', '../../Exceptions/ArgumentNullException', '../../Exceptions/InvalidOperationException', '../../KeyValueExtract', '../Enumeration/Enumerator'], factory);
    }
})(function (require, exports) {
    'use strict';
    var Compare_1 = require('../../Compare');
    var EnumeratorBase_1 = require('../Enumeration/EnumeratorBase');
    var ArgumentNullException_1 = require('../../Exceptions/ArgumentNullException');
    var InvalidOperationException_1 = require('../../Exceptions/InvalidOperationException');
    var KeyValueExtract_1 = require('../../KeyValueExtract');
    var Enumerator_1 = require('../Enumeration/Enumerator');
    var VOID0 = void (0);
    var DictionaryBase = (function () {
        function DictionaryBase() {
            this._updateRecursion = 0;
        }
        Object.defineProperty(DictionaryBase.prototype, "isUpdating", {
            get: function () { return this._updateRecursion != 0; },
            enumerable: true,
            configurable: true
        });
        DictionaryBase.prototype._onValueUpdate = function (key, value, old) {
            if (!Compare_1.areEqual(value, old, true)) {
                var _ = this;
                if (_.onValueChanged)
                    _.onValueChanged(key, value, old);
                if (_._updateRecursion == 0)
                    _._onUpdated();
            }
        };
        DictionaryBase.prototype._onUpdated = function () {
            var _ = this;
            if (_.onUpdated)
                _.onUpdated();
        };
        DictionaryBase.prototype.handleUpdate = function (closure) {
            var _ = this, result;
            if (closure) {
                _._updateRecursion++;
                try {
                    result = closure();
                }
                finally {
                    _._updateRecursion--;
                }
            }
            else
                result = _._updateRecursion == 0;
            if (result && _._updateRecursion == 0)
                _._onUpdated();
            return result;
        };
        Object.defineProperty(DictionaryBase.prototype, "isReadOnly", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryBase.prototype, "count", {
            get: function () { return this.getCount(); },
            enumerable: true,
            configurable: true
        });
        DictionaryBase.prototype.add = function (item) {
            var _this = this;
            if (!item)
                throw new ArgumentNullException_1.default('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            KeyValueExtract_1.default(item, function (key, value) { return _this.addByKeyValue(key, value); });
        };
        DictionaryBase.prototype.clear = function () {
            var _ = this, keys = _.keys, count = keys.length;
            if (count)
                _.handleUpdate(function () {
                    keys.forEach(function (key) { _.removeByKey(key); });
                    return true;
                });
            if (_.count != 0)
                console.warn("Dictionary clear() results in mismatched count.");
            return count;
        };
        DictionaryBase.prototype.contains = function (item) {
            var _this = this;
            if (!item)
                return false;
            return KeyValueExtract_1.default(item, function (key, value) {
                var v = _this.getValue(key);
                return Compare_1.areEqual(value, v);
            });
        };
        DictionaryBase.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            if (!array)
                throw new ArgumentNullException_1.default('array');
            var e = this.getEnumerator();
            while (e.moveNext()) {
                array[index++] = e.current;
            }
            return array;
        };
        DictionaryBase.prototype.toArray = function () {
            return this.copyTo([], 0);
        };
        DictionaryBase.prototype.remove = function (item) {
            var _this = this;
            if (!item)
                return 0;
            return KeyValueExtract_1.default(item, function (key, value) {
                var v = _this.getValue(key);
                return (Compare_1.areEqual(value, v) && _this.removeByKey(key))
                    ? 1 : 0;
            });
        };
        Object.defineProperty(DictionaryBase.prototype, "keys", {
            get: function () { return this.getKeys(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryBase.prototype, "values", {
            get: function () { return this.getValues(); },
            enumerable: true,
            configurable: true
        });
        DictionaryBase.prototype.addByKeyValue = function (key, value) {
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new InvalidOperationException_1.default("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            _.setValue(key, value);
        };
        DictionaryBase.prototype.containsKey = function (key) {
            var value = this.getValue(key);
            return value !== VOID0;
        };
        DictionaryBase.prototype.containsValue = function (value) {
            var e = this.getEnumerator(), equal = Compare_1.areEqual;
            while (e.moveNext()) {
                if (equal(e.current, value, true)) {
                    e.dispose();
                    return true;
                }
            }
            return false;
        };
        DictionaryBase.prototype.removeByKey = function (key) {
            return this.setValue(key, undefined);
        };
        DictionaryBase.prototype.removeByValue = function (value) {
            var _ = this, count = 0, equal = Compare_1.areEqual;
            _.keys.forEach(function (key) {
                if (equal(_.getValue(key), value, true)) {
                    _.removeByKey(key);
                    ++count;
                }
            });
            return count;
        };
        DictionaryBase.prototype.importPairs = function (pairs) {
            var _ = this;
            if (!pairs)
                return false;
            return _.handleUpdate(function () {
                var changed = false;
                Enumerator_1.forEach(pairs, function (pair) { return KeyValueExtract_1.default(pair, function (key, value) {
                    _.setValue(key, value);
                    changed = true;
                }); });
                return changed;
            });
        };
        DictionaryBase.prototype.getEnumerator = function () {
            var _ = this;
            var keys, len, i = 0;
            return new EnumeratorBase_1.default(function () {
                keys = _.keys;
                len = keys.length;
            }, function (yielder) {
                while (i < len) {
                    var key = keys[i++], value = _.getValue(key);
                    if (value !== VOID0)
                        return yielder.yieldReturn({ key: key, value: value });
                }
                return yielder.yieldBreak();
            });
        };
        return DictionaryBase;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DictionaryBase;
});
//# sourceMappingURL=DictionaryBase.js.map