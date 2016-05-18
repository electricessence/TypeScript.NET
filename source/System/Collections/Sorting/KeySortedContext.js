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
        define(["require", "exports", "../../Compare", "./SortContext", "../../Functions"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Values = require("../../Compare");
    var SortContext_1 = require("./SortContext");
    var Functions_1 = require("../../Functions");
    var KeySortedContext = (function (_super) {
        __extends(KeySortedContext, _super);
        function KeySortedContext(next, _keySelector, order, comparer) {
            if (order === void 0) { order = 1; }
            if (comparer === void 0) { comparer = Values.compare; }
            _super.call(this, next, comparer, order);
            this._keySelector = _keySelector;
        }
        KeySortedContext.prototype.compare = function (a, b) {
            var _ = this, ks = _._keySelector;
            if (!ks || ks == Functions_1.Functions.Identity)
                return _super.prototype.compare.call(this, a, b);
            var d = Values.compare(ks(a), ks(b));
            if (d == 0 && _._next)
                return _._next.compare(a, b);
            return _._order * d;
        };
        return KeySortedContext;
    }(SortContext_1.SortContext));
    exports.KeySortedContext = KeySortedContext;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeySortedContext;
});
//# sourceMappingURL=KeySortedContext.js.map