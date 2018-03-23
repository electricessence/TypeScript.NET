/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Integer from "../../Integer";
import init from "./initializeArray";
var COUNT = 'count';
/**
 * Simply repeats a value the number of times specified.
 * @param element
 * @param count
 * @returns {T[]}
 */
export function repeatElement(element, count) {
    Integer.assertPositive(count, COUNT);
    var result = init(count);
    for (var i = 0; i < count; i++)
        result[i] = element;
    return result;
}
//# sourceMappingURL=repeatElement.js.map