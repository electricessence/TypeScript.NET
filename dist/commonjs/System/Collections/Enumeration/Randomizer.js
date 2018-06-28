"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
var Enumerator_1 = require("./Enumerator");
/**
 * Creates a randomized version of the source.
 * Note: An iterator will always require a arrayCopy (buffer) to pull random results one by one.
 */
var Randomizer = /** @class */ (function (_super) {
    __extends(Randomizer, _super);
    function Randomizer(source, _allowReset) {
        if (_allowReset === void 0) { _allowReset = false; }
        var _this = _super.call(this) || this;
        _this._allowReset = _allowReset;
        _this._buffer = Enumerator_1.toArray(source);
        _this._pointer = _this._buffer.length;
        return _this;
    }
    Randomizer.prototype._canMoveNext = function () {
        var p = this._pointer;
        return !isNaN(p) && p > 0;
    };
    Randomizer.prototype.moveNext = function () {
        var _ = this;
        if (_._canMoveNext()) {
            var p = this._pointer, // Where were we?
            i = Math.floor(Math.random() * p), // Pick one.
            b = this._buffer, value = b[i], last = p - 1;
            b[i] = b[last]; // Take the last one and put it here.
            b[last] = null; // clear possible reference.
            if (!this._allowReset && last % 32 == 0) // Shrink?
                b.length = last;
            this._pointer = last;
            _._current = value;
            _.incrementIndex();
            return true;
        }
        return false;
    };
    Randomizer.prototype.reset = function () {
        if (this._allowReset) {
            if (!this._buffer)
                throw "Randomizer cannot be reset.  Already disposed.";
            this._pointer = this._buffer.length;
            _super.prototype.reset.call(this);
        }
        else
            throw "Reset not allowed.  To allow for reset, specify so when constructing.";
    };
    Randomizer.prototype.dispose = function () {
        _super.prototype.reset.call(this); // Note... don't call this.reset() :|
        var b = this._buffer;
        this._buffer = null;
        this._pointer = NaN;
        if (b)
            b.length = 0;
    };
    Randomizer.prototype.getIsEndless = function () {
        return false;
    };
    return Randomizer;
}(SimpleEnumerableBase_1.SimpleEnumerableBase));
exports.Randomizer = Randomizer;
//# sourceMappingURL=Randomizer.js.map