/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Enumeration/ArrayEnumerator", "../Compare", "./Array/Utility", "./Enumeration/forEach"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArrayEnumerator_1 = require("./Enumeration/ArrayEnumerator");
    var Compare_1 = require("../Compare");
    var Utility_1 = require("./Array/Utility");
    var forEach_1 = require("./Enumeration/forEach");
    var List = (function () {
        function List(source, _equalityComparer) {
            if (_equalityComparer === void 0) { _equalityComparer = Compare_1.areEqual; }
            this._equalityComparer = _equalityComparer;
            if (Array.isArray(source))
                this._source = source.slice();
            else {
                this._source = [];
                this.importValues(source);
            }
        }
        List.prototype.get = function (index) {
            return this._source[index];
        };
        List.prototype.set = function (index, value) {
            var s = this._source;
            if (index < s.length && !Compare_1.areEqual(value, s[index])) {
                s[index] = value;
                return true;
            }
            return false;
        };
        List.prototype.indexOf = function (item) {
            return Utility_1.indexOf(this._source, item, this._equalityComparer);
        };
        List.prototype.insert = function (index, value) {
            this._source.splice(index, 0, value);
        };
        List.prototype.removeAt = function (index) {
            Utility_1.removeIndex(this._source, index);
        };
        Object.defineProperty(List.prototype, "count", {
            get: function () {
                return this._source.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "isReadOnly", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        List.prototype.add = function (item) {
            this._source.push(item);
        };
        List.prototype.importValues = function (values) {
            var _this = this;
            forEach_1.default(values, function (v) { _this.add(v); });
        };
        List.prototype.remove = function (item) {
            return Utility_1.remove(this._source, item, Infinity, this._equalityComparer);
        };
        List.prototype.clear = function () {
            var len = this._source.length;
            this._source.length = 0;
            return len;
        };
        List.prototype.contains = function (item) {
            return Utility_1.contains(this._source, item, this._equalityComparer);
        };
        List.prototype.copyTo = function (array, index) {
            return Utility_1.copyTo(this._source, array, 0, index);
        };
        List.prototype.toArray = function () {
            return this.copyTo([]);
        };
        List.prototype.getEnumerator = function () {
            return new ArrayEnumerator_1.default(this._source);
        };
        return List;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = List;
});
//# sourceMappingURL=List.js.map