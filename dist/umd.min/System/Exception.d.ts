/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { IDisposable } from "./Disposable/IDisposable";
import { IMap } from "./Collections/Dictionaries/IDictionary";
export interface Error {
    name: string;
    message: string;
}
export declare class Exception implements Error, IDisposable {
    readonly name: string;
    readonly message: string;
    readonly stack: string;
    readonly data: IMap<any>;
    constructor(message: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    protected getName(): string;
    toString(): string;
    protected toStringWithoutBrackets(): string;
    dispose(): void;
}
export default Exception;
