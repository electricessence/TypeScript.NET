"use strict";
var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
/**
 * A simplified stripped down enumerator that until disposed will infinitely return the provided factory.
 * This is analogous to a 'generator' and has a compatible interface.
 *
 *
 */
var IteratorEnumerator = (function (_super) {
    __extends(IteratorEnumerator, _super);
    /**
     * @param _iterator
     * @param _isEndless true and false are explicit where as undefined means 'unknown'.
     */
    function IteratorEnumerator(_iterator, _isEndless) {
        _super.call(this);
        this._iterator = _iterator;
        this._isEndless = _isEndless;
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
exports.IteratorEnumerator = IteratorEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IteratorEnumerator;