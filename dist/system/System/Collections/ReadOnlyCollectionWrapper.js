/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../Exceptions/ArgumentNullException", "./ReadOnlyCollectionBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ArgumentNullException_1, ReadOnlyCollectionBase_1;
    var ReadOnlyCollectionWrapper;
    return {
        setters:[
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ReadOnlyCollectionBase_1_1) {
                ReadOnlyCollectionBase_1 = ReadOnlyCollectionBase_1_1;
            }],
        execute: function() {
            ReadOnlyCollectionWrapper = (function (_super) {
                __extends(ReadOnlyCollectionWrapper, _super);
                function ReadOnlyCollectionWrapper(c) {
                    _super.call(this);
                    if (!c)
                        throw new ArgumentNullException_1.ArgumentNullException('collection');
                    var _ = this;
                    _._getCount = function () { return c.count; };
                    _.getEnumerator = function () { return c.getEnumerator(); };
                }
                return ReadOnlyCollectionWrapper;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyCollectionWrapper);
        }
    }
});
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map