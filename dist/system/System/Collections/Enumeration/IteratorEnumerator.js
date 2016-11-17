System.register(["./SimpleEnumerableBase", "../../../extends"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SimpleEnumerableBase_1, extends_1, __extends, IteratorEnumerator;
    return {
        setters: [
            function (SimpleEnumerableBase_1_1) {
                SimpleEnumerableBase_1 = SimpleEnumerableBase_1_1;
            },
            function (extends_1_1) {
                extends_1 = extends_1_1;
            }
        ],
        execute: function () {
            __extends = extends_1.default;
            IteratorEnumerator = (function (_super) {
                __extends(IteratorEnumerator, _super);
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
            }(SimpleEnumerableBase_1.SimpleEnumerableBase));
            exports_1("IteratorEnumerator", IteratorEnumerator);
            exports_1("default", IteratorEnumerator);
        }
    };
});
//# sourceMappingURL=IteratorEnumerator.js.map