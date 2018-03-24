/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Enumeration/Enumerator", "./CollectionBase", "./Enumeration/EnumeratorBase", "../Reflection/isArrayLike", "../Comparison/areEqual", "./Array/removeElement", "./Array/indexOfElement", "./Array/removeElementByIndex", "./Array/copyArrayTo", "./Array/containsElement"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var CollectionBase_1 = require("./CollectionBase");
    var EnumeratorBase_1 = require("./Enumeration/EnumeratorBase");
    var isArrayLike_1 = require("../Reflection/isArrayLike");
    var areEqual_1 = require("../Comparison/areEqual");
    var removeElement_1 = require("./Array/removeElement");
    var indexOfElement_1 = require("./Array/indexOfElement");
    var removeElementByIndex_1 = require("./Array/removeElementByIndex");
    var copyArrayTo_1 = require("./Array/copyArrayTo");
    var containsElement_1 = require("./Array/containsElement");
    var VOID0 = void 0;
    var List = /** @class */ (function (_super) {
        tslib_1.__extends(List, _super);
        function List(source, equalityComparer) {
            if (equalityComparer === void 0) { equalityComparer = areEqual_1.default; }
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
            return removeElement_1.default(this._source, entry, max, this._equalityComparer);
        };
        List.prototype._clearInternal = function () {
            var len = this._source.length;
            this._source.length = 0;
            return len;
        };
        List.prototype._importEntries = function (entries) {
            if (isArrayLike_1.default(entries)) {
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
            if (index < s.length && areEqual_1.default(value, s[index]))
                return false;
            s[index] = value;
            this._signalModification(true);
            return true;
        };
        List.prototype.indexOf = function (item) {
            return indexOfElement_1.default(this._source, item, this._equalityComparer);
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
            if (removeElementByIndex_1.default(this._source, index)) {
                this._signalModification(true);
                return true;
            }
            return false;
        };
        List.prototype.contains = function (item) {
            return containsElement_1.default(this._source, item, this._equalityComparer);
        };
        List.prototype.copyTo = function (target, index) {
            return copyArrayTo_1.default(this._source, target, 0, index);
        };
        List.prototype.getEnumerator = function () {
            var _ = this;
            _.throwIfDisposed();
            var source, index, version;
            return new EnumeratorBase_1.default(function () {
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
    }(CollectionBase_1.default));
    exports.default = List;
});
//# sourceMappingURL=List.js.map