(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./IteratorResult"], function (require, exports) {
    "use strict";
    var IteratorResult_1 = require("./IteratorResult");
    var VOID0 = void 0;
    var SimpleEnumerableBase = (function () {
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
        Object.defineProperty(SimpleEnumerableBase.prototype, "canMoveNext", {
            get: function () {
                return this._canMoveNext();
            },
            enumerable: true,
            configurable: true
        });
        SimpleEnumerableBase.prototype.tryMoveNext = function (out) {
            if (this.moveNext()) {
                out(this._current);
                return true;
            }
            return false;
        };
        SimpleEnumerableBase.prototype.incrementIndex = function () {
            var i = this._index;
            this._index = i = isNaN(i) ? 0 : (i + 1);
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
        SimpleEnumerableBase.prototype.end = function () {
            this.dispose();
        };
        SimpleEnumerableBase.prototype['return'] = function (value) {
            try {
                return value !== VOID0 && this._canMoveNext()
                    ? new IteratorResult_1.IteratorResult(value, VOID0, true)
                    : IteratorResult_1.IteratorResult.Done;
            }
            finally {
                this.dispose();
            }
        };
        SimpleEnumerableBase.prototype.reset = function () {
            this._current = VOID0;
            this._index = NaN;
        };
        SimpleEnumerableBase.prototype.dispose = function () {
            this.reset();
        };
        SimpleEnumerableBase.prototype.getIsEndless = function () {
            return this._canMoveNext();
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
    exports.SimpleEnumerableBase = SimpleEnumerableBase;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleEnumerableBase;
});
//# sourceMappingURL=SimpleEnumerableBase.js.map