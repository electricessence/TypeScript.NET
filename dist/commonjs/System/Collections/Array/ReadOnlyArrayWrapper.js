/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ArgumentNullException_1 = require("../../Exceptions/ArgumentNullException");
var ReadOnlyCollectionBase_1 = require("../ReadOnlyCollectionBase");
var Enumerator_1 = require("../Enumeration/Enumerator");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var ReadOnlyArrayWrapper = (function (_super) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadOnlyArrayWrapper;
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map