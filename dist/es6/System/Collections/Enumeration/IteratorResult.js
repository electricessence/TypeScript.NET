/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
const VOID0 = void (0);
export class IteratorResult {
    constructor(value, index, done = false) {
        this.value = value;
        this.index = index;
        this.done = done;
        Object.freeze(this);
    }
}
(function (IteratorResult) {
    IteratorResult.Done = new IteratorResult(VOID0, VOID0, true);
    function GetDone(value) { return IteratorResult.Done; }
    IteratorResult.GetDone = GetDone;
})(IteratorResult || (IteratorResult = {}));
Object.freeze(IteratorResult);
export default IteratorResult;
//# sourceMappingURL=IteratorResult.js.map