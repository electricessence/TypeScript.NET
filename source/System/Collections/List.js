/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Compare", "./Array/Utility", "./Enumeration/Enumerator", "../Types", "./Enumeration/ArrayEnumerator", "./CollectionBase", "../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Compare_1 = require("../Compare");
    var Utility_1 = require("./Array/Utility");
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var Types_1 = require("../Types");
    var ArrayEnumerator_1 = require("./Enumeration/ArrayEnumerator");
    var CollectionBase_1 = require("./CollectionBase");
    var extends_1 = require("../../extends");
    var __extends = extends_1.default;
    var List = (function (_super) {
        __extends(List, _super);
        function List(source, equalityComparer) {
            if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
            _super.call(this, null, equalityComparer);
            var _ = this;
            if (Array.isArray(source)) {
                _._source = source.slice();
            }
            else {
                _._source = [];
                _._importEntries(source);
            }
        }
        List.prototype.getCount = function () {
            return this._source.length;
        };
        List.prototype._addInternal = function (entry) {
            this._source.push(entry);
            return true;
        };
        List.prototype._removeInternal = function (entry, max) {
            if (max === void 0) { max = Infinity; }
            return Utility_1.remove(this._source, entry, max, this._equalityComparer);
        };
        List.prototype._clearInternal = function () {
            var len = this._source.length;
            this._source.length = 0;
            return len;
        };
        List.prototype._importEntries = function (entries) {
            if (Types_1.Type.isArrayLike(entries)) {
                var len = entries.length;
                if (!len)
                    return 0;
                var s = this._source;
                var first = s.length;
                s.length += len;
                for (var i = 0; i < len; i++) {
                    s[i + first] = entries[i];
                }
                return len;
            }
            else {
                return _super.prototype._importEntries.call(this, entries);
            }
        };
        List.prototype.get = function (index) {
            return this._source[index];
        };
        List.prototype.set = function (index, value) {
            var s = this._source;
            if (index < s.length && Compare_1.areEqual(value, s[index]))
                return false;
            s[index] = value;
            this._onModified();
            return true;
        };
        List.prototype.indexOf = function (item) {
            return Utility_1.indexOf(this._source, item, this._equalityComparer);
        };
        List.prototype.insert = function (index, value) {
            var s = this._source;
            if (index < s.length) {
                this._source.splice(index, 0, value);
            }
            else {
                this._source[index] = value;
            }
            this._onModified();
        };
        List.prototype.removeAt = function (index) {
            if (Utility_1.removeIndex(this._source, index)) {
                this._onModified();
                return true;
            }
            return false;
        };
        List.prototype.contains = function (item) {
            return Utility_1.contains(this._source, item, this._equalityComparer);
        };
        List.prototype.copyTo = function (target, index) {
            return Utility_1.copyTo(this._source, target, 0, index);
        };
        List.prototype.getEnumerator = function () {
            return new ArrayEnumerator_1.ArrayEnumerator(this._source);
        };
        List.prototype.forEach = function (action, useCopy) {
            var s = this._source;
            return Enumerator_1.forEach(useCopy ? s.slice() : s, action);
        };
        return List;
    }(CollectionBase_1.CollectionBase));
    exports.List = List;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = List;
});
//# sourceMappingURL=List.js.map