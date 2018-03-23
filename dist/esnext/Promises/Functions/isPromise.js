/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import hasMemberOfType from "../../Reflection/hasMemberOfType";
export default function isPromise(value) {
    return hasMemberOfType(value, "then", "function" /* Function */);
}
//# sourceMappingURL=isPromise.js.map