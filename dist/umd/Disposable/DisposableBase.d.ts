/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import IDisposableAware, { IDisposable } from "./IDisposableAware";
import { Closure } from "../FunctionTypes";
export { IDisposable };
declare abstract class DisposableBase implements IDisposableAware {
    protected readonly _disposableObjectName: string;
    private readonly __finalizer;
    constructor(_disposableObjectName: string, __finalizer?: Closure | null | undefined);
    private __wasDisposed;
    readonly wasDisposed: boolean;
    protected throwIfDisposed(message?: string, objectName?: string | null): true | never;
    dispose(): void;
    protected _onDispose(): void;
}
export default DisposableBase;
