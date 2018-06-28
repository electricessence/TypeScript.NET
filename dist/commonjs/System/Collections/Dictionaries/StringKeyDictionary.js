"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Compare_1 = require("../../Compare");
var DictionaryBase_1 = require("./DictionaryBase");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0;
var StringKeyDictionary = /** @class */ (function (_super) {
    __extends(StringKeyDictionary, _super);
    function StringKeyDictionary() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._count = 0;
        _this._map = {};
        return _this;
    }
    StringKeyDictionary.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._map = null;
    };
    StringKeyDictionary.prototype._getEntry = function (key) {
        return !this.containsKey(key)
            ? null : {
            key: key,
            value: this.getAssuredValue(key)
        };
    };
    StringKeyDictionary.prototype.containsKey = function (key) {
        return key != null
            && this._count != 0
            && this._map[key] !== VOID0;
    };
    StringKeyDictionary.prototype.containsValue = function (value) {
        if (!this._count)
            return false;
        var map = this._map;
        for (var key in map) {
            if (map.hasOwnProperty(key) && Compare_1.areEqual(map[key], value))
                return true;
        }
        return false;
    };
    StringKeyDictionary.prototype.getValue = function (key) {
        return key == null || !this._count
            ? VOID0
            : this._map[key];
    };
    StringKeyDictionary.prototype._setValueInternal = function (key, value) {
        var _ = this;
        var map = _._map, old = map[key];
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
    // Returns true if any value is updated...
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
        var _ = this;
        var result = {};
        if (_._count)
            for (var key in _._map) {
                if (_._map.hasOwnProperty(key)) // This simply satisfies inspection.
                 {
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
exports.default = StringKeyDictionary;
//# sourceMappingURL=StringKeyDictionary.js.map