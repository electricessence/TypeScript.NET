/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Guarantees a number value or NaN instead.
 * @param value
 * @returns {number}
 */
export function numberOrNaN(value) {
    return isNaN(value) ? NaN : value;
}
//# sourceMappingURL=numberOrNaN.js.map