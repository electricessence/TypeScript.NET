/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./SimpleEnumerableBase", "../../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
    var extends_1 = require("../../../extends");
    var __extends = extends_1.default;
    var VOID0 = void 0;
    var InfiniteEnumerator = (function (_super) {
        __extends(InfiniteEnumerator, _super);
        function InfiniteEnumerator(_factory) {
            _super.call(this);
            this._factory = _factory;
        }
        InfiniteEnumerator.prototype.canMoveNext = function () {
            return this._factory != null;
        };
        InfiniteEnumerator.prototype.moveNext = function () {
            var _ = this;
            var f = _._factory;
            if (f)
                _._current = f(_._current, _.incrementIndex());
            return f != VOID0;
        };
        InfiniteEnumerator.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._factory = VOID0;
        };
        return InfiniteEnumerator;
    }(SimpleEnumerableBase_1.SimpleEnumerableBase));
    exports.InfiniteEnumerator = InfiniteEnumerator;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InfiniteEnumerator;
});
//# sourceMappingURL=InfiniteEnumerator.js.map