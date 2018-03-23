/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import ArgumentOutOfRangeException from "../../Exceptions/ArgumentOutOfRangeException";
import Integer from "../../Integer";
var SOURCE = 'source', DESTINATION = 'destination', SOURCE_INDEX = 'sourceIndex', DESTINATION_INDEX = 'destinationIndex';
/**
 * Copies one array to another.
 * @param source
 * @param destination
 * @param sourceIndex
 * @param destinationIndex
 * @param length An optional limit to stop copying.
 * @returns The destination array.
 */
export default function copyArrayTo(source, destination, sourceIndex, destinationIndex, length) {
    if (sourceIndex === void 0) { sourceIndex = 0; }
    if (destinationIndex === void 0) { destinationIndex = 0; }
    if (length === void 0) { length = Infinity; }
    if (!source)
        throw new ArgumentNullException(SOURCE);
    if (!destination)
        throw new ArgumentNullException(DESTINATION);
    Integer.assertZeroOrGreater(sourceIndex, SOURCE_INDEX);
    var sourceLength = source.length;
    if (!sourceLength)
        return destination;
    if (sourceIndex >= sourceLength)
        throw new ArgumentOutOfRangeException(SOURCE_INDEX, sourceIndex, 'Must be less than the length of the source array.');
    Integer.assertZeroOrGreater(destinationIndex, DESTINATION_INDEX);
    var maxLength = source.length - sourceIndex;
    if (isFinite(length) && length > maxLength)
        throw new ArgumentOutOfRangeException(SOURCE_INDEX, sourceIndex, 'Source index + length cannot exceed the length of the source array.');
    length = Math.min(length, maxLength);
    var newLength = destinationIndex + length;
    if (newLength > destination.length)
        destination.length = newLength;
    for (var i = 0; i < length; i++)
        destination[destinationIndex + i] = source[sourceIndex + i];
    return destination;
}
//# sourceMappingURL=copyArrayTo.js.map