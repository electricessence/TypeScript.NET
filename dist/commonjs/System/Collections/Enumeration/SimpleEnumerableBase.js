"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var IteratorResult_1 = require("./IteratorResult");
var VOID0 = void 0;
var SimpleEnumerableBase = /** @class */ (function () {
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
        return ++this._index;
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
        this._index = -1;
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
exports.default = SimpleEnumerableBase;
//# sourceMappingURL=SimpleEnumerableBase.js.map