/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Compare", "../../Types", "../../Functions", "../Enumeration/EnumeratorBase", "../LinkedNodeList", "../../Disposable/ObjectPool", "./DictionaryBase", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, Types_1, Functions_1, EnumeratorBase_1, LinkedNodeList_1, ObjectPool_1, DictionaryBase_1, extends_1;
    var __extends, VOID0, HashEntry, linkedListPool, NULL, GET_HASH_CODE, Dictionary;
    function linkedNodeList(recycle) {
        if (!linkedListPool)
            linkedListPool
                = new ObjectPool_1.ObjectPool(20, function () { return new LinkedNodeList_1.LinkedNodeList(); }, function (r) { return r.clear(); });
        if (!recycle)
            return linkedListPool.take();
        linkedListPool.add(recycle);
    }
    function callHasOwnProperty(target, key) {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
    function getHashString(obj) {
        if (obj === null)
            return NULL;
        if (obj === VOID0)
            return Types_1.Type.UNDEFINED;
        if (Types_1.Type.hasMemberOfType(obj, GET_HASH_CODE, Types_1.Type.FUNCTION)) {
            return obj.getHashCode();
        }
        return (typeof obj.toString == Types_1.Type.FUNCTION)
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
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            },
            function (LinkedNodeList_1_1) {
                LinkedNodeList_1 = LinkedNodeList_1_1;
            },
            function (ObjectPool_1_1) {
                ObjectPool_1 = ObjectPool_1_1;
            },
            function (DictionaryBase_1_1) {
                DictionaryBase_1 = DictionaryBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
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
            NULL = "null", GET_HASH_CODE = "getHashCode";
            Dictionary = (function (_super) {
                __extends(Dictionary, _super);
                function Dictionary(_keyComparer) {
                    if (_keyComparer === void 0) { _keyComparer = Functions_1.Functions.Identity; }
                    _super.call(this);
                    this._keyComparer = _keyComparer;
                    this._entries = linkedNodeList();
                    this._buckets = {};
                }
                Dictionary.prototype.getCount = function () {
                    return this._entries.unsafeCount;
                };
                Dictionary.prototype._getBucket = function (hash, createIfMissing) {
                    if (hash === null || hash === VOID0 || !createIfMissing && !this.getCount())
                        return null;
                    var buckets = this._buckets;
                    var bucket = callHasOwnProperty(buckets, hash) ? buckets[hash] : VOID0;
                    if (createIfMissing && !bucket)
                        buckets[hash]
                            = bucket
                                = linkedNodeList();
                    return bucket;
                };
                Dictionary.prototype._getBucketEntry = function (key, hash, bucket) {
                    if (key === null || key === VOID0 || !this.getCount())
                        return null;
                    var _ = this, comparer = _._keyComparer, compareKey = comparer(key);
                    if (!bucket)
                        bucket = _._getBucket(hash || getHashString(compareKey));
                    return bucket && bucket
                        .find(function (e) { return comparer(e.key) === compareKey; });
                };
                Dictionary.prototype._getEntry = function (key) {
                    var e = this._getBucketEntry(key);
                    return e && e.value;
                };
                Dictionary.prototype.getValue = function (key) {
                    var e = this._getEntry(key);
                    return e ? e.value : VOID0;
                };
                Dictionary.prototype._setValueInternal = function (key, value) {
                    var _ = this, buckets = _._buckets, entries = _._entries, comparer = _._keyComparer, compareKey = comparer(key), hash = getHashString(compareKey), bucket = _._getBucket(hash), bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);
                    if (bucketEntry) {
                        if (value === VOID0) {
                            var x = bucket.removeNode(bucketEntry), y = entries.removeNode(bucketEntry.value);
                            if (x && !bucket.count) {
                                delete buckets[hash];
                                linkedNodeList(bucket);
                                bucket = null;
                            }
                            if (x !== y)
                                throw "Entries and buckets are out of sync.";
                            if (x)
                                return true;
                        }
                        else {
                            var old = bucketEntry.value.value;
                            bucketEntry.value.value = value;
                            return !Compare_1.areEqual(value, old);
                        }
                    }
                    else if (value !== VOID0) {
                        if (!bucket)
                            bucket = _._getBucket(hash, true);
                        var entry = new HashEntry(key, value);
                        entries.addNode(entry);
                        bucket.addNode(new HashEntry(key, entry));
                        return true;
                    }
                    return false;
                };
                Dictionary.prototype._clearInternal = function () {
                    var _ = this, buckets = _._buckets;
                    for (var key in buckets) {
                        if (buckets.hasOwnProperty(key)) {
                            var bucket = buckets[key];
                            delete buckets[key];
                            linkedNodeList(bucket);
                        }
                    }
                    return _._entries.clear();
                };
                Dictionary.prototype.getEnumerator = function () {
                    var _ = this, ver, currentEntry;
                    return new EnumeratorBase_1.EnumeratorBase(function () {
                        ver = _._version;
                        currentEntry = _._entries.first;
                    }, function (yielder) {
                        if (currentEntry != null) {
                            _.assertVersion(ver);
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
            exports_1("Dictionary", Dictionary);
            exports_1("default",Dictionary);
        }
    }
});
//# sourceMappingURL=Dictionary.js.map