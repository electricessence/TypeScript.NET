/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IMap } from "../../IMap";
/**
 * Takes a target object and applies all source values to it.
 * @param target
 * @param source
 * @returns {any}
 */
export declare function apply<T extends IMap<any>, U extends IMap<any>>(target: T, source: U): T & U;
/**
 * Takes a target object and ensures values exist.
 * @param target
 * @param defaults
 * @returns {any}
 */
export declare function ensure<T extends IMap<any>, U extends IMap<any>>(target: T, defaults: U): T & U;
/**
 * Make a copy of the source object.
 * @param source
 * @returns {Object}
 */
export declare function copy<T extends IMap<any>>(source: T): T;
/**
 * Takes two objects and creates another with the values of both.
 * B overwrites A.
 * @param a
 * @param b
 */
export declare function merge<A extends IMap<any>, B extends IMap<any>>(a: A, b: B): A & B;
/**
 * Removes any keys that don't exist on the keyMap.
 * @param target
 * @param keyMap
 */
export declare function trim<TResult extends IMap<any>>(target: IMap<any>, keyMap: TResult): void;
export declare function wipe(map: IMap<any>, depth?: number): void;
