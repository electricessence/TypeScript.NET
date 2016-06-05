/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
import { Exception } from "../Exception";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = 'SystemException';
export class SystemException extends Exception {
    getName() {
        return NAME;
    }
}
export default SystemException;
//# sourceMappingURL=SystemException.js.map