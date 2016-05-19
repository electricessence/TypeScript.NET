/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { SystemException } from "../../Exceptions/SystemException";
export declare class UnsupportedEnumerableException extends SystemException {
    constructor(message?: string);
    protected getName(): string;
}
export default UnsupportedEnumerableException;
