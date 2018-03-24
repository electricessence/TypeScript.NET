/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import isPromise from "./isPromise";
import wrap from "./wrap";
import { Fulfilled } from "../Promise";
export default function resolve(value) {
    return isPromise(value) ? wrap(value) : new Fulfilled(value);
}
//# sourceMappingURL=resolve.js.map