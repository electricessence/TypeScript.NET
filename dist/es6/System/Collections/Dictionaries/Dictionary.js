/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { areEqual } from "../../Compare";
import { Type } from "../../Types";
import { Functions } from "../../Functions";
import { EnumeratorBase } from "../Enumeration/EnumeratorBase";
import { LinkedNodeList } from "../LinkedNodeList";
import { ObjectPool } from "../../Disposable/ObjectPool";
import DictionaryBase from "./DictionaryBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
class HashEntry {
    constructor(key, value, previous = null, next = null) {
        this.key = key;
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
}
var linkedListPool;
function linkedNodeList(recycle) {
    if (!linkedListPool)
        linkedListPool
            = new ObjectPool(20, () => new LinkedNodeList(), r => r.clear());
    if (!recycle)
        return linkedListPool.take();
    linkedListPool.add(recycle);
}
function callHasOwnProperty(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
const NULL = "null", GET_HASH_CODE = "getHashCode";
function getHashString(obj) {
    if (obj === null)
        return NULL;
    if (obj === VOID0)
        return Type.UNDEFINED;
    if (Type.hasMemberOfType(obj, GET_HASH_CODE, Type.FUNCTION)) {
        return obj.getHashCode();
    }
    return (typeof obj.toString == Type.FUNCTION)
        ? obj.toString()
        : Object.prototype.toString.call(obj);
}
export class Dictionary extends DictionaryBase {
    constructor(_keyComparer = Functions.Identity) {
        super();
        this._keyComparer = _keyComparer;
        this._entries = linkedNodeList();
        this._buckets = {};
    }
    getCount() {
        return this._entries.unsafeCount;
    }
    _getBucket(hash, createIfMissing) { }
}
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
    if(key =  === null || key === VOID0 || !this.getCount()) { },
    return: null,
    var: _ = this,
    comparer = _._keyComparer,
    compareKey = comparer(key),
    if() { } }, !bucket), bucket = _._getBucket(hash || getHashString(compareKey)));
return bucket
    && bucket.find(e => comparer(e.key) === compareKey);
_getEntry(key, TKey);
IHashEntry( | null, {
    var: e = this._getBucketEntry(key),
    return: e && e.value
}, getValue(key, TKey), TValue, {
    var: e = this._getEntry(key),
    return: e ? e.value : VOID0
}, protected, _setValueInternal(key, TKey, value, TValue), boolean, {
    var: _ = this,
    buckets = _._buckets,
    entries = _._entries,
    comparer = _._keyComparer,
    compareKey = comparer(key),
    hash = getHashString(compareKey),
    bucket = _._getBucket(hash),
    bucketEntry = bucket && _._getBucketEntry(key, hash, bucket),
    if(bucketEntry) {
        var b = bucket;
        if (value === VOID0) {
            let x = b.removeNode(bucketEntry), y = entries.removeNode(bucketEntry.value);
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
            return !areEqual(value, old);
        }
    },
    else: , if(value =  !== VOID0) {
        if (!bucket)
            bucket = _._getBucket(hash, true);
        if (!bucket)
            throw new Error(`"${hash}" cannot be added to lookup table.`);
        let entry = new HashEntry(key, value);
        entries.addNode(entry);
        bucket.addNode(new HashEntry(key, entry));
        return true;
    },
    return: false
}, protected, _clearInternal(), number, {
    const: _ = this,
    var: buckets = _._buckets,
    for(let = key in buckets) {
        if (buckets.hasOwnProperty(key)) {
            let bucket = buckets[key];
            delete buckets[key];
            linkedNodeList(bucket);
        }
    },
    return: _._entries.clear()
}, getEnumerator(), IEnumerator < IKeyValuePair < TKey, TValue >>
    {
        const: _ = this,
        var: ver, number, currentEntry: IHashEntry( | null),
        return: new EnumeratorBase(() => {
            ver = _._version;
            currentEntry = _._entries.first;
        }, (yielder) => {
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
    var: result, TKey: [] = [],
    var: e, any = _._entries.first,
    while(e) {
        result.push(e.key);
        e = e.next;
    },
    return: result
}, protected, getValues(), TValue[], {
    const: _ = this,
    var: result, TValue: [] = [],
    var: e, any = _._entries.first,
    while(e) {
        result.push(e.value);
        e = e.next;
    },
    return: result
});
export default Dictionary;
//# sourceMappingURL=Dictionary.js.map