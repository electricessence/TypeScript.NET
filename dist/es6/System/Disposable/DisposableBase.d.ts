/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IDisposableAware } from "./IDisposableAware";
export declare abstract class DisposableBase implements IDisposableAware {
    private _finalizer;
    constructor(_finalizer?: () => void);
    private _wasDisposed;
    wasDisposed: boolean;
    protected _disposableObjectName: string;
    protected throwIfDisposed(message?: string, objectName?: string): boolean;
    dispose(): void;
    protected _onDispose(): void;
}
export default DisposableBase;
