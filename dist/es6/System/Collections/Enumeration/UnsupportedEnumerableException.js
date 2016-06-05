/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { SystemException } from "../../Exceptions/SystemException";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const NAME = 'UnsupportedEnumerableException';
export class UnsupportedEnumerableException extends SystemException {
    constructor(message) {
        super(message || "Unsupported enumerable.");
    }
    getName() {
        return NAME;
    }
}
export default UnsupportedEnumerableException;
//# sourceMappingURL=UnsupportedEnumerableException.js.map