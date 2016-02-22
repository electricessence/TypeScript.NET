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