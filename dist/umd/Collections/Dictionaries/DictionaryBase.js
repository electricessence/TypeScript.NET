/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../Enumeration/Enumerator", "../CollectionBase", "../Enumeration/EnumeratorBase", "../../Exceptions/ArgumentNullException", "../../Exceptions/InvalidOperationException", "../../KeyValueExtract", "../KeyNotFoundException", "../../Comparison/areEqual"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Enumerator_1 = require("../Enumeration/Enumerator");
    var CollectionBase_1 = require("../CollectionBase");
    var EnumeratorBase_1 = require("../Enumeration/EnumeratorBase");
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var InvalidOperationException_1 = require("../../Exceptions/InvalidOperationException");
    var KeyValueExtract_1 = require("../../KeyValueExtract");
    var KeyNotFoundException_1 = require("../KeyNotFoundException");
    var areEqual_1 = require("../../Comparison/areEqual");
    var VOID0 = void 0;
    // Design Note: Should DictionaryAbstractBase be IDisposable?
    var DictionaryBase = /** @class */ (function (_super) {
        tslib_1.__extends(DictionaryBase, _super);
        function DictionaryBase(source) {
            return _super.call(this, source) || this;
        }
        //noinspection JSUnusedLocalSymbols
        DictionaryBase.prototype._onValueModified = function (key, value, old) {
        };
        DictionaryBase.prototype._addInternal = function (item) {
            var _this = this;
            if (!item)
                throw new ArgumentNullException_1.default('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            return KeyValueExtract_1.default(item, function (key, value) { return _this.addByKeyValue(key, value); });
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
            return KeyValueExtract_1.default(item, function (key, value) {
                // Leave as variable for debugging...
                var v = _this.getValue(key);
                return areEqual_1.default(value, v);
            });
        };
        DictionaryBase.prototype._removeInternal = function (item) {
            var _this = this;
            if (!item)
                return 0;
            return KeyValueExtract_1.default(item, function (key, value) {
                // Leave as variable for debugging...
                var v = _this.getValue(key);
                return (areEqual_1.default(value, v) && _this.removeByKey(key))
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
                throw new InvalidOperationException_1.default("Cannot add 'undefined' as a value.");
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new InvalidOperationException_1.default("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            return _.setValue(key, value);
        };
        DictionaryBase.prototype.getAssuredValue = function (key) {
            var value = this.getValue(key);
            if (value === VOID0)
                throw new KeyNotFoundException_1.default("Key '" + key + "' not found.");
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
            if (!areEqual_1.default(value, old) && _._setValueInternal(key, value)) {
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
                if (areEqual_1.default(e.current, value, true)) {
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
                if (areEqual_1.default(_.getValue(key), value, true)) {
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
            Enumerator_1.forEach(pairs, function (pair) { return KeyValueExtract_1.default(pair, function (key, value) {
                if (_._setValueInternal(key, value))
                    changed++;
            }); });
            return changed;
        };
        DictionaryBase.prototype.getEnumerator = function () {
            var _ = this;
            _.throwIfDisposed();
            var ver, keys, len, index = 0;
            return new EnumeratorBase_1.default(function () {
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
    }(CollectionBase_1.default));
    exports.default = DictionaryBase;
});
//# sourceMappingURL=DictionaryBase.js.map