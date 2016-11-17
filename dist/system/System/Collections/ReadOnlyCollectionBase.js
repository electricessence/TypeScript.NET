System.register(["./CollectionBase", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CollectionBase_1, extends_1, __extends, ReadOnlyCollectionBase;
    return {
        setters: [
            function (CollectionBase_1_1) {
                CollectionBase_1 = CollectionBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            __extends = extends_1.default;
            ReadOnlyCollectionBase = (function (_super) {
                __extends(ReadOnlyCollectionBase, _super);
                function ReadOnlyCollectionBase() {
                    return _super.apply(this, arguments) || this;
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
            exports_1("default", ReadOnlyCollectionBase);
        }
    };
});
//# sourceMappingURL=ReadOnlyCollectionBase.js.map