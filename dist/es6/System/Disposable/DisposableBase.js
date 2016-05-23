/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { ObjectDisposedException } from "./ObjectDisposedException";
export class DisposableBase {
    constructor(__finalizer) {
        this.__finalizer = __finalizer;
        this.__wasDisposed = false;
    }
    get wasDisposed() {
        return this.__wasDisposed;
    }
    throwIfDisposed(message, objectName = this._disposableObjectName) {
        if (this.__wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    }
    dispose() {
        var _ = this;
        if (!_.__wasDisposed) {
            _.__wasDisposed = true;
            try {
                _._onDispose();
            }
            finally {
                if (_.__finalizer) {
                    _.__finalizer();
                    _.__finalizer = void 0;
                }
            }
        }
    }
    _onDispose() { }
}
export default DisposableBase;
//# sourceMappingURL=DisposableBase.js.map