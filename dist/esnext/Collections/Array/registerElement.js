/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import areEqual from "../../Comparison/areEqual";
import indexOfElement from "./indexOfElement";
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
/**
 * Ensures a value exists within an array.  If not found, adds to the end.
 * @param array
 * @param item
 * @param {function?} equalityComparer
 * @returns {boolean}
 */
export default function registerElement(array, item, equalityComparer) {
    if (equalityComparer === void 0) { equalityComparer = areEqual; }
    if (!array)
        throw new ArgumentNullException('array');
    var len = array.length; // avoid querying .length more than once. *
    var ok = !len || indexOfElement(array, item, equalityComparer) != -1;
    if (ok)
        array[len] = item; // * push would query length again.
    return ok;
}
//# sourceMappingURL=registerElement.js.map