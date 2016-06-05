/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Compare_1 = require("../../Compare");
var Enumerator_1 = require("../Enumeration/Enumerator");
var CollectionBase_1 = require("../CollectionBase");
var EnumeratorBase_1 = require("../Enumeration/EnumeratorBase");
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var InvalidOperationException_1 = require("../../Exceptions/InvalidOperationException");
var KeyValueExtract_1 = require("../../KeyValueExtract");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var VOID0 = void 0;

var DictionaryBase = function (_CollectionBase_1$Col) {
    _inherits(DictionaryBase, _CollectionBase_1$Col);

    function DictionaryBase(source) {
        _classCallCheck(this, DictionaryBase);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DictionaryBase).call(this, source));
    }

    _createClass(DictionaryBase, [{
        key: "_onValueModified",
        value: function _onValueModified(key, value, old) {}
    }, {
        key: "_addInternal",
        value: function _addInternal(item) {
            var _this2 = this;

            if (!item) throw new ArgumentNullException_1.ArgumentNullException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
                return _this2.addByKeyValue(key, value);
            });
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            var _ = this,
                count = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _.keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (_.removeByKey(key)) count++;
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

            return count;
        }
    }, {
        key: "contains",
        value: function contains(item) {
            var _this3 = this;

            if (!item || !this.getCount()) return false;
            return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
                var v = _this3.getValue(key);
                return Compare_1.areEqual(value, v);
            });
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(item) {
            var _this4 = this;

            if (!item) return 0;
            return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
                var v = _this4.getValue(key);
                return Compare_1.areEqual(value, v) && _this4.removeByKey(key) ? 1 : 0;
            });
        }
    }, {
        key: "addByKeyValue",
        value: function addByKeyValue(key, value) {
            if (value === VOID0) throw new InvalidOperationException_1.InvalidOperationException("Cannot add 'undefined' as a value.");
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new InvalidOperationException_1.InvalidOperationException("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            return _.setValue(key, value);
        }
    }, {
        key: "setValue",
        value: function setValue(key, value) {
            var _ = this;
            _.assertModifiable();
            var changed = false,
                old = _.getValue(key);
            if (!Compare_1.areEqual(value, old) && _._setValueInternal(key, value)) {
                changed = true;
                _._onValueModified(key, value, old);
            }
            _._signalModification(changed);
            return changed;
        }
    }, {
        key: "containsKey",
        value: function containsKey(key) {
            return !!this._getEntry(key);
        }
    }, {
        key: "containsValue",
        value: function containsValue(value) {
            var e = this.getEnumerator(),
                equal = Compare_1.areEqual;
            while (e.moveNext()) {
                if (equal(e.current, value, true)) {
                    e.dispose();
                    return true;
                }
            }
            return false;
        }
    }, {
        key: "removeByKey",
        value: function removeByKey(key) {
            return this.setValue(key, VOID0);
        }
    }, {
        key: "removeByValue",
        value: function removeByValue(value) {
            var _ = this,
                count = 0,
                equal = Compare_1.areEqual;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _.getKeys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    if (equal(_.getValue(key), value, true)) {
                        _.removeByKey(key);
                        count++;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return count;
        }
    }, {
        key: "importEntries",
        value: function importEntries(pairs) {
            return _get(Object.getPrototypeOf(DictionaryBase.prototype), "importEntries", this).call(this, pairs);
        }
    }, {
        key: "_importEntries",
        value: function _importEntries(pairs) {
            var _ = this;
            if (!pairs) return 0;
            var changed = 0;
            Enumerator_1.forEach(pairs, function (pair) {
                return KeyValueExtract_1.extractKeyValue(pair, function (key, value) {
                    if (_._setValueInternal(key, value)) changed++;
                });
            });
            return changed;
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            var _ = this;
            var ver,
                keys,
                len,
                i = 0;
            return new EnumeratorBase_1.EnumeratorBase(function () {
                ver = _._version;
                keys = _.getKeys();
                len = keys.length;
            }, function (yielder) {
                _.assertVersion(ver);
                while (i < len) {
                    var key = keys[i++],
                        value = _.getValue(key);
                    if (value !== VOID0) return yielder.yieldReturn({ key: key, value: value });
                }
                return yielder.yieldBreak();
            });
        }
    }, {
        key: "keys",
        get: function get() {
            return this.getKeys();
        }
    }, {
        key: "values",
        get: function get() {
            return this.getValues();
        }
    }]);

    return DictionaryBase;
}(CollectionBase_1.CollectionBase);

exports.DictionaryBase = DictionaryBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DictionaryBase;
//# sourceMappingURL=DictionaryBase.js.map
