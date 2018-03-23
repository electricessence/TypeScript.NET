/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import Integer from "../../Integer";
/**
 * Replaces values of an array across a range of indexes.
 * @param array
 * @param value
 * @param start
 * @param stop
 */
export default function updateRange(array, value, start, stop) {
    if (start === void 0) { start = 0; }
    if (!array)
        return;
    Integer.assertZeroOrGreater(start, 'start');
    if (!stop && stop !== 0)
        stop = array.length;
    Integer.assert(stop, 'stop');
    if (stop < start)
        throw new ArgumentOutOfRangeException("stop", stop, "is less than start");
    for (var i = start; i < stop; i++) {
        array[i] = value;
    }
}
//# sourceMappingURL=updateRange.js.map