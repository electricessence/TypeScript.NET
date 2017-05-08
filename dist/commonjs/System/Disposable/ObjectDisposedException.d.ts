/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { Error, InvalidOperationException } from "../Exceptions/InvalidOperationException";
import { IDisposableAware } from "./IDisposableAware";
export { Error };
export declare class ObjectDisposedException extends InvalidOperationException {
    readonly objectName: string;
    constructor(objectName: string, message?: string, innerException?: Error);
    protected getName(): string;
    toString(): string;
    static throwIfDisposed(disposable: IDisposableAware, objectName: string, message?: string): true | never;
}
export default ObjectDisposedException;
