/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { ILazy } from "./ILazy";
import { Func } from "./FunctionTypes";
export declare class Lazy<T> extends DisposableBase implements ILazy<T> {
    protected _closure: Func<T>;
    protected _isValueCreated: boolean;
    protected _value: T;
    constructor(_closure: Func<T>);
    isValueCreated: boolean;
    value: T;
    protected _error: any;
    error: any;
    getValue(): T;
    protected _onValueRequested(): void;
    protected _onDispose(): void;
    equals(other: Lazy<T>): boolean;
    valueEquals(other: Lazy<T>): boolean;
}
export declare class ResettableLazy<T> extends Lazy<T> {
    getValue(clearClosureReference?: boolean): T;
    protected _onValueRequested(): void;
    canReset: boolean;
    reset(throwIfCannotReset?: boolean): boolean;
}
export default Lazy;
