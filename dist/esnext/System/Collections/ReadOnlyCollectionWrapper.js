/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ReadOnlyCollectionBase } from "./ReadOnlyCollectionBase";
import { from as enumeratorFrom } from "./Enumeration/Enumerator";
import { Type } from "../Types";
var ReadOnlyCollectionWrapper = /** @class */ (function (_super) {
    tslib_1.__extends(ReadOnlyCollectionWrapper, _super);
    function ReadOnlyCollectionWrapper(collection) {
        var _this = _super.call(this) || this;
        if (!collection)
            throw new ArgumentNullException('collection');
        var _ = _this;
        // Attempting to avoid contact with the original collection.
        if (Type.isArrayLike(collection)) {
            _this.__getCount = function () { return collection.length; };
            _this.__getEnumerator = function () { return enumeratorFrom(collection); };
        }
        else {
            _this.__getCount = function () { return collection.count; };
            _this.__getEnumerator = function () { return collection.getEnumerator(); };
        }
        return _this;
    }
    ReadOnlyCollectionWrapper.prototype._getCount = function () {
        this.throwIfDisposed();
        return this.__getCount();
    };
    ReadOnlyCollectionWrapper.prototype._getEnumerator = function () {
        this.throwIfDisposed();
        return this.__getEnumerator();
    };
    ReadOnlyCollectionWrapper.prototype._onDispose = function () {
        _super.prototype._onDispose.call(this);
        var _ = this;
        _.__getCount = null;
        _.__getEnumerator = null;
    };
    return ReadOnlyCollectionWrapper;
}(ReadOnlyCollectionBase));
export default ReadOnlyCollectionWrapper;
//# sourceMappingURL=ReadOnlyCollectionWrapper.js.map