/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ILazy } from "./ILazy";
import { Func } from "./FunctionTypes";
import { ResolverBase } from "./ResolverBase";
export declare class Lazy<T> extends ResolverBase<T> implements ILazy<T> {
    constructor(valueFactory: Func<T>, trapExceptions?: boolean, allowReset?: boolean);
    readonly isValueCreated: boolean;
    readonly value: T;
    equals(other: Lazy<T>): boolean;
    valueEquals(other: Lazy<T>): boolean;
    static create<T>(valueFactory: Func<T>, trapExceptions?: boolean, allowReset?: boolean): Lazy<T>;
}
export declare class ResettableLazy<T> extends Lazy<T> {
    constructor(valueFactory: Func<T>, trapExceptions?: boolean);
    static create<T>(valueFactory: Func<T>, trapExceptions?: boolean): ResettableLazy<T>;
}
export default Lazy;
