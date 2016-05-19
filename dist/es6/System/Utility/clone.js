/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../Types";
export default function clone(source, depth = 0) {
    if (depth < 0)
        return source;
    if (!Type.isObject(source))
        return source;
    var result;
    if (Array.isArray(source)) {
        result = source.slice();
        if (depth > 0) {
            for (let i = 0; i < result.length; i++) {
                result[i] = clone(result[i], depth - 1);
            }
        }
    }
    else {
        result = {};
        if (depth > 0)
            for (let k in source) {
                result[k] = clone(source[k], depth - 1);
            }
    }
    return result;
}
//# sourceMappingURL=clone.js.map