/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import TypeOfValue from "./TypeOfValue";
/**
 * Returns true if the member matches the type.
 * @param instance
 * @param property
 * @param type
 * @returns {boolean}
 */
export default function hasMemberOfType<T>(instance: any, property: string, type: TypeOfValue): instance is T;
