(function (dependencies, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(dependencies, factory);
    }
})(["require", "exports", "./SimpleEnumerableBase", "../../../extends"], function (require, exports) {
    "use strict";
    var SimpleEnumerableBase_1 = require("./SimpleEnumerableBase");
    var extends_1 = require("../../../extends");
    var __extends = extends_1.default;
    var InfiniteEnumerator = (function (_super) {
        __extends(InfiniteEnumerator, _super);
        function InfiniteEnumerator(_factory) {
            var _this = _super.call(this) || this;
            _this._factory = _factory;
            return _this;
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
});
//# sourceMappingURL=InfiniteEnumerator.js.map