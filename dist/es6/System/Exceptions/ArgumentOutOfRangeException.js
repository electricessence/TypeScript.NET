import ArgumentException from './ArgumentException';
'use strict';
const NAME = 'ArgumentOutOfRangeException';
export default class ArgumentOutOfRangeException extends ArgumentException {
    constructor(paramName, actualValue, message = ' ', innerException = null) {
        super(paramName, message, innerException, (_) => {
            _.actualValue = actualValue;
        });
    }
    getName() {
        return NAME;
    }
}
//# sourceMappingURL=ArgumentOutOfRangeException.js.map