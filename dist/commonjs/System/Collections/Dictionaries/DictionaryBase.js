"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Compare_1 = require("../../Compare");
var Enumerator_1 = require("../Enumeration/Enumerator");
var CollectionBase_1 = require("../CollectionBase");
var EnumeratorBase_1 = require("../Enumeration/EnumeratorBase");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var InvalidOperationException_1 = require("../../Exceptions/InvalidOperationException");
var KeyValueExtract_1 = require("../../KeyValueExtract");
var extends_1 = require("../../../extends");
var KeyNotFoundException_1 = require("../KeyNotFoundException");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0;
// Design Note: Should DictionaryAbstractBase be IDisposable?
var DictionaryBase = /** @class */ (function (_super) {
    __extends(DictionaryBase, _super);
    function DictionaryBase(source) {
        return _super.call(this, source) || this;
    }
    //noinspection JSUnusedLocalSymbols
    DictionaryBase.prototype._onValueModified = function (key, value, old) {
    };
    DictionaryBase.prototype._addInternal = function (item) {
        var _this = this;
        if (!item)
            throw new ArgumentNullException_1.ArgumentNullException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
        return KeyValueExtract_1.extractKeyValue(item, function (key, value) { return _this.addByKeyValue(key, value); });
    };
    DictionaryBase.prototype._clearInternal = function () {
        var _ = this;
        var count = 0;
        for (var _i = 0, _a = _.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (_.removeByKey(key))
                count++;
        }
        return count;
    };
    DictionaryBase.prototype.contains = function (item) {
        var _this = this;
        // Should never have a null object in the collection.
        if (!item || !this.getCount())
            return false;
        return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
            // Leave as variable for debugging...
            var v = _this.getValue(key);
            return Compare_1.areEqual(value, v);
        });
    };
    DictionaryBase.prototype._removeInternal = function (item) {
        var _this = this;
        if (!item)
            return 0;
        return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
            // Leave as variable for debugging...
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
        if (value === VOID0)
            throw new InvalidOperationException_1.InvalidOperationException("Cannot add 'undefined' as a value.");
        var _ = this;
        if (_.containsKey(key)) {
            var ex = new InvalidOperationException_1.InvalidOperationException("Adding a key/value when the key already exists.");
            ex.data['key'] = key;
            ex.data['value'] = value;
            throw ex;
        }
        return _.setValue(key, value);
    };
    DictionaryBase.prototype.getAssuredValue = function (key) {
        var value = this.getValue(key);
        if (value === VOID0)
            throw new KeyNotFoundException_1.KeyNotFoundException("Key '" + key + "' not found.");
        return value;
    };
    DictionaryBase.prototype.tryGetValue = function (key, out) {
        var value = this.getValue(key);
        if (value !== VOID0) {
            out(value);
            return true;
        }
        return false;
    };
    /**
     * Sets the value of an entry.
     * It's important to know that 'undefined' cannot exist as a value in the dictionary and is used as a flag for removal.
     * @param key
     * @param value
     * @returns {boolean}
     */
    DictionaryBase.prototype.setValue = function (key, value) {
        // setValue shouldn't need to worry about recursion...
        var _ = this;
        _.assertModifiable();
        var changed = false;
        var old = _.getValue(key); // get the old value here and pass to internal.
        if (!Compare_1.areEqual(value, old) && _._setValueInternal(key, value)) {
            changed = true;
            _._onValueModified(key, value, old);
        }
        _._signalModification(changed);
        return changed;
    };
    DictionaryBase.prototype.containsKey = function (key) {
        return !!this._getEntry(key);
    };
    DictionaryBase.prototype.containsValue = function (value) {
        var e = this.getEnumerator();
        while (e.moveNext()) {
            if (Compare_1.areEqual(e.current, value, true)) {
                e.dispose();
                return true;
            }
        }
        return false;
    };
    DictionaryBase.prototype.removeByKey = function (key) {
        return this.setValue(key, VOID0);
    };
    DictionaryBase.prototype.removeByValue = function (value) {
        var _ = this;
        var count = 0;
        for (var _i = 0, _a = _.getKeys(); _i < _a.length; _i++) {
            var key = _a[_i];
            if (Compare_1.areEqual(_.getValue(key), value, true)) {
                _.removeByKey(key);
                count++;
            }
        }
        return count;
    };
    DictionaryBase.prototype.importEntries = function (pairs) {
        // Allow piping through to trigger onModified properly.
        return _super.prototype.importEntries.call(this, pairs);
    };
    DictionaryBase.prototype._importEntries = function (pairs) {
        var _ = this;
        if (!pairs)
            return 0;
        var changed = 0;
        Enumerator_1.forEach(pairs, function (pair) { return KeyValueExtract_1.extractKeyValue(pair, function (key, value) {
            if (_._setValueInternal(key, value))
                changed++;
        }); });
        return changed;
    };
    DictionaryBase.prototype.getEnumerator = function () {
        var _ = this;
        _.throwIfDisposed();
        var ver, keys, len, index = 0;
        return new EnumeratorBase_1.EnumeratorBase(function () {
            _.throwIfDisposed();
            ver = _._version; // Track the version since getKeys is a copy.
            keys = _.getKeys();
            len = keys.length;
        }, function (yielder) {
            _.throwIfDisposed();
            _.assertVersion(ver);
            while (index < len) {
                var key = keys[index++], value = _.getValue(key);
                if (value !== VOID0) // Still valid?
                    return yielder.yieldReturn({ key: key, value: value });
            }
            return yielder.yieldBreak();
        });
    };
    return DictionaryBase;
}(CollectionBase_1.CollectionBase));
exports.DictionaryBase = DictionaryBase;
exports.default = DictionaryBase;
//# sourceMappingURL=DictionaryBase.js.map