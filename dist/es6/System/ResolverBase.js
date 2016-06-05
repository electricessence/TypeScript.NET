/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { DisposableBase } from "./Disposable/DisposableBase";
import { ArgumentNullException } from "./Exceptions/ArgumentNullException";
import __extendsImport from "../extends";
const __extends = __extendsImport;
export class ResolverBase extends DisposableBase {
    constructor(_valueFactory, _trapExceptions, _allowReset) {
        super();
        this._valueFactory = _valueFactory;
        this._trapExceptions = _trapExceptions;
        this._allowReset = _allowReset;
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
        var _ = this;
        _.throwIfDisposed();
        if (_._isValueCreated === null)
            throw new Error("Recursion detected.");
        if (!_._isValueCreated && _._valueFactory) {
            _._isValueCreated = null;
            try {
                let c;
                if (!_._isValueCreated && (c = _._valueFactory)) {
                    _._isValueCreated = null;
                    if (!this._allowReset)
                        this._valueFactory = null;
                    var v = c();
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
        this._valueFactory = null;
        this._value = null;
        this._isValueCreated = null;
    }
    tryReset() {
        var _ = this;
        if (!_._valueFactory)
            return false;
        else {
            _._isValueCreated = false;
            _._value = null;
            _._error = void 0;
            return true;
        }
    }
}
export default ResolverBase;
//# sourceMappingURL=ResolverBase.js.map