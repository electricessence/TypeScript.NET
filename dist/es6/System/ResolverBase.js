/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
// noinspection JSUnusedLocalSymbols
const NULL = null;
const NAME = "ResolverBase";
/**
 * The ResolverBase class handles resolving a factory method and detects recursion.
 * Since JS does not have a synchronization mechanism (lock or otherwise)
 * we have to prevent getValue from double triggering the value factory (optimistic concurrency)
 * or returning return a value that is intermediate between resolving and resolved.
 */
export class ResolverBase extends DisposableBase {
    constructor(_valueFactory, _trapExceptions, _allowReset = false) {
        super();
        this._valueFactory = _valueFactory;
        this._trapExceptions = _trapExceptions;
        this._allowReset = _allowReset;
        this._disposableObjectName = NAME;
        if (!_valueFactory)
            throw new ArgumentNullException("valueFactory");
        this._isValueCreated = false;
    }
    getError() {
        return this._error;
    }
    get error() {
        return this.getError();
    }
    getValue() {
        const _ = this;
        _.throwIfDisposed();
        if (_._isValueCreated === null)
            throw new Error("Recursion detected.");
        if (!_._isValueCreated && _._valueFactory) {
            _._isValueCreated = null; // Mark this as 'resolving'.
            try {
                let c;
                if (!_._isValueCreated && (c = _._valueFactory)) {
                    _._isValueCreated = null; // Mark this as 'resolving'.
                    if (!this._allowReset)
                        this._valueFactory = NULL;
                    const v = c();
                    _._value = v;
                    _._error = void 0;
                    return v;
                }
            }
            catch (ex) {
                _._error = ex;
                if (!_._trapExceptions)
                    throw ex;
            }
            finally {
                _._isValueCreated = true;
            }
        }
        return _._value;
    }
    get canReset() {
        return this._allowReset && !!this._valueFactory;
    }
    _onDispose() {
        this._valueFactory = NULL;
        this._value = NULL;
        this._isValueCreated = NULL;
    }
    tryReset() {
        const _ = this;
        if (!_._valueFactory)
            return false;
        else {
            _._isValueCreated = false;
            _._value = NULL;
            _._error = void 0;
            return true;
        }
    }
}
export default ResolverBase;
//# sourceMappingURL=ResolverBase.js.map