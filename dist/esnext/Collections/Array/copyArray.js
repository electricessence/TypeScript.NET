/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import init from "./initializeArray";
import copyArrayTo from "./copyArrayTo";
/**
 *
 * @param source
 * @param sourceIndex
 * @param length
 * @returns {any}
 */
export default function copyArray(source, sourceIndex, length) {
    if (sourceIndex === void 0) { sourceIndex = 0; }
    if (length === void 0) { length = Infinity; }
    if (!source)
        return source; // may have passed zero? undefined? or null?
    return copyArrayTo(source, init(Math.min(length, Math.max(source.length - sourceIndex, 0))), sourceIndex, 0, length);
}
//# sourceMappingURL=copyArray.js.map