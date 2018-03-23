/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import isObject from "../Reflection/isObject";
import copyArray from "../Collections/Array/copyArray";
import isArrayLike from "../Reflection/isArrayLike";
export default function clone(source, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth < 0 || !source || !isObject(source))
        return source;
    if (isArrayLike(source)) {
        // Make a copyArray first just in case there's some weird references.
        var result = copyArray(source);
        if (depth > 0) {
            var len = source.length;
            for (var i = 0; i < len; i++) {
                result[i] = clone(result[i], depth - 1);
            }
        }
        return result;
    }
    else {
        var result = {};
        if (depth > 0)
            for (var k in source) {
                //noinspection JSUnfilteredForInLoop
                result[k] = clone(source[k], depth - 1);
            }
        return result;
    }
}
//# sourceMappingURL=clone.js.map