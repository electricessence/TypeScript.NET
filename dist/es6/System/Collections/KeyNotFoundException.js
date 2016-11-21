/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */
import { SystemException } from "../Exceptions/SystemException";
// noinspection JSUnusedLocalSymbols
const NAME = 'KeyNotFoundException ';
export class KeyNotFoundException extends SystemException {
    getName() {
        return NAME;
    }
}
export default KeyNotFoundException;
//# sourceMappingURL=KeyNotFoundException.js.map