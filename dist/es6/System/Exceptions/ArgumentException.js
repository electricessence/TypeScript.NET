'use strict';
import SystemException from './SystemException';
import { trim } from '../Text/Utility';
const NAME = 'ArgumentException';
export default class ArgumentException extends SystemException {
    constructor(paramName, message = null, innerException = null, beforeSealing) {
        var pn = paramName ? ('{' + paramName + '} ') : '';
        super(trim(pn + message), innerException, (_) => {
            _.paramName = paramName;
            if (beforeSealing)
                beforeSealing(_);
        });
    }
    getName() {
        return NAME;
    }
    toString() {
        var _ = this;
        return '[' + _.name + ': ' + _.message + ']';
    }
}
//# sourceMappingURL=ArgumentException.js.map