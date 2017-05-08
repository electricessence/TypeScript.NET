/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./SimpleEnumerableBase", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SimpleEnumerableBase_1, extends_1, __extends, InfiniteEnumerator;
    return {
        setters: [
            function (SimpleEnumerableBase_1_1) {
                SimpleEnumerableBase_1 = SimpleEnumerableBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            // noinspection JSUnusedLocalSymbols
            __extends = extends_1.default;
            /**
             * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
             * This is analogous to a 'generator' and has a compatible interface.
             */
            InfiniteEnumerator = (function (_super) {
                __extends(InfiniteEnumerator, _super);
                /**
                 * See InfiniteValueFactory
                 * @param _factory
                 */
                function InfiniteEnumerator(_factory) {
                    var _this = _super.call(this) || this;
                    _this._factory = _factory;
                    return _this;
                }
                InfiniteEnumerator.prototype._canMoveNext = function () {
                    return this._factory != null;
                };
                InfiniteEnumerator.prototype.moveNext = function () {
                    var _ = this;
                    var f = _._factory;
                    if (f) {
                        _._current = f(_._current, _.incrementIndex());
                        return true;
                    }
                    return false;
                };
                InfiniteEnumerator.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    this._factory = null;
                };
                return InfiniteEnumerator;
            }(SimpleEnumerableBase_1.SimpleEnumerableBase));
            exports_1("InfiniteEnumerator", InfiniteEnumerator);
            exports_1("default", InfiniteEnumerator);
        }
    };
});
//# sourceMappingURL=InfiniteEnumerator.js.map