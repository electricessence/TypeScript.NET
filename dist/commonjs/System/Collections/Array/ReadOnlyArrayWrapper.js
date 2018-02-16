"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ReadOnlyCollectionWrapper_1 = require("../ReadOnlyCollectionWrapper");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var ReadOnlyArrayWrapper = /** @class */ (function (_super) {
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
exports.default = ReadOnlyArrayWrapper;
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map