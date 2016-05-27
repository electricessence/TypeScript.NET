/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { Func } from "./FunctionTypes";
export declare abstract class ResolverBase<T> extends DisposableBase {
    protected _valueFactory: Func<T>;
    private _trapExceptions;
    private _allowReset;
    protected _isValueCreated: boolean;
    protected _value: T;
    constructor(_valueFactory: Func<T>, _trapExceptions: boolean, _allowReset?: boolean);
    protected _error: any;
    protected getError(): any;
    error: any;
    getValue(): T;
    canReset: boolean;
    protected _onDispose(): void;
    tryReset(): boolean;
}
export default ResolverBase;
