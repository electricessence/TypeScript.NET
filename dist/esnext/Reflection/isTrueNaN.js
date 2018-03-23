/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Returns true if is a number and is NaN.
 * @param value
 * @returns {boolean}
 */
export default function isTrueNaN(value) {
    return typeof value === "number" /* Number */ && isNaN(value);
}
//# sourceMappingURL=isTrueNaN.js.map