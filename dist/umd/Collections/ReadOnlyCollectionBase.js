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
        define(["require", "exports", "tslib", "./CollectionBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var CollectionBase_1 = require("./CollectionBase");
    var ReadOnlyCollectionBase = /** @class */ (function (_super) {
        tslib_1.__extends(ReadOnlyCollectionBase, _super);
        function ReadOnlyCollectionBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReadOnlyCollectionBase.prototype.getCount = function () {
            return this._getCount();
        };
        ReadOnlyCollectionBase.prototype.getIsReadOnly = function () {
            return true;
        };
        //noinspection JSUnusedLocalSymbols
        ReadOnlyCollectionBase.prototype._addInternal = function (entry) {
            return false;
        };
        //noinspection JSUnusedLocalSymbols
        ReadOnlyCollectionBase.prototype._removeInternal = function (entry, max) {
            return 0;
        };
        ReadOnlyCollectionBase.prototype._clearInternal = function () {
            return 0;
        };
        ReadOnlyCollectionBase.prototype.getEnumerator = function () {
            return this._getEnumerator();
        };
        return ReadOnlyCollectionBase;
    }(CollectionBase_1.default));
    exports.default = ReadOnlyCollectionBase;
});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map