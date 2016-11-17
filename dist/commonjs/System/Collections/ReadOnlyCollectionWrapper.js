/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var ReadOnlyCollectionBase_1 = require("./ReadOnlyCollectionBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var ReadOnlyCollectionWrapper = (function (_super) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadOnlyCollectionWrapper;
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map