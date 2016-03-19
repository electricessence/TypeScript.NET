/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compare_1 = require('../../Compare');
var Types_1 = require('../../Types');
var Functions_1 = require('../../Functions');
var DictionaryBase_1 = require('./DictionaryBase');
var EnumeratorBase_1 = require('../Enumeration/EnumeratorBase');
var LinkedNodeList_1 = require('../LinkedNodeList');
var VOID0 = void 0;

var HashEntry = function HashEntry(key, value, previous, next) {
    _classCallCheck(this, HashEntry);

    this.key = key;
    this.value = value;
    this.previous = previous;
    this.next = next;
};

function callHasOwnProperty(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
function computeHashCode(obj) {
    if (obj === null) return "null";
    if (obj === VOID0) return "undefined";
    return _typeof(obj.toString) === Types_1.default.FUNCTION ? obj.toString() : Object.prototype.toString.call(obj);
}

var Dictionary = function (_DictionaryBase_1$def) {
    _inherits(Dictionary, _DictionaryBase_1$def);

    function Dictionary() {
        var _compareSelector = arguments.length <= 0 || arguments[0] === undefined ? Functions_1.default.Identity : arguments[0];

        _classCallCheck(this, Dictionary);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dictionary).call(this));

        _this._compareSelector = _compareSelector;
        _this._count = 0;
        _this._entries = new LinkedNodeList_1.default();
        _this._buckets = {};
        return _this;
    }

    _createClass(Dictionary, [{
        key: 'setKV',
        value: function setKV(key, value, allowOverwrite) {
            var _ = this,
                buckets = _._buckets,
                entries = _._entries,
                comparer = _._compareSelector,
                compareKey = comparer(key),
                hash = computeHashCode(compareKey),
                entry;
            if (callHasOwnProperty(buckets, hash)) {
                var equal = Compare_1.areEqual;
                var array = buckets[hash];
                for (var i = 0; i < array.length; i++) {
                    var old = array[i];
                    if (comparer(old.key) === compareKey) {
                        if (!allowOverwrite) throw new Error("Key already exists.");
                        var changed = !equal(old.value, value);
                        if (changed) {
                            if (value === VOID0) {
                                entries.removeNode(old);
                                array.splice(i, 1);
                                if (!array.length) delete buckets[hash];
                                --_._count;
                            } else {
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
            } else {
                if (value === VOID0) {
                    if (allowOverwrite) return false;else throw new Error("Cannot add 'undefined' value.");
                }
                buckets[hash] = [entry = new HashEntry(key, value)];
            }
            ++_._count;
            entries.addNode(entry);
            _._onValueUpdate(key, value, undefined);
            return true;
        }
    }, {
        key: 'addByKeyValue',
        value: function addByKeyValue(key, value) {
            this.setKV(key, value, false);
        }
    }, {
        key: 'getValue',
        value: function getValue(key) {
            var buckets = this._buckets,
                comparer = this._compareSelector;
            var compareKey = comparer(key);
            var hash = computeHashCode(compareKey);
            if (!callHasOwnProperty(buckets, hash)) return undefined;
            var array = buckets[hash];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entry = _step.value;

                    if (comparer(entry.key) === compareKey) return entry.value;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return undefined;
        }
    }, {
        key: 'setValue',
        value: function setValue(key, value) {
            return this.setKV(key, value, true);
        }
    }, {
        key: 'containsKey',
        value: function containsKey(key) {
            var _ = this,
                buckets = _._buckets,
                comparer = _._compareSelector;
            var compareKey = comparer(key);
            var hash = computeHashCode(compareKey);
            if (!callHasOwnProperty(buckets, hash)) return false;
            var array = buckets[hash];
            for (var i = 0, len = array.length; i < len; i++) {
                if (comparer(array[i].key) === compareKey) return true;
            }
            return false;
        }
    }, {
        key: 'clear',
        value: function clear() {
            var _ = this,
                buckets = _._buckets,
                count = _get(Object.getPrototypeOf(Dictionary.prototype), 'clear', this).call(this);
            _._count = 0;
            for (var key in buckets) {
                if (buckets.hasOwnProperty(key)) delete buckets[key];
            }
            _._entries.clear();
            return count;
        }
    }, {
        key: 'getCount',
        value: function getCount() {
            return this._count;
        }
    }, {
        key: 'getEnumerator',
        value: function getEnumerator() {
            var _ = this,
                currentEntry;
            return new EnumeratorBase_1.default(function () {
                currentEntry = _._entries.first;
            }, function (yielder) {
                if (currentEntry != null) {
                    var result = { key: currentEntry.key, value: currentEntry.value };
                    currentEntry = currentEntry.next;
                    return yielder.yieldReturn(result);
                }
                return yielder.yieldBreak();
            });
        }
    }, {
        key: 'getKeys',
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
        key: 'getValues',
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

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dictionary;
//# sourceMappingURL=Dictionary.js.map
