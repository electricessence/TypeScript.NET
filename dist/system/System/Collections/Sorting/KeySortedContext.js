/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["../../Compare", "./SortContext", "../../Functions", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Values, SortContext_1, Functions_1, extends_1;
    var __extends, KeySortedContext;
    return {
        setters:[
            function (Values_1) {
                Values = Values_1;
            },
            function (SortContext_1_1) {
                SortContext_1 = SortContext_1_1;
            },
            function (Functions_1_1) {
                Functions_1 = Functions_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            KeySortedContext = (function (_super) {
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
            exports_1("KeySortedContext", KeySortedContext);
            exports_1("default",KeySortedContext);
        }
    }
});
//# sourceMappingURL=KeySortedContext.js.map