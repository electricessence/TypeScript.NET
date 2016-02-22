'use strict';
import InvalidOperationException from '../Exceptions/InvalidOperationException';
const NAME = 'ObjectDisposedException';
export default class ObjectDisposedException extends InvalidOperationException {
    constructor(objectName, message = null, innerException = null) {
        super(message, innerException, (_) => {
            _.objectName = objectName;
        });
    }
    getName() {
        return NAME;
    }
    toString() {
        var _ = this, oName = _.objectName;
        oName = oName ? ('{' + oName + '} ') : '';
        return '[' + _.name + ': ' + oName + _.message + ']';
    }
    static throwIfDisposed(disposable, objectName, message) {
        if (disposable.wasDisposed)
            throw new ObjectDisposedException(objectName, message);
    }
}
//# sourceMappingURL=ObjectDisposedException.js.map