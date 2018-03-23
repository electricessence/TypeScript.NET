/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import ReadOnlyCollectionWrapper from "../ReadOnlyCollectionWrapper";
var ReadOnlyArrayWrapper = /** @class */ (function (_super) {
    tslib_1.__extends(ReadOnlyArrayWrapper, _super);
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
}(ReadOnlyCollectionWrapper));
export default ReadOnlyArrayWrapper;
//# sourceMappingURL=ReadOnlyArrayWrapper.js.map