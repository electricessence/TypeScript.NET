/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IMap from "../../IMap";
/**
 * Takes a target object and applies all source values to it.
 * @param target
 * @param source
 * @returns {any}
 */
export default function applyEntries<T extends IMap<any>, U extends IMap<any>>(target: T, source: U): T & U;
