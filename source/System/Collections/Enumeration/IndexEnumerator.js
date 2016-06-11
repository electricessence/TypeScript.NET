/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./EnumeratorBase", "../../../extends"], factory);
    }
})(function (require, exports) {
    "use strict";
    var EnumeratorBase_1 = require("./EnumeratorBase");
    var extends_1 = require("../../../extends");
    var __extends = extends_1.default;
    var IndexEnumerator = (function (_super) {
        __extends(IndexEnumerator, _super);
        function IndexEnumerator(sourceFactory) {
            var source;
            _super.call(this, function () {
                source = sourceFactory();
                if (source && source.source) {
                    var len = source.length;
                    if (len < 0)
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
                source.pointer += source.step;
                return (current < len && current >= 0)
                    ? yielder.yieldReturn(source.source[current])
                    : yielder.yieldBreak();
            }, function () {
                if (source) {
                    source.source = null;
                }
            });
            this._isEndless = false;
        }
        return IndexEnumerator;
    }(EnumeratorBase_1.EnumeratorBase));
    exports.IndexEnumerator = IndexEnumerator;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IndexEnumerator;
});
//# sourceMappingURL=IndexEnumerator.js.map