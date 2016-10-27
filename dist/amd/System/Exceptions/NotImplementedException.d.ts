/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { SystemException, Error } from "./SystemException";
export { Error };
export declare class NotImplementedException extends SystemException {
    protected getName(): string;
}
export default NotImplementedException;
