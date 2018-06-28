/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { Func } from "./FunctionTypes";
/**
 * The ResolverBase class handles resolving a factory method and detects recursion.
 * Since JS does not have a synchronization mechanism (lock or otherwise)
 * we have to prevent getValue from double triggering the value factory (optimistic concurrency)
 * or returning return a value that is intermediate between resolving and resolved.
 */
export declare abstract class ResolverBase<T> extends DisposableBase {
    protected _valueFactory: Func<T>;
    private readonly _trapExceptions;
    private readonly _allowReset;
    protected _isValueCreated: boolean | null;
    protected _value: T | undefined;
    protected constructor(_valueFactory: Func<T>, _trapExceptions: boolean, _allowReset?: boolean);
    protected _error: any;
    protected getError(): any;
    readonly error: any;
    getValue(): T;
    readonly canReset: boolean;
    protected _onDispose(): void;
    tryReset(): boolean;
}
export default ResolverBase;
