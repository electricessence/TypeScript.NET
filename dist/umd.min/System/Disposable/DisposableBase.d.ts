import { IDisposableAware } from "./IDisposableAware";
import { Closure } from "../FunctionTypes";
export declare abstract class DisposableBase implements IDisposableAware {
    private readonly __finalizer;
    constructor(__finalizer?: Closure | null);
    private __wasDisposed;
    readonly wasDisposed: boolean;
    protected _disposableObjectName: string;
    protected throwIfDisposed(message?: string, objectName?: string): boolean;
    dispose(): void;
    protected _onDispose(): void;
}
export default DisposableBase;
