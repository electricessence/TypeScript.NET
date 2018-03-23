/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import hasMember from "../Reflection/hasMember";
import areEqual from "./areEqual";
var VOID0 = void 0;
var COMPARE_TO = "compareTo";
export default function compare(a, b, strict) {
    if (strict === void 0) { strict = true; }
    if (areEqual(a, b, strict))
        return 0 /* Equal */;
    if (a && hasMember(a, COMPARE_TO))
        return a.compareTo(b); // If a has compareTo, use it.
    else if (b && hasMember(b, COMPARE_TO))
        return -b.compareTo(a); // a doesn't have compareTo? check if b does and invert.
    // Allow for special inequality..
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
        return 1 /* Greater */;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
        return -1 /* Less */;
    return NaN;
}
//# sourceMappingURL=compare.js.map