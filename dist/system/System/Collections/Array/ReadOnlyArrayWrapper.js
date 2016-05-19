/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Exceptions/ArgumentNullException", "../ReadOnlyCollectionBase", "../Enumeration/Enumerator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ArgumentNullException_1, ReadOnlyCollectionBase_1, Enumerator_1;
    var ReadOnlyArrayWrapper;
    return {
        setters:[
            function (ArgumentNullException_1_1) {
                ArgumentNullException_1 = ArgumentNullException_1_1;
            },
            function (ReadOnlyCollectionBase_1_1) {
                ReadOnlyCollectionBase_1 = ReadOnlyCollectionBase_1_1;
            },
            function (Enumerator_1_1) {
                Enumerator_1 = Enumerator_1_1;
            }],
        execute: function() {
            ReadOnlyArrayWrapper = (function (_super) {
                __extends(ReadOnlyArrayWrapper, _super);
                function ReadOnlyArrayWrapper(array) {
                    _super.call(this);
                    if (!array)
                        throw new ArgumentNullException_1.ArgumentNullException('array');
                    var _ = this;
                    _._getCount = function () { return array.length; };
                    _.getEnumerator = function () { return Enumerator_1.from(array); };
                    _.getValueAt = function (i) { return array[i]; };
                }
                return ReadOnlyArrayWrapper;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyArrayWrapper);
        }
    }
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map