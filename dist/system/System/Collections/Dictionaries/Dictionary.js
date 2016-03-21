/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Compare', '../../Types', '../../Functions', './DictionaryBase', '../Enumeration/EnumeratorBase', '../LinkedNodeList'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, Types_1, Functions_1, DictionaryBase_1, EnumeratorBase_1, LinkedNodeList_1;
    var VOID0, HashEntry, Dictionary;
    function callHasOwnProperty(target, key) {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
    function computeHashCode(obj) {
        if (obj === null)
            return "null";
        if (obj === VOID0)
            return "undefined";
        return (typeof obj.toString === Types_1.default.FUNCTION)
            ? obj.toString()
            : Object.prototype.toString.call(obj);
    }
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            },
            function (DictionaryBase_1_1) {
                DictionaryBase_1 = DictionaryBase_1_1;
            },
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            },
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            }],
        execute: function() {
            VOID0 = void 0;
            HashEntry = (function () {
                function HashEntry(key, value, previous, next) {
                    this.key = key;
                    this.value = value;
                    this.previous = previous;
                    this.next = next;
                }
                return HashEntry;
            }());
            Dictionary = (function (_super) {
                __extends(Dictionary, _super);
                function Dictionary(_compareSelector) {
                    if (_compareSelector === void 0) { _compareSelector = Functions_1.default.Identity; }
                    _super.call(this);
                    this._compareSelector = _compareSelector;
                    this._count = 0;
                    this._entries = new LinkedNodeList_1.default();
                    this._buckets = {};
                }
                Dictionary.prototype.setKV = function (key, value, allowOverwrite) {
                    var _ = this, buckets = _._buckets, entries = _._entries, comparer = _._compareSelector, compareKey = comparer(key), hash = computeHashCode(compareKey), entry;
                    if (callHasOwnProperty(buckets, hash)) {
                        var equal = Compare_1.areEqual;
                        var array = buckets[hash];
                        for (var i = 0; i < array.length; i++) {
                            var old = array[i];
                            if (comparer(old.key) === compareKey) {
                                if (!allowOverwrite)
                                    throw new Error("Key already exists.");
                                var changed = !equal(old.value, value);
                                if (changed) {
                                    if (value === VOID0) {
                                        entries.removeNode(old);
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
                        if (value === VOID0) {
                            if (allowOverwrite)
                                return false;
                            else
                                throw new Error("Cannot add 'undefined' value.");
                        }
                        buckets[hash] = [entry = new HashEntry(key, value)];
                    }
                    ++_._count;
                    entries.addNode(entry);
                    _._onValueUpdate(key, value, undefined);
                    return true;
                };
                Dictionary.prototype.addByKeyValue = function (key, value) {
                    this.setKV(key, value, false);
                };
                Dictionary.prototype.getValue = function (key) {
                    var buckets = this._buckets, comparer = this._compareSelector;
                    var compareKey = comparer(key);
                    var hash = computeHashCode(compareKey);
                    if (!callHasOwnProperty(buckets, hash))
                        return undefined;
                    var array = buckets[hash];
                    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                        var entry = array_1[_i];
                        if (comparer(entry.key) === compareKey)
                            return entry.value;
                    }
                    return undefined;
                };
                Dictionary.prototype.setValue = function (key, value) {
                    return this.setKV(key, value, true);
                };
                Dictionary.prototype.containsKey = function (key) {
                    var _ = this, buckets = _._buckets, comparer = _._compareSelector;
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
                Dictionary.prototype.getCount = function () {
                    return this._count;
                };
                Dictionary.prototype.getEnumerator = function () {
                    var _ = this, currentEntry;
                    return new EnumeratorBase_1.default(function () { currentEntry = _._entries.first; }, function (yielder) {
                        if (currentEntry != null) {
                            var result = { key: currentEntry.key, value: currentEntry.value };
                            currentEntry = currentEntry.next;
                            return yielder.yieldReturn(result);
                        }
                        return yielder.yieldBreak();
                    });
                };
                Dictionary.prototype.getKeys = function () {
                    var _ = this, result = [];
                    var e = _._entries.first;
                    while (e) {
                        result.push(e.key);
                        e = e.next;
                    }
                    return result;
                };
                Dictionary.prototype.getValues = function () {
                    var _ = this, result = [];
                    var e = _._entries.first;
                    while (e) {
                        result.push(e.value);
                        e = e.next;
                    }
                    return result;
                };
                return Dictionary;
            }(DictionaryBase_1.default));
            exports_1("default", Dictionary);
        }
    }
});
//# sourceMappingURL=Dictionary.js.map