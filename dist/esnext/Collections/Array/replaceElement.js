/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Finds and replaces a value from an array.
 * Replaces all instances unless a max count is specified.
 * @param array
 * @param old
 * @param newValue
 * @param maxCount
 * @returns {number} The number of times replaced.
 */
export default function replaceElement(array, old, newValue, maxCount) {
    if (maxCount === void 0) { maxCount = Infinity; }
    if (!array || !array.length || maxCount <= 0)
        return 0;
    if (!maxCount || isNaN(maxCount))
        maxCount = Infinity; // just in case.
    var count = 0;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === old) {
            array[i] = newValue;
            ++count;
            if (count == maxCount)
                break;
        }
    }
    return count;
}
//# sourceMappingURL=replaceElement.js.map