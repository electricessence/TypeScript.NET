System.register(["../Exceptions/ArgumentNullException", "./ReadOnlyCollectionBase", "./Enumeration/Enumerator", "../Types", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1, ReadOnlyCollectionBase_1, Enumerator_1, Types_1, extends_1, __extends, ReadOnlyCollectionWrapper;
    return {
        setters: [
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ReadOnlyCollectionBase_1_1) {
                ReadOnlyCollectionBase_1 = ReadOnlyCollectionBase_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            },
            function (Types_1_1) {
                Types_1 = Types_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            ReadOnlyCollectionWrapper = (function (_super) {
                __extends(ReadOnlyCollectionWrapper, _super);
                function ReadOnlyCollectionWrapper(collection) {
                    var _this = _super.call(this) || this;
                    if (!collection)
                        throw new ArgumentNullException_1.ArgumentNullException('collection');
                    var _ = _this;
                    // Attempting to avoid contact with the original collection.
                    if (Types_1.Type.isArrayLike(collection)) {
                        _._getCount = function () { return collection.length; };
                        _._getEnumerator = function () { return Enumerator_1.from(collection); };
                    }
                    else {
                        _._getCount = function () { return collection.count; };
                        _._getEnumerator = function () { return collection.getEnumerator(); };
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
                    this.__getCount = null;
                    this.__getEnumerator = null;
                };
                return ReadOnlyCollectionWrapper;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyCollectionWrapper);
        }
    };
});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map