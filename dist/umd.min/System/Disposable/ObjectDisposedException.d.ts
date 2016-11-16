import { InvalidOperationException, Error } from "../Exceptions/InvalidOperationException";
import { IDisposableAware } from "./IDisposableAware";
export { Error };
export declare class ObjectDisposedException extends InvalidOperationException {
    readonly objectName: string;
    constructor(objectName: string, message?: string, innerException?: Error);
    protected getName(): string;
    toString(): string;
    static throwIfDisposed(disposable: IDisposableAware, objectName: string, message?: string): void;
}
export default ObjectDisposedException;
