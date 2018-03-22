/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
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
    IteratorResult.getDone = function () { return CompletedIteratorResult; };
    return IteratorResult;
}());
export default IteratorResult;
var VOID0 = void 0;
export var CompletedIteratorResult = new IteratorResult(VOID0, VOID0, true);
//# sourceMappingURL=IteratorResult.js.map