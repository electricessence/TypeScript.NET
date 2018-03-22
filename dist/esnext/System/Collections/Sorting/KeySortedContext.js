/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import * as tslib_1 from "tslib";
import * as Values from "../../Compare";
import SortContext from "./SortContext";
import Functions from "../../Functions";
var KeySortedContext = /** @class */ (function (_super) {
    tslib_1.__extends(KeySortedContext, _super);
    function KeySortedContext(next, _keySelector, order, comparer) {
        if (order === void 0) { order = 1 /* Ascending */; }
        if (comparer === void 0) { comparer = Values.compare; }
        var _this = _super.call(this, next, comparer, order) || this;
        _this._keySelector = _keySelector;
        return _this;
    }
    KeySortedContext.prototype.compare = function (a, b) {
        var _ = this;
        var ks = _._keySelector;
        if (!ks || ks == Functions.Identity)
            return _super.prototype.compare.call(this, a, b);
        // We force <any> here since it can be a Primitive or IComparable<any>
        var d = Values.compare(ks(a), ks(b));
        if (d == 0 && _._next)
            return _._next.compare(a, b);
        return _._order * d;
    };
    return KeySortedContext;
}(SortContext));
export default KeySortedContext;
//# sourceMappingURL=KeySortedContext.js.map