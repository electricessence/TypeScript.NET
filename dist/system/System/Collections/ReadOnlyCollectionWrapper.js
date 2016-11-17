/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Exceptions/ArgumentNullException", "./ReadOnlyCollectionBase", "../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1, ReadOnlyCollectionBase_1, extends_1, __extends, ReadOnlyCollectionWrapper;
    return {
        setters: [
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ReadOnlyCollectionBase_1_1) {
                ReadOnlyCollectionBase_1 = ReadOnlyCollectionBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            __extends = extends_1.default;
            ReadOnlyCollectionWrapper = (function (_super) {
                __extends(ReadOnlyCollectionWrapper, _super);
                function ReadOnlyCollectionWrapper(c) {
                    var _this = _super.call(this) || this;
                    if (!c)
                        throw new ArgumentNullException_1.ArgumentNullException('collection');
                    var _ = _this;
                    _._getCount = function () { return c.count; };
                    _.getEnumerator = function () { return c.getEnumerator(); };
                    return _this;
                }
                return ReadOnlyCollectionWrapper;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyCollectionWrapper);
        }
    };
});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map