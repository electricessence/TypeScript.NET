/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
import { copy } from "../Collections/Array/copy";
export default function clone(source, depth = 0) {
    if (depth < 0)
        return source;
    // return primitives as is.
    if (!Type.isObject(source))
        return source;
    if (Type.isArrayLike(source)) {
        // Make a copy first just in case there's some weird references.
        const result = copy(source);
        if (depth > 0) {
            const len = source.length;
            for (let i = 0; i < len; i++) {
                result[i] = clone(result[i], depth - 1);
            }
        }
        return result;
    }
    else {
        const result = {};
        if (depth > 0)
            for (let k in source) {
                //noinspection JSUnfilteredForInLoop
                result[k] = clone(source[k], depth - 1);
            }
        return result;
    }
}
//# sourceMappingURL=clone.js.map