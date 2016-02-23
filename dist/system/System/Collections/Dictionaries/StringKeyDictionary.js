/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(['../../Compare', './DictionaryBase'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Compare_1, DictionaryBase_1;
    var VOID0, StringKeyDictionary;
    return {
        setters:[
            function (Compare_1_1) {
                Compare_1 = Compare_1_1;
            },
            function (DictionaryBase_1_1) {
                DictionaryBase_1 = DictionaryBase_1_1;
            }],
        execute: function() {
            VOID0 = void 0;
            StringKeyDictionary = (function (_super) {
                __extends(StringKeyDictionary, _super);
                function StringKeyDictionary() {
                    _super.apply(this, arguments);
                    this._count = 0;
                    this._map = {};
                }
                StringKeyDictionary.prototype.containsKey = function (key) {
                    return (key) in (this._map);
                };
                StringKeyDictionary.prototype.containsValue = function (value) {
                    var map = this._map, equal = Compare_1.areEqual;
                    for (var key in map) {
                        if (map.hasOwnProperty(key) && equal(map[key], value))
                            return true;
                    }
                    return false;
                };
                StringKeyDictionary.prototype.getValue = function (key) {
                    return this._map[key];
                };
                StringKeyDictionary.prototype.setValue = function (key, value) {
                    var _ = this, map = _._map, old = map[key];
                    if (old !== value) {
                        if (value === VOID0) {
                            if ((key) in (map)) {
                                delete map[key];
                                --_._count;
                            }
                        }
                        else {
                            if (!((key) in (map)))
                                ++_._count;
                            map[key] = value;
                        }
                        _._onValueUpdate(key, value, old);
                        return true;
                    }
                    return false;
                };
                StringKeyDictionary.prototype.importMap = function (values) {
                    var _ = this;
                    return _.handleUpdate(function () {
                        var changed = false;
                        for (var key in values) {
                            if (values.hasOwnProperty(key) && _.setValue(key, values[key]))
                                changed = true;
                        }
                        return changed;
                    });
                };
                StringKeyDictionary.prototype.toMap = function (selector) {
                    var _ = this, result = {};
                    for (var key in _._map) {
                        if (_._map.hasOwnProperty(key)) {
                            var value = _._map[key];
                            if (selector)
                                value = selector(key, value);
                            if (value !== VOID0)
                                result[key] = value;
                        }
                    }
                    return result;
                };
                StringKeyDictionary.prototype.getKeys = function () {
                    var _ = this, result = [];
                    for (var key in _._map) {
                        if (_._map.hasOwnProperty(key))
                            result.push(key);
                    }
                    return result;
                };
                StringKeyDictionary.prototype.getValues = function () {
                    var _ = this, result = [];
                    for (var key in _._map) {
                        if (_._map.hasOwnProperty(key))
                            result.push(_._map[key]);
                    }
                    return result;
                };
                StringKeyDictionary.prototype.getCount = function () {
                    return this._count;
                };
                return StringKeyDictionary;
            }(DictionaryBase_1.default));
            exports_1("default", StringKeyDictionary);
        }
    }
});
//# sourceMappingURL=StringKeyDictionary.js.map