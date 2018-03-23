/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import PromiseCollection from "../PromiseCollection";
import resolve from "./resolve";
export default function resolveAll(first) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (!first && !rest.length)
        throw new ArgumentNullException("resolutions");
    return new PromiseCollection(((first) instanceof (Array) ? first : [first])
        .concat(rest)
        .map(function (v) { return resolve(v); }));
}
//# sourceMappingURL=resolveAll.js.map