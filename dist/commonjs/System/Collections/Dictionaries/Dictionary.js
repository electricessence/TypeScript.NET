/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var HashEntry = function HashEntry(key, value, previous, next) {
    _classCallCheck(this, HashEntry);

    this.key = key;
    this.value = value;
    this.previous = previous;
    this.next = next;
};

var linkedListPool;
function linkedNodeList(recycle) {
    if (!linkedListPool) linkedListPool = new ObjectPool_1.ObjectPool(20, function () {
        return new LinkedNodeList_1.LinkedNodeList();
    }, function (r) {
        return r.clear();
    });
    if (!recycle) return linkedListPool.take();
    linkedListPool.add(recycle);
}
function callHasOwnProperty(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
var NULL = "null",
    GET_HASH_CODE = "getHashCode";
function getHashString(obj) {
    if (obj === null) return NULL;
    if (obj === VOID0) return Types_1.Type.UNDEFINED;
    if (Types_1.Type.hasMemberOfType(obj, GET_HASH_CODE, Types_1.Type.FUNCTION)) {
        return obj.getHashCode();
    }
    return _typeof(obj.toString) == Types_1.Type.FUNCTION ? obj.toString() : Object.prototype.toString.call(obj);
}

var Dictionary = function (_DictionaryBase_1$def) {
    _inherits(Dictionary, _DictionaryBase_1$def);

    function Dictionary() {
        var _keyComparer = arguments.length <= 0 || arguments[0] === undefined ? Functions_1.Functions.Identity : arguments[0];

        _classCallCheck(this, Dictionary);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dictionary).call(this));

        _this._keyComparer = _keyComparer;
        _this._entries = linkedNodeList();
        _this._buckets = {};
        return _this;
    }

    _createClass(Dictionary, [{
        key: "getCount",
        value: function getCount() {
            return this._entries.unsafeCount;
        }
    }, {
        key: "_getBucket",
        value: function _getBucket(hash, createIfMissing) {
            if (hash === null || hash === VOID0 || !createIfMissing && !this.getCount()) return null;
            var buckets = this._buckets;
            var bucket = callHasOwnProperty(buckets, hash) ? buckets[hash] : VOID0;
            if (createIfMissing && !bucket) buckets[hash] = bucket = linkedNodeList();
            return bucket;
        }
    }, {
        key: "_getBucketEntry",
        value: function _getBucketEntry(key, hash, bucket) {
            if (key === null || key === VOID0 || !this.getCount()) return null;
            var _ = this,
                comparer = _._keyComparer,
                compareKey = comparer(key);
            if (!bucket) bucket = _._getBucket(hash || getHashString(compareKey));
            return bucket && bucket.find(function (e) {
                return comparer(e.key) === compareKey;
            });
        }
    }, {
        key: "_getEntry",
        value: function _getEntry(key) {
            var e = this._getBucketEntry(key);
            return e && e.value;
        }
    }, {
        key: "getValue",
        value: function getValue(key) {
            var e = this._getEntry(key);
            return e ? e.value : VOID0;
        }
    }, {
        key: "_setValueInternal",
        value: function _setValueInternal(key, value) {
            var _ = this,
                buckets = _._buckets,
                entries = _._entries,
                comparer = _._keyComparer,
                compareKey = comparer(key),
                hash = getHashString(compareKey),
                bucket = _._getBucket(hash),
                bucketEntry = bucket && _._getBucketEntry(key, hash, bucket);
            if (bucketEntry) {
                if (value === VOID0) {
                    var x = bucket.removeNode(bucketEntry),
                        y = entries.removeNode(bucketEntry.value);
                    if (x && !bucket.count) {
                        delete buckets[hash];
                        linkedNodeList(bucket);
                        bucket = null;
                    }
                    if (x !== y) throw "Entries and buckets are out of sync.";
                    if (x) return true;
                } else {
                    var old = bucketEntry.value.value;
                    bucketEntry.value.value = value;
                    return !Compare_1.areEqual(value, old);
                }
            } else if (value !== VOID0) {
                if (!bucket) bucket = _._getBucket(hash, true);
                var entry = new HashEntry(key, value);
                entries.addNode(entry);
                bucket.addNode(new HashEntry(key, entry));
                return true;
            }
            return false;
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            var _ = this,
                buckets = _._buckets;
            for (var key in buckets) {
                if (buckets.hasOwnProperty(key)) {
                    var bucket = buckets[key];
                    delete buckets[key];
                    linkedNodeList(bucket);
                }
            }
            return _._entries.clear();
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            var _ = this,
                ver,
                currentEntry;
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
        }
    }, {
        key: "getKeys",
        value: function getKeys() {
            var _ = this,
                result = [];
            var e = _._entries.first;
            while (e) {
                result.push(e.key);
                e = e.next;
            }
            return result;
        }
    }, {
        key: "getValues",
        value: function getValues() {
            var _ = this,
                result = [];
            var e = _._entries.first;
            while (e) {
                result.push(e.value);
                e = e.next;
            }
            return result;
        }
    }]);

    return Dictionary;
}(DictionaryBase_1.default);

exports.Dictionary = Dictionary;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
//# sourceMappingURL=Dictionary.js.map
