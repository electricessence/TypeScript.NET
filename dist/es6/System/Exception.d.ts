/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { IDisposable } from "./Disposable/IDisposable";
export declare class Exception implements Error, IDisposable {
    readonly: string;
    string: any;
    readonly: any;
    string: any;
    readonly: any;
    string: any;
    readonly: any;
    IMap<any>(): any;
    constructor(message: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    protected getName(): string;
    toString(): string;
    protected toStringWithoutBrackets(): string;
    dispose(): void;
}
export default Exception;
