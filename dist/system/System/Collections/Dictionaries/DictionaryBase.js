/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Compare", "../Enumeration/Enumerator", "../CollectionBase", "../Enumeration/EnumeratorBase", "../../Exceptions/ArgumentNullException", "../../Exceptions/InvalidOperationException", "../../KeyValueExtract"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, Enumerator_1, CollectionBase_1, EnumeratorBase_1, ArgumentNullException_1, InvalidOperationException_1, KeyValueExtract_1;
    var VOID0, DictionaryBase;
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            },
            function (EnumeratorBase_1_1) {
                EnumeratorBase_1 = EnumeratorBase_1_1;
            },
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (InvalidOperationException_1_1) {
                InvalidOperationException_1 = InvalidOperationException_1_1;
            },
            function (KeyValueExtract_1_1) {
                KeyValueExtract_1 = KeyValueExtract_1_1;
            }],
        execute: function() {
            VOID0 = void (0);
            DictionaryBase = (function (_super) {
                __extends(DictionaryBase, _super);
                function DictionaryBase(source) {
                    _super.call(this, source);
                }
                DictionaryBase.prototype._onValueModified = function (key, value, old) {
                };
                DictionaryBase.prototype._addInternal = function (item) {
                    var _this = this;
                    if (!item)
                        throw new ArgumentNullException_1.ArgumentNullException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
                    return KeyValueExtract_1.extractKeyValue(item, function (key, value) { return _this.addByKeyValue(key, value); });
                };
                DictionaryBase.prototype._clearInternal = function () {
                    var _ = this, count = 0;
                    for (var _i = 0, _a = _.keys; _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (_.removeByKey(key))
                            count++;
                    }
                    return count;
                };
                DictionaryBase.prototype.contains = function (item) {
                    var _this = this;
                    if (!item || !this.getCount())
                        return false;
                    return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
                        var v = _this.getValue(key);
                        return Compare_1.areEqual(value, v);
                    });
                };
                DictionaryBase.prototype._removeInternal = function (item) {
                    var _this = this;
                    if (!item)
                        return 0;
                    return KeyValueExtract_1.extractKeyValue(item, function (key, value) {
                        var v = _this.getValue(key);
                        return (Compare_1.areEqual(value, v) && _this.removeByKey(key))
                            ? 1 : 0;
                    });
                };
                Object.defineProperty(DictionaryBase.prototype, "keys", {
                    get: function () { return this.getKeys(); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DictionaryBase.prototype, "values", {
                    get: function () { return this.getValues(); },
                    enumerable: true,
                    configurable: true
                });
                DictionaryBase.prototype.addByKeyValue = function (key, value) {
                    if (value === VOID0)
                        throw new InvalidOperationException_1.InvalidOperationException("Cannot add 'undefined' as a value.");
                    var _ = this;
                    if (_.containsKey(key)) {
                        var ex = new InvalidOperationException_1.InvalidOperationException("Adding a key/value when the key already exists.");
                        ex.data['key'] = key;
                        ex.data['value'] = value;
                        throw ex;
                    }
                    return _.setValue(key, value);
                };
                DictionaryBase.prototype.setValue = function (key, value) {
                    var _ = this;
                    _.assertModifiable();
                    var changed = false, old = _.getValue(key);
                    if (!Compare_1.areEqual(value, old) && _._setValueInternal(key, value)) {
                        changed = true;
                        _._onValueModified(key, value, old);
                    }
                    _._signalModification(changed);
                    return changed;
                };
                DictionaryBase.prototype.containsKey = function (key) {
                    return !!this._getEntry(key);
                };
                DictionaryBase.prototype.containsValue = function (value) {
                    var e = this.getEnumerator(), equal = Compare_1.areEqual;
                    while (e.moveNext()) {
                        if (equal(e.current, value, true)) {
                            e.dispose();
                            return true;
                        }
                    }
                    return false;
                };
                DictionaryBase.prototype.removeByKey = function (key) {
                    return this.setValue(key, VOID0);
                };
                DictionaryBase.prototype.removeByValue = function (value) {
                    var _ = this, count = 0, equal = Compare_1.areEqual;
                    for (var _i = 0, _a = _.getKeys(); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (equal(_.getValue(key), value, true)) {
                            _.removeByKey(key);
                            count++;
                        }
                    }
                    return count;
                };
                DictionaryBase.prototype.importEntries = function (pairs) {
                    return _super.prototype.importEntries.call(this, pairs);
                };
                DictionaryBase.prototype._importEntries = function (pairs) {
                    var _ = this;
                    if (!pairs)
                        return 0;
                    var changed = 0;
                    Enumerator_1.forEach(pairs, function (pair) { return KeyValueExtract_1.extractKeyValue(pair, function (key, value) {
                        if (_._setValueInternal(key, value))
                            changed++;
                    }); });
                    return changed;
                };
                DictionaryBase.prototype.getEnumerator = function () {
                    var _ = this;
                    var ver, keys, len, i = 0;
                    return new EnumeratorBase_1.EnumeratorBase(function () {
                        ver = _._version;
                        keys = _.getKeys();
                        len = keys.length;
                    }, function (yielder) {
                        _.assertVersion(ver);
                        while (i < len) {
                            var key = keys[i++], value = _.getValue(key);
                            if (value !== VOID0)
                                return yielder.yieldReturn({ key: key, value: value });
                        }
                        return yielder.yieldBreak();
                    });
                };
                return DictionaryBase;
            }(CollectionBase_1.CollectionBase));
            exports_1("DictionaryBase", DictionaryBase);
            exports_1("default",DictionaryBase);
        }
    }
});
//# sourceMappingURL=DictionaryBase.js.map