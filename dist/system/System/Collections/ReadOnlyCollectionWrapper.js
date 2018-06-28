/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Exceptions/ArgumentNullException", "./ReadOnlyCollectionBase", "./Enumeration/Enumerator", "../Types", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var ArgumentNullException_1, ReadOnlyCollectionBase_1, Enumerator_1, Types_1, extends_1, __extends, ReadOnlyCollectionWrapper;
    var __moduleName = context_1 && context_1.id;
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
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            ReadOnlyCollectionWrapper = /** @class */ (function (_super) {
                __extends(ReadOnlyCollectionWrapper, _super);
                function ReadOnlyCollectionWrapper(collection) {
                    var _this = _super.call(this) || this;
                    if (!collection)
                        throw new ArgumentNullException_1.ArgumentNullException('collection');
                    // Attempting to avoid contact with the original collection.
                    if (Types_1.Type.isArrayLike(collection)) {
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
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyCollectionWrapper);
        }
    };
});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map