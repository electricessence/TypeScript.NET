/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IndexEnumerator } from "./IndexEnumerator";
import { Type } from "../../Types";
export class ArrayEnumerator extends IndexEnumerator {
    constructor(arrayOrFactory, start = 0, step = 1) {
        super(() => {
            var array = Type.isFunction(arrayOrFactory) ? arrayOrFactory() : arrayOrFactory;
            return {
                source: array,
                pointer: start,
                length: array ? array.length : 0,
                step: step
            };
        });
    }
}
export default ArrayEnumerator;
//# sourceMappingURL=ArrayEnumerator.js.map