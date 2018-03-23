/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import updateRange from "./updateRange";
/**
 * Clears (sets to null) values of an array across a range of indexes.
 * @param array
 * @param start
 * @param stop
 */
export default function clearElements(array, start, stop) {
    if (start === void 0) { start = 0; }
    updateRange(array, null, start, stop);
}
//# sourceMappingURL=clearElements.js.map