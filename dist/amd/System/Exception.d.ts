/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { IDisposable } from "./Disposable/IDisposable";
import { IMap } from "../IMap";
export interface Error {
    name: string;
    message: string;
}
/**
 * Represents errors that occur during application execution.
 */
export declare class Exception implements Error, IDisposable {
    readonly message: string;
    /**
     * A string representation of the error type.
     * The default is 'Error'.
     */
    readonly name: string;
    readonly stack: string;
    readonly data: IMap<any>;
    /**
     * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
     * @param message
     * @param innerException
     * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
     */
    constructor(message: string, innerException?: Error, beforeSealing?: (ex: any) => void);
    /**
     * A string representation of the error type.
     * The default is 'Error'.
     */
    protected getName(): string;
    /**
     * The string representation of the Exception instance.
     */
    toString(): string;
    protected toStringWithoutBrackets(): string;
    /**
     * Clears the data object.
     */
    dispose(): void;
}
export default Exception;
