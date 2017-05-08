/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Compare", "../../Types", "../Enumeration/EnumeratorBase", "../LinkedNodeList", "../../Disposable/ObjectPool", "./getIdentifier", "./DictionaryBase", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    //noinspection JSUnusedLocalSymbols
    function linkedNodeList(recycle) {
        if (!linkedListPool)
            linkedListPool
                = new ObjectPool_1.ObjectPool(20, function () { return new LinkedNodeList_1.LinkedNodeList(); }, function (r) { return r.clear(); });
        if (!recycle)
            return linkedListPool.take();
        linkedListPool.add(recycle);
    }
    var Compare_1, Types_1, EnumeratorBase_1, LinkedNodeList_1, ObjectPool_1, getIdentifier_1, DictionaryBase_1, extends_1, __extends, VOID0, HashEntry, linkedListPool, Dictionary;
    return {
        setters: [
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
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
            function (getIdentifier_1_1) {
                getIdentifier_1 = getIdentifier_1_1;
            },
            function (DictionaryBase_1_1) {
                DictionaryBase_1 = DictionaryBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Original: http://linqjs.codeplex.com/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            VOID0 = void 0;
            // LinkedList for Dictionary
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
                function Dictionary(_keyGenerator) {
                    var _this = _super.call(this) || this;
                    _this._keyGenerator = _keyGenerator;
                    _this._entries = linkedNodeList();
                    _this._buckets = {};
                    return _this;
                }
                Dictionary.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    var _ = this;
                    _._entries = null;
                    _._buckets = null;
                    _._hashGenerator = null;
                };
                Dictionary.prototype.getCount = function () {
                    return this._entries && this._entries.unsafeCount || 0;
                };
                Dictionary.prototype._getBucket = function (hash, createIfMissing) {
                    if (hash == null || !createIfMissing && !this.getCount())
                        return null;
                    if (!Types_1.Type.isPrimitiveOrSymbol(hash))
                        console.warn("Key type not indexable and could cause Dictionary to be extremely slow.");
                    var buckets = this._buckets;
                    var bucket = buckets[hash];
                    if (createIfMissing && !bucket)
                        buckets[hash]
                            = bucket
                                = linkedNodeList();
                    return bucket || null;
                };
                Dictionary.prototype._getBucketEntry = function (key, hash, bucket) {
                    if (key == null || !this.getCount())
                        return null;
                    var _ = this, comparer = _._keyGenerator, compareKey = comparer ? comparer(key) : key;
                    if (!bucket)
                        bucket = _._getBucket(hash || getIdentifier_1.getIdentifier(compareKey));
                    return bucket
                        && (comparer
                            ? bucket.find(function (e) { return comparer(e.key) === compareKey; })
                            : bucket.find(function (e) { return e.key === compareKey; }));
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
                    var _ = this;
                    var buckets = _._buckets, entries = _._entries, compareKey = _._keyGenerator ? _._keyGenerator(key) : key, hash = getIdentifier_1.getIdentifier(compareKey);
                    var bucket = _._getBucket(hash);
                    var bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);
                    // Entry exits? Delete or update
                    if (bucketEntry) {
                        var b = bucket;
                        if (value === VOID0) {
                            var x = b.removeNode(bucketEntry), y = entries.removeNode(bucketEntry.value);
                            if (x && !b.count) {
                                delete buckets[hash];
                                linkedNodeList(b);
                                bucket = null;
                            }
                            if (x !== y)
                                throw "Entries and buckets are out of sync.";
                            if (x)
                                return true;
                        }
                        else {
                            // We don't expose the internal hash entries so replacing the value is ok.
                            var old = bucketEntry.value.value;
                            bucketEntry.value.value = value;
                            return !Compare_1.areEqual(value, old);
                        }
                    }
                    else if (value !== VOID0) {
                        if (!bucket)
                            bucket = _._getBucket(hash, true);
                        if (!bucket)
                            throw new Error("\"" + hash + "\" cannot be added to lookup table.");
                        var entry = new HashEntry(key, value);
                        entries.addNode(entry);
                        bucket.addNode(new HashEntry(key, entry));
                        return true;
                    }
                    return false;
                };
                Dictionary.prototype._clearInternal = function () {
                    var _ = this;
                    var buckets = _._buckets;
                    // Ensure reset and clean...
                    for (var key in buckets) {
                        if (buckets.hasOwnProperty(key)) {
                            var bucket = buckets[key];
                            delete buckets[key];
                            linkedNodeList(bucket);
                        }
                    }
                    return _._entries.clear();
                };
                /*
                 * Note: super.getEnumerator() works perfectly well,
                 * but enumerating the internal linked node list is much more efficient.
                 */
                Dictionary.prototype.getEnumerator = function () {
                    var _ = this;
                    _.throwIfDisposed();
                    var ver, currentEntry;
                    return new EnumeratorBase_1.EnumeratorBase(function () {
                        _.throwIfDisposed();
                        ver = _._version;
                        currentEntry = _._entries.first;
                    }, function (yielder) {
                        if (currentEntry) {
                            _.throwIfDisposed();
                            _.assertVersion(ver);
                            var result = { key: currentEntry.key, value: currentEntry.value };
                            currentEntry = currentEntry.next || null;
                            return yielder.yieldReturn(result);
                        }
                        return yielder.yieldBreak();
                    });
                };
                Dictionary.prototype.getKeys = function () {
                    var _ = this;
                    var result = [];
                    var e = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.key);
                        e = e.next;
                    }
                    return result;
                };
                Dictionary.prototype.getValues = function () {
                    var _ = this;
                    var result = [];
                    var e = _._entries && _._entries.first;
                    while (e) {
                        result.push(e.value);
                        e = e.next;
                    }
                    return result;
                };
                return Dictionary;
            }(DictionaryBase_1.default));
            exports_1("Dictionary", Dictionary);
            exports_1("default", Dictionary);
        }
    };
});
//# sourceMappingURL=Dictionary.js.map