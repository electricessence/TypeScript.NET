/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var VOID0 = void 0;
var IteratorEnumerator = (function (_super) {
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
exports.IteratorEnumerator = IteratorEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IteratorEnumerator;
//# sourceMappingURL=IteratorEnumerator.js.map