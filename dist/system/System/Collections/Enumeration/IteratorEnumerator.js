/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register(["./SimpleEnumerableBase", "../../../extends"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SimpleEnumerableBase_1, extends_1;
    var __extends, VOID0, IteratorEnumerator;
    return {
        setters:[
            function (SimpleEnumerableBase_1_1) {
                SimpleEnumerableBase_1 = SimpleEnumerableBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }],
        execute: function() {
            __extends = extends_1.default;
            VOID0 = void 0;
            IteratorEnumerator = (function (_super) {
                __extends(IteratorEnumerator, _super);
                function IteratorEnumerator(_iterator, _isEndless) {
                    _super.call(this);
                    this._iterator = _iterator;
                    this._isEndless = _isEndless;
                }
                IteratorEnumerator.prototype.canMoveNext = function () {
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
                    this._iterator = VOID0;
                };
                IteratorEnumerator.prototype.getIsEndless = function () {
                    return this._isEndless && _super.prototype.getIsEndless.call(this);
                };
                return IteratorEnumerator;
            }(SimpleEnumerableBase_1.SimpleEnumerableBase));
            exports_1("IteratorEnumerator", IteratorEnumerator);
            exports_1("default",IteratorEnumerator);
        }
    }
});
//# sourceMappingURL=IteratorEnumerator.js.map