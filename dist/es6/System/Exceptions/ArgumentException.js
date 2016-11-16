import { SystemException } from "./SystemException";
import { trim } from "../Text/Utility";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = 'ArgumentException';
export class ArgumentException extends SystemException {
    constructor(paramName, message, innerException, beforeSealing) {
        let pn = paramName ? ('{' + paramName + '} ') : '';
        super(trim(pn + (message || '')), innerException, (_) => {
            _.paramName = paramName;
            if (beforeSealing)
                beforeSealing(_);
        });
    }
    getName() {
        return NAME;
    }
}
export default ArgumentException;
//# sourceMappingURL=ArgumentException.js.map