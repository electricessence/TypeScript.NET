/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
export class Lazy extends DisposableBase {
    constructor(_closure) {
        super();
        this._closure = _closure;
        if (!_closure)
            throw new ArgumentNullException("_closure");
        this._disposableObjectName = 'Lazy';
    }
    get isValueCreated() {
        return this._isValueCreated;
    }
    get value() {
        return this.getValue();
    }
    get error() {
        return this._error;
    }
    getValue() {
        var _ = this;
        _.throwIfDisposed();
        try {
            if (!_._isValueCreated && _._closure) {
                var v = _._closure();
                _._value = v;
                _._error = void 0;
                return v;
            }
        }
        catch (ex) {
            _._error = ex;
            throw ex;
        }
        finally {
            _._onValueRequested();
            _._isValueCreated = true;
        }
        return _._value;
    }
    _onValueRequested() {
        this._closure = null;
    }
    _onDispose() {
        this._closure = null;
        this._value = null;
    }
    equals(other) {
        return this == other;
    }
    valueEquals(other) {
        return this.equals(other) || this.value === other.value;
    }
}
export class ResettableLazy extends Lazy {
    getValue(clearClosureReference) {
        var v = super.getValue();
        if (clearClosureReference)
            super._onValueRequested();
        return v;
    }
    _onValueRequested() {
    }
    get canReset() {
        return !this.wasDisposed && !!(this._closure);
    }
    reset(throwIfCannotReset) {
        var _ = this;
        if (throwIfCannotReset)
            _.throwIfDisposed();
        if (!_._closure) {
            if (throwIfCannotReset)
                throw new Error("Cannot reset.  This Lazy has already de-referenced its closure.");
            return false;
        }
        else {
            _._isValueCreated = false;
            _._value = null;
            _._error = void 0;
            return true;
        }
    }
}
export default Lazy;
//# sourceMappingURL=Lazy.js.map