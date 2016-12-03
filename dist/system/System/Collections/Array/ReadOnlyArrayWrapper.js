System.register(["../../Exceptions/ArgumentNullException", "../ReadOnlyCollectionBase", "../Enumeration/Enumerator", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ArgumentNullException_1, ReadOnlyCollectionBase_1, Enumerator_1, extends_1, __extends, ReadOnlyArrayWrapper;
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
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            ReadOnlyArrayWrapper = (function (_super) {
                __extends(ReadOnlyArrayWrapper, _super);
                function ReadOnlyArrayWrapper(array) {
                    var _this = _super.call(this) || this;
                    if (!array)
                        throw new ArgumentNullException_1.ArgumentNullException('array');
                    var _ = _this;
                    _._getCount = function () { return array.length; };
                    _.getEnumerator = function () { return Enumerator_1.from(array); };
                    _.getValueAt = function (i) { return array[i]; };
                    return _this;
                }
                return ReadOnlyArrayWrapper;
            }(ReadOnlyCollectionBase_1.ReadOnlyCollectionBase));
            exports_1("default", ReadOnlyArrayWrapper);
        }
    };
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map