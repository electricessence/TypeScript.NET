"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EnumeratorBase_1 = require("./EnumeratorBase");
var extends_1 = require("../../../extends");
// noinspection JSUnusedLocalSymbols
var __extends = extends_1.default;
var IndexEnumerator = /** @class */ (function (_super) {
    __extends(IndexEnumerator, _super);
    function IndexEnumerator(sourceFactory) {
        var _this = this;
        var source;
        _this = _super.call(this, function () {
            source = sourceFactory();
            if (source && source.source) {
                var len = source.length;
                if (len < 0) // Null is allowed but will exit immediately.
                    throw new Error("length must be zero or greater");
                if (!isFinite(len))
                    throw new Error("length must finite number");
                if (len && source.step === 0)
                    throw new Error("Invalid IndexEnumerator step value (0).");
                var pointer = source.pointer;
                if (!pointer)
                    pointer = 0;
                else if (pointer != Math.floor(pointer))
                    throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
                source.pointer = pointer;
                var step = source.step;
                if (!step)
                    step = 1;
                else if (step != Math.floor(step))
                    throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
                source.step = step;
            }
        }, function (yielder) {
            var len = (source && source.source) ? source.length : 0;
            if (!len || isNaN(len))
                return yielder.yieldBreak();
            var current = source.pointer;
            if (source.pointer == null)
                source.pointer = 0; // should never happen but is in place to negate compiler warnings.
            if (!source.step)
                source.step = 1; // should never happen but is in place to negate compiler warnings.
            source.pointer = source.pointer + source.step;
            return (current < len && current >= 0)
                ? yielder.yieldReturn(source.source[current])
                : yielder.yieldBreak();
        }, function () {
            if (source) {
                source.source = null;
            }
        }) || this;
        _this._isEndless = false;
        return _this;
    }
    return IndexEnumerator;
}(EnumeratorBase_1.EnumeratorBase));
exports.IndexEnumerator = IndexEnumerator;
exports.default = IndexEnumerator;
//# sourceMappingURL=IndexEnumerator.js.map