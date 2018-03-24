/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IteratorResult = /** @class */ (function () {
        function IteratorResult(value, index, done) {
            if (done === void 0) { done = false; }
            this.value = value;
            if (typeof index == 'boolean')
                this.done = index;
            else {
                this.index = index;
                this.done = done;
            }
            Object.freeze(this);
        }
        IteratorResult.getDone = function () { return exports.CompletedIteratorResult; };
        return IteratorResult;
    }());
    exports.default = IteratorResult;
    var VOID0 = void 0;
    exports.CompletedIteratorResult = new IteratorResult(VOID0, VOID0, true);
});
//# sourceMappingURL=IteratorResult.js.map