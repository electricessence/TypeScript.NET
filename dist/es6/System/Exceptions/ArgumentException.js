/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
import SystemException from './SystemException';
const NAME = 'ArgumentException';
export default class ArgumentException extends SystemException {
    constructor(paramName, message = null, innerException = null) {
        this.paramName = paramName;
        super(message, innerException);
    }
    getName() {
        return NAME;
    }
    toString() {
        var _ = this, pn = _.paramName;
        pn = pn ? ('{' + pn + '} ') : '';
        return '[' + _.name + ': ' + pn + _.message + ']';
    }
}
//# sourceMappingURL=ArgumentException.js.map