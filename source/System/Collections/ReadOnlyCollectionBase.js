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
        define(["require", "exports", "./CollectionBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var CollectionBase_1 = require("./CollectionBase");
    var ReadOnlyCollectionBase = (function (_super) {
        __extends(ReadOnlyCollectionBase, _super);
        function ReadOnlyCollectionBase() {
            _super.apply(this, arguments);
        }
        ReadOnlyCollectionBase.prototype.getCount = function () {
            return this._getCount();
        };
        ReadOnlyCollectionBase.prototype.getIsReadOnly = function () {
            return true;
        };
        ReadOnlyCollectionBase.prototype._addInternal = function (entry) {
            return false;
        };
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
    }(CollectionBase_1.CollectionBase));
    exports.ReadOnlyCollectionBase = ReadOnlyCollectionBase;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReadOnlyCollectionBase;
});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map