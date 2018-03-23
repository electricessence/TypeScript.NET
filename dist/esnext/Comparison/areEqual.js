/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import isTrueNaN from "../Reflection/isTrueNaN";
/**
 * Used for special comparison including NaN.
 * @param a
 * @param b
 * @param strict
 * @returns {boolean|any}
 */
export default function areEqual(a, b, strict) {
    if (strict === void 0) { strict = true; }
    return a === b
        || !strict && a == b
        || isTrueNaN(a) && isTrueNaN(b);
}
//# sourceMappingURL=areEqual.js.map