/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../ReadOnlyCollectionWrapper", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var ReadOnlyCollectionWrapper_1, extends_1, __extends, ReadOnlyArrayWrapper;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ReadOnlyCollectionWrapper_1_1) {
                ReadOnlyCollectionWrapper_1 = ReadOnlyCollectionWrapper_1_1;
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
            ReadOnlyArrayWrapper = /** @class */ (function (_super) {
                __extends(ReadOnlyArrayWrapper, _super);
                function ReadOnlyArrayWrapper(array) {
                    var _this = _super.call(this, array) || this;
                    _this.__getValueAt = function (i) { return array[i]; };
                    return _this;
                }
                ReadOnlyArrayWrapper.prototype._onDispose = function () {
                    _super.prototype._onDispose.call(this);
                    this.__getValueAt = null;
                };
                ReadOnlyArrayWrapper.prototype.getValueAt = function (index) {
                    this.throwIfDisposed();
                    return this.__getValueAt(index);
                };
                return ReadOnlyArrayWrapper;
            }(ReadOnlyCollectionWrapper_1.default));
            exports_1("default", ReadOnlyArrayWrapper);
        }
    };
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map