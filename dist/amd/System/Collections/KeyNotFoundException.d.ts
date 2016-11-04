/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
import { SystemException, Error } from "../Exceptions/SystemException";
export { Error };
export declare class KeyNotFoundException extends SystemException {
    protected getName(): string;
}
export default KeyNotFoundException;
