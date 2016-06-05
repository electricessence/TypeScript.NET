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
});
//# sourceMappingURL=IteratorEnumerator.js.map