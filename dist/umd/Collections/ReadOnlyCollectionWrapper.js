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
        define(["require", "exports", "tslib", "../Exceptions/ArgumentNullException", "./ReadOnlyCollectionBase", "./Enumeration/Enumerator", "../Reflection/isArrayLike"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var ReadOnlyCollectionBase_1 = require("./ReadOnlyCollectionBase");
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var isArrayLike_1 = require("../Reflection/isArrayLike");
    var ReadOnlyCollectionWrapper = /** @class */ (function (_super) {
        tslib_1.__extends(ReadOnlyCollectionWrapper, _super);
        function ReadOnlyCollectionWrapper(collection) {
            var _this = _super.call(this) || this;
            if (!collection)
                throw new ArgumentNullException_1.default('collection');
            var _ = _this;
            // Attempting to avoid contact with the original collection.
            if (isArrayLike_1.default(collection)) {
                _this.__getCount = function () { return collection.length; };
                _this.__getEnumerator = function () { return Enumerator_1.from(collection); };
            }
            else {
                _this.__getCount = function () { return collection.count; };
                _this.__getEnumerator = function () { return collection.getEnumerator(); };
            }
            return _this;
        }
        ReadOnlyCollectionWrapper.prototype._getCount = function () {
            this.throwIfDisposed();
            return this.__getCount();
        };
        ReadOnlyCollectionWrapper.prototype._getEnumerator = function () {
            this.throwIfDisposed();
            return this.__getEnumerator();
        };
        ReadOnlyCollectionWrapper.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            var _ = this;
            _.__getCount = null;
            _.__getEnumerator = null;
        };
        return ReadOnlyCollectionWrapper;
    }(ReadOnlyCollectionBase_1.default));
    exports.default = ReadOnlyCollectionWrapper;
});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map