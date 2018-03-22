/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import isPromise from "./isPromise";
import wrap from "./wrap";
import { Fulfilled } from "../Promise";
function resolve(value) {
    return isPromise(value) ? wrap(value) : new Fulfilled(value);
}
export default resolve;
//# sourceMappingURL=resolve.js.map