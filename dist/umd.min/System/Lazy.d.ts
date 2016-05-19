/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { ILazy } from "./ILazy";
import { Func } from "./FunctionTypes";
export declare class Lazy<T> extends DisposableBase implements ILazy<T> {
    private _closure;
    private _isValueCreated;
    private _value;
    constructor(_closure: Func<T>);
    isValueCreated: boolean;
    canReset: boolean;
    reset(throwIfCannotReset?: boolean): boolean;
    value: T;
    getValue(clearClosureReference?: boolean): T;
    protected _onDispose(): void;
    equals(other: Lazy<T>): boolean;
    valueEquals(other: Lazy<T>): boolean;
}
export default Lazy;
