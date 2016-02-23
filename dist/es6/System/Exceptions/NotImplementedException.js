/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
'use strict';
import SystemException from './SystemException';
const NAME = 'NotImplementedException';
export default class NotImplementedException extends SystemException {
    getName() {
        return NAME;
    }
}
//# sourceMappingURL=NotImplementedException.js.map