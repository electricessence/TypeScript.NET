/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import applyEntries from "./applyEntries";
import copyEntries from "./copyEntries";
/**
 * Takes two objects and creates another with the values of both.
 * B overwrites A.
 * @param a
 * @param b
 */
export function mergeEntries(a, b) {
    return applyEntries(copyEntries(a), b);
}
//# sourceMappingURL=mergeEntries.js.map