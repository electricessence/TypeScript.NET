/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import hasMember from "./hasMember";
/**
 * Returns true if the member matches the type.
 * @param instance
 * @param property
 * @param type
 * @returns {boolean}
 */
export default function hasMemberOfType(instance, property, type) {
    return hasMember(instance, property) && typeof (instance[property]) === type;
}
//# sourceMappingURL=hasMemberOfType.js.map