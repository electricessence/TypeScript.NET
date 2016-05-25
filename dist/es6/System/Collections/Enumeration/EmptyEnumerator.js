/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IteratorResult } from "./IteratorResult";
import { Functions } from "../../Functions";
const VOID0 = void 0;
export const EmptyEnumerator = Object.freeze({
    current: VOID0,
    moveNext: Functions.False,
    nextValue: Functions.Blank,
    next: IteratorResult.GetDone,
    "return": IteratorResult.GetDone,
    reset: Functions.Blank,
    dispose: Functions.Blank,
    isEndless: false
});
export default EmptyEnumerator;
//# sourceMappingURL=EmptyEnumerator.js.map