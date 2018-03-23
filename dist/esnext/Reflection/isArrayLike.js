/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import hasMember from "./hasMember";
var LENGTH = "length";
export default function isArrayLike(instance) {
    var type = typeof instance;
    /*
     * NOTE:
     *
     * Functions:
     * Enumerating a function although it has a .length property will yield nothing or unexpected results.
     * Effectively, a function is not like an array.
     *
     * Strings:
     * Behave like arrays but don't have the same exact methods.
     */
    return instance instanceof Array
        || type == "string" /* String */
        || type == "function" /* Function */ && hasMember(instance, LENGTH);
}
//# sourceMappingURL=isArrayLike.js.map