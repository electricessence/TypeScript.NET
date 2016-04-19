/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ReadOnlyCollectionBase = (function () {
        function ReadOnlyCollectionBase() {
        }
        Object.defineProperty(ReadOnlyCollectionBase.prototype, "count", {
            get: function () {
                return this._getCount();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReadOnlyCollectionBase.prototype, "isReadOnly", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        ReadOnlyCollectionBase.prototype.toArray = function () {
            return this.copyTo([]);
        };
        return ReadOnlyCollectionBase;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReadOnlyCollectionBase;
});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map