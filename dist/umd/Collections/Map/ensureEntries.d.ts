/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import IMap from "../../IMap";
/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
export default function ensureEntries<T extends IMap<any>, U extends IMap<any>>(target: T, defaults: U): T & U;
