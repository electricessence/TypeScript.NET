/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Enumeration/ArrayEnumerator", "../Compare", "./Array/Utility"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArrayEnumerator_1 = require("./Enumeration/ArrayEnumerator");
    var Compare_1 = require("../Compare");
    var Utility_1 = require("./Array/Utility");
    var ArrayCollection = (function () {
        function ArrayCollection(_source, _equalityComparer) {
            if (_source === void 0) { _source = []; }
            if (_equalityComparer === void 0) { _equalityComparer = Compare_1.areEqual; }
            this._source = _source;
            this._equalityComparer = _equalityComparer;
        }
        Object.defineProperty(ArrayCollection.prototype, "count", {
            get: function () {
                return this._source.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayCollection.prototype, "isReadOnly", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ArrayCollection.prototype.add = function (item) {
            this._source.push(item);
        };
        ArrayCollection.prototype.remove = function (item) {
            return Utility_1.remove(this._source, item, Infinity, this._equalityComparer);
        };
        ArrayCollection.prototype.clear = function () {
            var len = this._source.length;
            this._source.length = 0;
            return len;
        };
        ArrayCollection.prototype.contains = function (item) {
            return Utility_1.contains(this._source, item, this._equalityComparer);
        };
        ArrayCollection.prototype.copyTo = function (array, index) {
            return Utility_1.copyTo(this._source, array, 0, index);
        };
        ArrayCollection.prototype.toArray = function () {
            return this.copyTo([]);
        };
        ArrayCollection.prototype.getEnumerator = function () {
            return new ArrayEnumerator_1.default(this._source);
        };
        return ArrayCollection;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ArrayCollection;
});
//# sourceMappingURL=ArrayCollection.js.map