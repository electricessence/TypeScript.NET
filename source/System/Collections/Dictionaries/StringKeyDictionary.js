/*!
 * @author electricessence / https://github.com/electricessence/
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
        define(["require", "exports", "../../Compare", "./DictionaryBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Compare_1 = require("../../Compare");
    var DictionaryBase_1 = require("./DictionaryBase");
    var VOID0 = void 0;
    var StringKeyDictionary = (function (_super) {
        __extends(StringKeyDictionary, _super);
        function StringKeyDictionary() {
            _super.apply(this, arguments);
            this._count = 0;
            this._map = {};
        }
        StringKeyDictionary.prototype._getEntry = function (key) {
            return !this.containsKey(key)
                ? null : {
                key: key,
                value: this.getValue(key)
            };
        };
        StringKeyDictionary.prototype.containsKey = function (key) {
            if (key === null || key === VOID0 || !this._count)
                return false;
            return (key) in (this._map);
        };
        StringKeyDictionary.prototype.containsValue = function (value) {
            if (!this._count)
                return false;
            var map = this._map, equal = Compare_1.areEqual;
            for (var key in map) {
                if (map.hasOwnProperty(key) && equal(map[key], value))
                    return true;
            }
            return false;
        };
        StringKeyDictionary.prototype.getValue = function (key) {
            if (key === null || key === VOID0 || !this._count)
                return VOID0;
            return this._map[key];
        };
        StringKeyDictionary.prototype._setValueInternal = function (key, value) {
            var _ = this, map = _._map, old = map[key];
            if (old !== value) {
                if (value === VOID0) {
                    if ((key) in (map)) {
                        delete map[key];
                        _._count--;
                    }
                }
                else {
                    if (!map.hasOwnProperty(key))
                        _._count++;
                    map[key] = value;
                }
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
            if (_._count)
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
            return Object.keys(this._map);
        };
        StringKeyDictionary.prototype.getValues = function () {
            if (!this._count)
                return [];
            var result = Object.keys(this._map);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = this._map[result[i]];
            }
            return result;
        };
        StringKeyDictionary.prototype.getCount = function () {
            return this._count;
        };
        return StringKeyDictionary;
    }(DictionaryBase_1.DictionaryBase));
    exports.StringKeyDictionary = StringKeyDictionary;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StringKeyDictionary;
});
//# sourceMappingURL=StringKeyDictionary.js.map