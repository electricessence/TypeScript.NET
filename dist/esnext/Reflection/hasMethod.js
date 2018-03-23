/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import hasMemberOfType from "./hasMemberOfType";
export default function hasMethod(instance, property) {
    return hasMemberOfType(instance, property, "function" /* Function */);
}
//# sourceMappingURL=hasMethod.js.map