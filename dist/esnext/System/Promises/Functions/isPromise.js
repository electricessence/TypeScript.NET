/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import Type from "../../Types";
export default function isPromise(value) {
    return Type.hasMemberOfType(value, "then", TypeOfValue.Function);
}
//# sourceMappingURL=isPromise.js.map