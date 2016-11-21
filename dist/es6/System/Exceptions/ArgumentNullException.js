/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import { ArgumentException } from "./ArgumentException";
// noinspection JSUnusedLocalSymbols
const NAME = 'ArgumentNullException';
export class ArgumentNullException extends ArgumentException {
    constructor(paramName, message = `'${paramName}' is null (or undefined).`, innerException) {
        super(paramName, message, innerException);
    }
    getName() {
        return NAME;
    }
}
export default ArgumentNullException;
//# sourceMappingURL=ArgumentNullException.js.map