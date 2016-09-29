/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var Compare_1 = require("../../Compare");
var Types_1 = require("../../Types");
var Functions_1 = require("../../Functions");
var EnumeratorBase_1 = require("../Enumeration/EnumeratorBase");
var LinkedNodeList_1 = require("../LinkedNodeList");
var ObjectPool_1 = require("../../Disposable/ObjectPool");
var DictionaryBase_1 = require("./DictionaryBase");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var VOID0 = void 0;
var HashEntry = (function () {
    function HashEntry(key, value, previous, next) {
        if (previous === void 0) { previous = null; }
        if (next === void 0) { next = null; }
        this.key = key;
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    return HashEntry;
}());
var linkedListPool;
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
var NULL = "null", GET_HASH_CODE = "getHashCode";
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
var Dictionary = (function (_super) {
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
    Dictionary.prototype._getBucket = ;
    return Dictionary;
}(DictionaryBase_1.default));
exports.Dictionary = Dictionary;
{
    if (hash === null || hash === VOID0 || !createIfMissing && !this.getCount())
        return null;
    var buckets = this._buckets;
    var bucket = callHasOwnProperty(buckets, hash) ? buckets[hash] : VOID0;
    if (createIfMissing && !bucket)
        buckets[hash]
            = bucket
                = linkedNodeList();
    return bucket;
}
_getBucketEntry(key, TKey, hash ?  : string, bucket ?  : HashEntryLinkedList( | null), IHashEntry( | null, {
    if: function (key) { },
    return: null,
    var: _ = this,
    comparer: comparer,
    compareKey: compareKey,
    if: function () { } }, !bucket), bucket = _._getBucket(hash || getHashString(compareKey)));
return bucket
    && bucket.find(function (e) { return comparer(e.key) === compareKey; });
_getEntry(key, TKey);
IHashEntry( | null, {
    var: e = this._getBucketEntry(key),
    return: e && e.value
}, getValue(key, TKey), TValue, {
    var: e = this._getEntry(key),
    return: e ? e.value : VOID0
}, protected, _setValueInternal(key, TKey, value, TValue), boolean, {
    var: _ = this,
    buckets: buckets,
    entries: entries,
    comparer: comparer,
    compareKey: compareKey,
    hash: hash,
    bucket: bucket,
    bucketEntry: bucketEntry,
    if: function (bucketEntry) {
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
            var old = bucketEntry.value.value;
            bucketEntry.value.value = value;
            return !Compare_1.areEqual(value, old);
        }
    },
    else: , if: function (value) {
        if (value === void 0) { value =  !== VOID0; }
        if (!bucket)
            bucket = _._getBucket(hash, true);
        if (!bucket)
            throw new Error("\"" + hash + "\" cannot be added to lookup table.");
        var entry = new HashEntry(key, value);
        entries.addNode(entry);
        bucket.addNode(new HashEntry(key, entry));
        return true;
    },
    return: false
}, protected, _clearInternal(), number, {
    const: _ = this,
    var: buckets = _._buckets,
    for: function (let) {
        if (let === void 0) { let = key in buckets; }
        if (buckets.hasOwnProperty(key)) {
            var bucket_1 = buckets[key];
            delete buckets[key];
            linkedNodeList(bucket_1);
        }
    },
    return: _._entries.clear()
}, getEnumerator(), IEnumerator < IKeyValuePair < TKey, TValue >>
    {
        const: _ = this,
        var: ver, number: number, currentEntry: IHashEntry( | null),
        return: new EnumeratorBase_1.EnumeratorBase(function () {
            ver = _._version;
            currentEntry = _._entries.first;
        }, function (yielder) {
            if (currentEntry) {
                _.assertVersion(ver);
                var result = { key: currentEntry.key, value: currentEntry.value };
                currentEntry = currentEntry.next || null;
                return yielder.yieldReturn(result);
            }
            return yielder.yieldBreak();
        })
    }, protected, getKeys(), TKey[], {
    const: _ = this,
    var: result, TKey: [],
    var: e, any: any,
    while: function (e) {
        result.push(e.key);
        e = e.next;
    },
    return: result
}, protected, getValues(), TValue[], {
    const: _ = this,
    var: result, TValue: [],
    var: e, any: any,
    while: function (e) {
        result.push(e.value);
        e = e.next;
    },
    return: result
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
//# sourceMappingURL=Dictionary.js.map