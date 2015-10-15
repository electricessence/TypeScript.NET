/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import ObjectDisposedException from './ObjectDisposedException';
export default class DisposableBase {
    constructor(_finalizer) {
        this._finalizer = _finalizer;
        this._wasDisposed = false;
    }
    get wasDisposed() {
        return this._wasDisposed;
    }
    throwIfDisposed(message, objectName = this._disposableObjectName) {
        if (this._wasDisposed)
            throw new ObjectDisposedException(objectName, message);
        return true;
    }
    dispose() {
        var _ = this;
        if (!_._wasDisposed) {
            _._wasDisposed = true;
            try {
                _._onDispose();
            }
            finally {
                if (_._finalizer)
                    _._finalizer();
            }
        }
    }
    _onDispose() {
    }
}
//# sourceMappingURL=DisposableBase.js.map