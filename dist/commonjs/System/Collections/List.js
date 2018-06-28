"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Compare_1 = require("../Compare");
var Utility_1 = require("./Array/Utility");
var Enumerator_1 = require("./Enumeration/Enumerator");
var Types_1 = require("../Types");
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var VOID0 = void 0;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(source, equalityComparer) {
        if (equalityComparer === void 0) { equalityComparer = Compare_1.areEqual; }
        var _this = _super.call(this, VOID0, equalityComparer) || this;
        if ((source) instanceof (Array)) {
            _this._source = source.slice();
        }
        else {
            _this._source = [];
            _this._importEntries(source);
        }
        return _this;
    }
    List.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        this._source = null;
    };
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
        this._signalModification(true);
        return true;
    };
    List.prototype.indexOf = function (item) {
        return Utility_1.indexOf(this._source, item, this._equalityComparer);
    };
    List.prototype.insert = function (index, value) {
        var _ = this;
        var s = _._source;
        if (index < s.length) {
            _._source.splice(index, 0, value);
        }
        else {
            _._source[index] = value;
        }
        _._signalModification(true);
    };
    List.prototype.removeAt = function (index) {
        if (Utility_1.removeIndex(this._source, index)) {
            this._signalModification(true);
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
        var _ = this;
        _.throwIfDisposed();
        var source, index, version;
        return new EnumeratorBase_1.EnumeratorBase(function () {
            source = _._source;
            version = _._version;
            index = 0;
        }, function (yielder) {
            if (index)
                _.throwIfDisposed();
            else if (_.wasDisposed) {
                // We never actually started? Then no biggie.
                return yielder.yieldBreak();
            }
            _.assertVersion(version);
            if (index >= source.length) // Just in case the size changes as we enumerate use '>='.
                return yielder.yieldBreak();
            return yielder.yieldReturn(source[index++]);
        });
    };
    /**
     * Sorts the underlying array.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    List.prototype.sort = function (compareFn) {
        this._source.sort(compareFn);
        return this;
    };
    List.prototype.forEach = function (action, useCopy) {
        var s = this._source;
        return Enumerator_1.forEach(useCopy ? s.slice() : this, action);
    };
    return List;
}(CollectionBase_1.CollectionBase));
exports.List = List;
exports.default = List;
//# sourceMappingURL=List.js.map