/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
var extends_1 = require("../../../extends");
var __extends = extends_1.default;
var InfiniteEnumerator = (function (_super) {
    __extends(InfiniteEnumerator, _super);
    function InfiniteEnumerator(_factory) {
        _super.call(this);
        this._factory = _factory;
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
exports.InfiniteEnumerator = InfiniteEnumerator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InfiniteEnumerator;
//# sourceMappingURL=InfiniteEnumerator.js.map