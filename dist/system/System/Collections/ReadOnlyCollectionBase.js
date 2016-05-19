/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./CollectionBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var CollectionBase_1;
    var ReadOnlyCollectionBase;
    return {
        setters:[
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            }],
        execute: function() {
            ReadOnlyCollectionBase = (function (_super) {
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
            exports_1("ReadOnlyCollectionBase", ReadOnlyCollectionBase);
            exports_1("default",ReadOnlyCollectionBase);
        }
    }
});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map