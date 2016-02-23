/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';
import DisposableBase from './Disposable/DisposableBase';
export default class Lazy extends DisposableBase {
    constructor(_closure) {
        super();
        this._closure = _closure;
        this._disposableObjectName = 'Lazy';
    }
    get isValueCreated() {
        return this._isValueCreated;
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
            return true;
        }
    }
    get value() {
        return this.getValue();
    }
    getValue(clearClosureReference) {
        var _ = this;
        _.throwIfDisposed();
        try {
            if (!_._isValueCreated && _._closure) {
                var v = _._closure();
                _._value = v;
                _._isValueCreated = true;
                return v;
            }
        }
        finally {
            if (clearClosureReference)
                _._closure = null;
        }
        return _._value;
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
//# sourceMappingURL=Lazy.js.map