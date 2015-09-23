/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../Compare', '../../Types', '../../Functions', './DictionaryAbstractBase', '../Enumeration/EnumeratorBase'], function (require, exports, Values, Types, Functions, DictionaryAbstractBase, EnumeratorBase) {
    var HashEntry = (function () {
        function HashEntry(key, value, prev, next) {
            this.key = key;
            this.value = value;
            this.prev = prev;
            this.next = next;
        }
        return HashEntry;
    })();
    var EntryList = (function () {
        function EntryList(first, last) {
            this.first = first;
            this.last = last;
        }
        EntryList.prototype.addLast = function (entry) {
            var _ = this;
            if (_.last != null) {
                _.last.next = entry;
                entry.prev = _.last;
                _.last = entry;
            }
            else
                _.first = _.last = entry;
        };
        EntryList.prototype.replace = function (entry, newEntry) {
            var _ = this;
            if (entry.prev != null) {
                entry.prev.next = newEntry;
                newEntry.prev = entry.prev;
            }
            else
                _.first = newEntry;
            if (entry.next != null) {
                entry.next.prev = newEntry;
                newEntry.next = entry.next;
            }
            else
                _.last = newEntry;
        };
        EntryList.prototype.remove = function (entry) {
            var _ = this;
            if (entry.prev != null)
                entry.prev.next = entry.next;
            else
                _.first = entry.next;
            if (entry.next != null)
                entry.next.prev = entry.prev;
            else
                _.last = entry.prev;
        };
        EntryList.prototype.clear = function () {
            var _ = this;
            while (_.last) {
                _.remove(_.last);
            }
        };
        EntryList.prototype.forEach = function (closure) {
            var _ = this, currentEntry = _.first;
            while (currentEntry) {
                closure(currentEntry);
                currentEntry = currentEntry.next;
            }
        };
        return EntryList;
    })();
    function callHasOwnProperty(target, key) {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
    function computeHashCode(obj) {
        if (obj === null)
            return "null";
        if (obj === undefined)
            return "undefined";
        return (typeof obj.toString === Types.Function)
            ? obj.toString()
            : Object.prototype.toString.call(obj);
    }
    var Dictionary = (function (_super) {
        __extends(Dictionary, _super);
        function Dictionary(compareSelector) {
            if (compareSelector === void 0) { compareSelector = Functions.Identity; }
            _super.call(this);
            this.compareSelector = compareSelector;
            this._count = 0;
            this._entries = new EntryList();
            this._buckets = {};
        }
        Dictionary.prototype.setKV = function (key, value, allowOverwrite) {
            var _ = this, buckets = _._buckets, entries = _._entries, comparer = _.compareSelector;
            var compareKey = comparer(key);
            var hash = computeHashCode(compareKey), entry;
            if (callHasOwnProperty(buckets, hash)) {
                var equal = Values.areEqual;
                var array = buckets[hash];
                for (var i = 0; i < array.length; i++) {
                    var old = array[i];
                    if (comparer(old.key) === compareKey) {
                        if (!allowOverwrite)
                            throw new Error("Key already exists.");
                        var changed = !equal(old.value, value);
                        if (changed) {
                            if (value === undefined) {
                                entries.remove(old);
                                array.splice(i, 1);
                                if (!array.length)
                                    delete buckets[hash];
                                --_._count;
                            }
                            else {
                                entry = new HashEntry(key, value);
                                entries.replace(old, entry);
                                array[i] = entry;
                            }
                            _._onValueUpdate(key, value, old.value);
                        }
                        return changed;
                    }
                }
                array.push(entry = entry || new HashEntry(key, value));
            }
            else {
                if (value === undefined) {
                    if (allowOverwrite)
                        return false;
                    else
                        throw new Error("Cannot add 'undefined' value.");
                }
                buckets[hash] = [entry = new HashEntry(key, value)];
            }
            ++_._count;
            entries.addLast(entry);
            _._onValueUpdate(key, value, undefined);
            return true;
        };
        Dictionary.prototype.addByKeyValue = function (key, value) {
            this.setKV(key, value, false);
        };
        Dictionary.prototype.get = function (key) {
            var buckets = this._buckets, comparer = this.compareSelector;
            var compareKey = comparer(key);
            var hash = computeHashCode(compareKey);
            if (!callHasOwnProperty(buckets, hash))
                return undefined;
            var array = buckets[hash];
            for (var i = 0, len = array.length; i < len; i++) {
                var entry = array[i];
                if (comparer(entry.key) === compareKey)
                    return entry.value;
            }
            return undefined;
        };
        Dictionary.prototype.set = function (key, value) {
            return this.setKV(key, value, true);
        };
        Dictionary.prototype.containsKey = function (key) {
            var _ = this, buckets = _._buckets, comparer = _.compareSelector;
            var compareKey = comparer(key);
            var hash = computeHashCode(compareKey);
            if (!callHasOwnProperty(buckets, hash))
                return false;
            var array = buckets[hash];
            for (var i = 0, len = array.length; i < len; i++) {
                if (comparer(array[i].key) === compareKey)
                    return true;
            }
            return false;
        };
        Dictionary.prototype.clear = function () {
            var _ = this, buckets = _._buckets, count = _super.prototype.clear.call(this);
            _._count = 0;
            for (var key in buckets) {
                if (buckets.hasOwnProperty(key))
                    delete buckets[key];
            }
            _._entries.clear();
            return count;
        };
        Object.defineProperty(Dictionary.prototype, "count", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Dictionary.prototype.getEnumerator = function () {
            var _ = this, currentEntry;
            return new EnumeratorBase(function () { currentEntry = _._entries.first; }, function (yielder) {
                if (currentEntry != null) {
                    var result = { key: currentEntry.key, value: currentEntry.value };
                    currentEntry = currentEntry.next;
                    return yielder.yieldReturn(result);
                }
                return yielder.yieldBreak();
            });
        };
        Object.defineProperty(Dictionary.prototype, "keys", {
            get: function () {
                var _ = this, result = [];
                _._entries.forEach(function (entry) { return result.push(entry.key); });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "values", {
            get: function () {
                var _ = this, result = [];
                _._entries.forEach(function (entry) { return result.push(entry.value); });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        return Dictionary;
    })(DictionaryAbstractBase);
    return Dictionary;
});
//# sourceMappingURL=Dictionary.js.map