/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../Functions", "./SortContext", "../../Comparison/compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Functions_1 = require("../../Functions");
    var SortContext_1 = require("./SortContext");
    var compare_1 = require("../../Comparison/compare");
    var KeySortedContext = /** @class */ (function (_super) {
        tslib_1.__extends(KeySortedContext, _super);
        function KeySortedContext(next, _keySelector, order, comparer) {
            if (order === void 0) { order = 1 /* Ascending */; }
            if (comparer === void 0) { comparer = compare_1.default; }
            var _this = _super.call(this, next, comparer, order) || this;
            _this._keySelector = _keySelector;
            return _this;
        }
        KeySortedContext.prototype.compare = function (a, b) {
            var _ = this;
            var ks = _._keySelector;
            if (!ks || ks == Functions_1.default.Identity)
                return _super.prototype.compare.call(this, a, b);
            // We force <any> here since it can be a Primitive or IComparable<any>
            var d = compare_1.default(ks(a), ks(b));
            if (d == 0 && _._next)
                return _._next.compare(a, b);
            return _._order * d;
        };
        return KeySortedContext;
    }(SortContext_1.default));
    exports.default = KeySortedContext;
});
//# sourceMappingURL=KeySortedContext.js.map