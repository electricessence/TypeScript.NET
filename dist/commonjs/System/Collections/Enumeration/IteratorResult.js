"use strict";
var VOID0 = void 0;
var IteratorResult = (function () {
    function IteratorResult(value, index, done) {
        if (done === void 0) { done = false; }
        this.value = value;
        if (typeof index == "boolean")
            done = index;
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
Object.freeze(IteratorResult);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IteratorResult;
//# sourceMappingURL=IteratorResult.js.map