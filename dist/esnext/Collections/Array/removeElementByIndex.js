/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Integer from "../../Integer";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
/**
 * Removes an entry at a specified index.
 * @param array
 * @param index
 * @returns {boolean} True if the value was able to be removed.
 */
export default function removeElementByIndex(array, index) {
    if (!array)
        throw new ArgumentNullException('array');
    Integer.assertZeroOrGreater(index, 'index');
    var exists = index < array.length;
    if (exists)
        array.splice(index, 1);
    return exists;
}
//# sourceMappingURL=removeElementByIndex.js.map