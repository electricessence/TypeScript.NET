/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import PromiseCollection from "../PromiseCollection";
export default function group(first) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (!first && !rest.length)
        throw new ArgumentNullException("promises");
    return new PromiseCollection(((first) instanceof (Array) ? first : [first])
        .concat(rest));
}
//# sourceMappingURL=group.js.map