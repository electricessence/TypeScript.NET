/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.systemexception%28v=vs.110%29.aspx
 */
'use strict';
import Exception from '../Exception';
const NAME = 'SystemException';
export default class SystemException extends Exception {
    getName() {
        return NAME;
    }
}
//# sourceMappingURL=SystemException.js.map