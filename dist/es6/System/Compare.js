/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import Type from './Types';
var isTrueNaN = Type.isTrueNaN;
export function areEqual(a, b, strict = true) {
    return a === b || !strict && a == b || isTrueNaN(a) && isTrueNaN(b);
}
export function compare(a, b, strict = true) {
    if (areEqual(a, b, strict))
        return 0;
    if (a > b || strict && (a === 0 && b == 0 || a === null && b === undefined))
        return 1;
    if (b > a || strict && (b === 0 && a == 0 || b === null && a === undefined))
        return -1;
    return NaN;
}
//# sourceMappingURL=Compare.js.map