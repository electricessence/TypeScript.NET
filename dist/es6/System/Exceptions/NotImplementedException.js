/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { SystemException } from "./SystemException";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = 'NotImplementedException';
export class NotImplementedException extends SystemException {
    getName() {
        return NAME;
    }
}
export default NotImplementedException;
//# sourceMappingURL=NotImplementedException.js.map