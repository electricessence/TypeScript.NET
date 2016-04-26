/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../Compare", "../../Types", "../../Functions", "./DictionaryBase", "../Enumeration/EnumeratorBase", "../LinkedNodeList"], factory);
    }
})(function (require, exports) {
    'use strict';
    var Compare_1 = require("../../Compare");
    var Types_1 = require("../../Types");
    var Functions_1 = require("../../Functions");
    var DictionaryBase_1 = require("./DictionaryBase");
    var EnumeratorBase_1 = require("../Enumeration/EnumeratorBase");
    var LinkedNodeList_1 = require("../LinkedNodeList");
    var VOID0 = void 0;
    var HashEntry = (function () {
        function HashEntry(key, value, previous, next) {
            this.key = key;
            this.value = value;
            this.previous = previous;
            this.next = next;
        }
        return HashEntry;
    }());
    function callHasOwnProperty(target, key) {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
    function getHashString(obj) {
        if (obj === null)
            return "null";
        if (obj === VOID0)
            return "undefined";
        if (Types_1.default.hasMemberOfType(obj, "getHashCode", Types_1.default.FUNCTION)) {
            return obj.getHashCode();
        }
        return (typeof obj.toString == Types_1.default.FUNCTION)
            ? obj.toString()
            : Object.prototype.toString.call(obj);
    }
    var Dictionary = (function (_super) {
        __extends(Dictionary, _super);
        function Dictionary(_keyComparer) {
            if (_keyComparer === void 0) { _keyComparer = Functions_1.default.Identity; }
            _super.call(this);
            this._keyComparer = _keyComparer;
            this._count = 0;
            this._entries = new LinkedNodeList_1.default();
            this._buckets = {};
        }
        Dictionary.prototype.getCount = function () {
            return this._count;
        };
        Dictionary.prototype._getBucket = function (hash, createIfMissing) {
            if (hash === null || hash === VOID0 || !createIfMissing && !this._count)
                return null;
            var buckets = this._buckets;
            var bucket = callHasOwnProperty(buckets, hash) ? buckets[hash] : VOID0;
            if (createIfMissing && !bucket)
                buckets[hash]
                    = bucket
                        = new LinkedNodeList_1.default();
            return bucket;
        };
        Dictionary.prototype._getBucketEntry = function (key, hash, bucket) {
            if (key === null || key === VOID0 || !this._count)
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
                    if (y)
                        _._count--;
                    if (x && !bucket.count)
                        delete buckets[hash];
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
                _._count++;
                return true;
            }
            return false;
        };
        Dictionary.prototype._clearInternal = function () {
            var _ = this, buckets = _._buckets;
            _._count = 0;
            for (var key in buckets) {
                if (buckets.hasOwnProperty(key)) {
                    var bucket = buckets[key];
                    delete buckets[key];
                    bucket.clear();
                }
            }
            return _._entries.clear();
        };
        Dictionary.prototype.getEnumerator = function () {
            var _ = this, ver, currentEntry;
            return new EnumeratorBase_1.default(function () {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Dictionary;
});
//# sourceMappingURL=Dictionary.js.map