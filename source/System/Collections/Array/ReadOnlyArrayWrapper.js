/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Array/Utility", "../Exceptions/ArgumentNullException", "./Enumeration/Enumerator", "../ReadOnlyCollectionBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ArrayUtility = require("./Array/Utility");
    var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
    var Enumerator_1 = require("./Enumeration/Enumerator");
    var ReadOnlyCollectionBase_1 = require("../ReadOnlyCollectionBase");
    var ReadOnlyCollectionWrapper = (function (_super) {
        __extends(ReadOnlyCollectionWrapper, _super);
        function ReadOnlyCollectionWrapper(a) {
            _super.call(this);
            if (!a)
                throw new ArgumentNullException_1.default('collection');
            var _ = this;
            _._getCount = function () { return a.length; };
            _.contains = function (item) { return ArrayUtility.contains(a, item); };
            _.copyTo = function (array, index) { return ArrayUtility.copyTo(a, array, 0, index); };
            _.getEnumerator = function () { return Enumerator_1.from(a); };
            _.getValueAt = function (i) { return a[i]; };
        }
        return ReadOnlyCollectionWrapper;
    }(ReadOnlyCollectionBase_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ReadOnlyCollectionWrapper;
});
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map