/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from './Types';
var isTrueNaN = Type.isTrueNaN;
const VOID0 = void 0;
export function areEqual(a, b, strict = true) {
    return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
}
const COMPARE_TO = "compareTo";
export function compare(a, b, strict = true) {
    if (areEqual(a, b, strict))
        return 0;
    if (a && Type.hasMember(a, COMPARE_TO))
        return a.compareTo(b);
    else if (b && Type.hasMember(b, COMPARE_TO))
        return -b.compareTo(a);
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === VOID0))
        return 1;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === VOID0))
        return -1;
    return NaN;
}
//# sourceMappingURL=Compare.js.map