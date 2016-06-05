/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { ArgumentException } from "./ArgumentException";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = 'ArgumentNullException';
export class ArgumentNullException extends ArgumentException {
    constructor(paramName, message = '', innerException = null) {
        super(paramName, message, innerException);
    }
    getName() {
        return NAME;
    }
}
export default ArgumentNullException;
//# sourceMappingURL=ArgumentNullException.js.map