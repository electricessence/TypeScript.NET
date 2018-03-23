/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import SimpleEnumerableBase from "./SimpleEnumerableBase";
/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
var IteratorEnumerator = /** @class */ (function (_super) {
    tslib_1.__extends(IteratorEnumerator, _super);
    /**
     * @param _iterator
     * @param _isEndless true and false are explicit where as undefined means 'unknown'.
     */
    function IteratorEnumerator(_iterator, _isEndless) {
        var _this = _super.call(this) || this;
        _this._iterator = _iterator;
        _this._isEndless = _isEndless;
        return _this;
    }
    IteratorEnumerator.prototype._canMoveNext = function () {
        return this._iterator != null;
    };
    IteratorEnumerator.prototype.moveNext = function (value) {
        var _ = this;
        var i = _._iterator;
        if (i) {
            var r = arguments.length ? i.next(value) : i.next();
            _._current = r.value;
            if (r.done)
                _.dispose();
            else
                return true;
        }
        return false;
    };
    IteratorEnumerator.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._iterator = null;
    };
    IteratorEnumerator.prototype.getIsEndless = function () {
        return Boolean(this._isEndless) && _super.prototype.getIsEndless.call(this);
    };
    return IteratorEnumerator;
}(SimpleEnumerableBase));
export default IteratorEnumerator;
//# sourceMappingURL=IteratorEnumerator.js.map