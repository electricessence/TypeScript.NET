/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports", '../../System', '../Enumeration/EnumeratorBase'], function (require, exports, System, EnumeratorBase) {
    'use strict';
    // Design Note: Should DictionaryAbstractBase be IDisposable?
    var DictionaryAbstractBase = (function () {
        function DictionaryAbstractBase() {
            // This allows for batch updates in order to improve the efficiency of responsive systems.
            this._updateRecursion = 0;
        }
        Object.defineProperty(DictionaryAbstractBase.prototype, "isUpdating", {
            get: function () { return this._updateRecursion != 0; },
            enumerable: true,
            configurable: true
        });
        // Pseudo-protected.
        DictionaryAbstractBase.prototype._onValueUpdate = function (key, value, old) {
            if (!System.areEqual(value, old, true)) {
                var _ = this;
                if (_.onValueChanged)
                    _.onValueChanged(key, value, old);
                // If the update recursion is zero, then we are finished with updates.
                if (_._updateRecursion == 0)
                    _._onUpdated();
            }
        };
        DictionaryAbstractBase.prototype._onUpdated = function () {
            var _ = this;
            if (_.onUpdated)
                _.onUpdated();
        };
        // Takes a closure that if returning true will propagate an update signal.
        DictionaryAbstractBase.prototype.handleUpdate = function (closure) {
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
        Object.defineProperty(DictionaryAbstractBase.prototype, "isReadOnly", {
            /////////////////////////////////////////
            // ICollection<T>
            /////////////////////////////////////////
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryAbstractBase.prototype, "count", {
            get: function () { return notImplementedException("count"); },
            enumerable: true,
            configurable: true
        });
        DictionaryAbstractBase.prototype.add = function (item) {
            this.addByKeyValue(item.key, item.value);
        };
        DictionaryAbstractBase.prototype.clear = function () {
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
        DictionaryAbstractBase.prototype.contains = function (item) {
            var value = this.get(item.key);
            return System.areEqual(value, item.value);
        };
        DictionaryAbstractBase.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            var e = this.getEnumerator();
            while (e.moveNext()) {
                array[index++] = e.current;
            }
        };
        DictionaryAbstractBase.prototype.remove = function (item) {
            var key = item.key, value = this.get(key);
            return (System.areEqual(value, item.value) && this.removeByKey(key))
                ? 1 : 0;
        };
        Object.defineProperty(DictionaryAbstractBase.prototype, "keys", {
            /////////////////////////////////////////
            // IDictionary<TKey,TValue>
            /////////////////////////////////////////
            get: function () { return notImplementedException("keys"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryAbstractBase.prototype, "values", {
            get: function () { return notImplementedException("values"); },
            enumerable: true,
            configurable: true
        });
        DictionaryAbstractBase.prototype.addByKeyValue = function (key, value) {
            var _ = this;
            if (_.containsKey(key))
                throw new Error("Adding key/value when one already exists.");
            _.set(key, value);
        };
        DictionaryAbstractBase.prototype.get = function (key) { return notImplementedException("get(key: TKey): TValue", "When calling for key: " + key); };
        DictionaryAbstractBase.prototype.set = function (key, value) {
            return notImplementedException("set(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + ".");
        };
        DictionaryAbstractBase.prototype.containsKey = function (key) {
            var value = this.get(key);
            return value !== undefined;
        };
        DictionaryAbstractBase.prototype.containsValue = function (value) {
            var e = this.getEnumerator(), equal = System.areEqual;
            while (e.moveNext()) {
                if (equal(e.current, value, true)) {
                    e.dispose();
                    return true;
                }
            }
            return false;
        };
        DictionaryAbstractBase.prototype.removeByKey = function (key) {
            return this.set(key, undefined);
        };
        DictionaryAbstractBase.prototype.removeByValue = function (value) {
            var _ = this, count = 0, equal = System.areEqual;
            _.keys.forEach(function (key) {
                if (equal(_.get(key), value, true)) {
                    _.removeByKey(key);
                    ++count;
                }
            });
            return count;
        };
        DictionaryAbstractBase.prototype.importPairs = function (pairs) {
            var _ = this;
            return _.handleUpdate(function () {
                var changed = false;
                pairs.forEach(function (pair) {
                    _.set(pair.key, pair.value);
                    changed = true;
                });
                return changed;
            });
        };
        DictionaryAbstractBase.prototype.getEnumerator = function () {
            var _ = this;
            var keys, len, i = 0;
            return new EnumeratorBase(function () {
                keys = _.keys;
                len = keys.length;
            }, function (yielder) {
                while (i < len) {
                    var key = keys[i++], value = _.get(key);
                    if (value !== undefined)
                        return yielder.yieldReturn({ key: key, value: value });
                }
                return yielder.yieldBreak();
            });
        };
        return DictionaryAbstractBase;
    })();
    function notImplementedException(name, log) {
        if (log === void 0) { log = ""; }
        console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
        throw new Error("DictionaryAbstractBase." + name + ": Not implemented.");
    }
    return DictionaryAbstractBase;
});
//# sourceMappingURL=DictionaryAbstractBase.js.map