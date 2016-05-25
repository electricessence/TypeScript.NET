/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./SimpleEnumerableBase"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SimpleEnumerableBase_1;
    var VOID0, InfiniteEnumerator;
    return {
        setters:[
            function (SimpleEnumerableBase_1_1) {
                SimpleEnumerableBase_1 = SimpleEnumerableBase_1_1;
            }],
        execute: function() {
            VOID0 = void 0;
            InfiniteEnumerator = (function (_super) {
                __extends(InfiniteEnumerator, _super);
                function InfiniteEnumerator(_factory) {
                    _super.call(this);
                    this._factory = _factory;
                }
                InfiniteEnumerator.prototype.canMoveNext = function () {
                    return this._factory != null;
                };
                InfiniteEnumerator.prototype.moveNext = function () {
                    var _ = this;
                    var f = _._factory;
                    if (f)
                        _._current = f(_._current, _.incrementIndex());
                    return f != VOID0;
                };
                InfiniteEnumerator.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    this._factory = VOID0;
                };
                return InfiniteEnumerator;
            }(SimpleEnumerableBase_1.SimpleEnumerableBase));
            exports_1("InfiniteEnumerator", InfiniteEnumerator);
            exports_1("default",InfiniteEnumerator);
        }
    }
});
//# sourceMappingURL=InfiniteEnumerator.js.map