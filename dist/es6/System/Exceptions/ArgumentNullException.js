/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
'use strict';
import ArgumentException from './ArgumentException';
const NAME = 'ArgumentNullException';
export default class ArgumentNullException extends ArgumentException {
    constructor(paramName, message = '', innerException = null) {
        super(paramName, message, innerException);
    }
    getName() {
        return NAME;
    }
}
//# sourceMappingURL=ArgumentNullException.js.map