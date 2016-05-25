/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./IteratorResult"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var IteratorResult_1;
    var VOID0, SimpleEnumerableBase;
    return {
        setters:[
            function (IteratorResult_1_1) {
                IteratorResult_1 = IteratorResult_1_1;
            }],
        execute: function() {
            VOID0 = void 0;
            SimpleEnumerableBase = (function () {
                function SimpleEnumerableBase() {
                    this.reset();
                }
                Object.defineProperty(SimpleEnumerableBase.prototype, "current", {
                    get: function () {
                        return this._current;
                    },
                    enumerable: true,
                    configurable: true
                });
                SimpleEnumerableBase.prototype.incrementIndex = function () {
                    var i = this._index;
                    this._index = i = i === VOID0 ? 0 : (i + 1);
                    return i;
                };
                SimpleEnumerableBase.prototype.nextValue = function () {
                    this.moveNext();
                    return this._current;
                };
                SimpleEnumerableBase.prototype.next = function () {
                    return this.moveNext()
                        ? new IteratorResult_1.IteratorResult(this._current, this._index)
                        : IteratorResult_1.IteratorResult.Done;
                };
                SimpleEnumerableBase.prototype['return'] = function (value) {
                    try {
                        return value !== VOID0 && this.canMoveNext()
                            ? new IteratorResult_1.IteratorResult(value, VOID0, true)
                            : IteratorResult_1.IteratorResult.Done;
                    }
                    finally {
                        this.dispose();
                    }
                };
                SimpleEnumerableBase.prototype.reset = function () {
                    this._current = VOID0;
                    this._index = VOID0;
                };
                SimpleEnumerableBase.prototype.dispose = function () {
                    this.reset();
                };
                SimpleEnumerableBase.prototype.getIsEndless = function () {
                    return this.canMoveNext();
                };
                Object.defineProperty(SimpleEnumerableBase.prototype, "isEndless", {
                    get: function () {
                        return this.getIsEndless();
                    },
                    enumerable: true,
                    configurable: true
                });
                return SimpleEnumerableBase;
            }());
            exports_1("SimpleEnumerableBase", SimpleEnumerableBase);
            exports_1("default",SimpleEnumerableBase);
        }
    }
});
//# sourceMappingURL=SimpleEnumerableBase.js.map