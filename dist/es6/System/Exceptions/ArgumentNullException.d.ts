/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { ArgumentException, Error } from "./ArgumentException";
export { Error };
export declare class ArgumentNullException extends ArgumentException {
    constructor(paramName: string, message?: string, innerException?: Error);
    protected getName(): string;
}
export default ArgumentNullException;
