import { InvalidOperationException } from "../Exceptions/InvalidOperationException";
import __extendsImport from "../../extends";
const __extends = __extendsImport;
const NAME = 'ObjectDisposedException';
export class ObjectDisposedException extends InvalidOperationException {
    constructor(objectName, message, innerException) {
        super(message || '', innerException, (_) => {
            _.objectName = objectName;
        });
    }
    getName() {
        return NAME;
    }
    toString() {
        const _ = this;
        let oName = _.objectName;
        oName = oName ? ('{' + oName + '} ') : '';
        return '[' + _.name + ': ' + oName + _.message + ']';
    }
    static throwIfDisposed(disposable, objectName, message) {
        if (disposable.wasDisposed)
            throw new ObjectDisposedException(objectName, message);
    }
}
export default ObjectDisposedException;
//# sourceMappingURL=ObjectDisposedException.js.map