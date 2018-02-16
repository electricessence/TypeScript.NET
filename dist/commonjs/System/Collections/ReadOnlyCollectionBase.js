"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ReadOnlyCollectionBase = /** @class */ (function (_super) {
    __extends(ReadOnlyCollectionBase, _super);
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
}(CollectionBase_1.CollectionBase));
exports.ReadOnlyCollectionBase = ReadOnlyCollectionBase;
exports.default = ReadOnlyCollectionBase;
//# sourceMappingURL=ReadOnlyCollectionBase.js.map