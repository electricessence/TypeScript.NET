/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "../../Exceptions/ArgumentNullException", "../ReadOnlyCollectionBase", "../Enumeration/Enumerator", "../../../extends"], function (require, exports) {
    "use strict";
    var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
    var ReadOnlyCollectionBase_1 = require("../ReadOnlyCollectionBase");
    var Enumerator_1 = require("../Enumeration/Enumerator");
    var extends_1 = require("../../../extends");
    var __extends = extends_1.default;
    var ReadOnlyArrayWrapper = (function (_super) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReadOnlyArrayWrapper;
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map