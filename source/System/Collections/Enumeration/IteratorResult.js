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
    var VOID0 = void 0;
    var IteratorResult = (function () {
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
        return IteratorResult;
    }());
    exports.IteratorResult = IteratorResult;
    (function (IteratorResult) {
        IteratorResult.Done = new IteratorResult(VOID0, VOID0, true);
        function GetDone() { return IteratorResult.Done; }
        IteratorResult.GetDone = GetDone;
    })(IteratorResult = exports.IteratorResult || (exports.IteratorResult = {}));
    exports.IteratorResult = IteratorResult;
    Object.freeze(IteratorResult);
    exports.default = IteratorResult;
});
//# sourceMappingURL=IteratorResult.js.map