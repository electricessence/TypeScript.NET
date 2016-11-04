/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { Type } from "../../Types";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { ObjectPool } from "../../Disposable/ObjectPool";
import { IteratorResult } from "./IteratorResult";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
var yielderPool;
function yielder(recycle) {
    if (!yielderPool)
        yielderPool
            = new ObjectPool(40, () => new Yielder(), y => y.yieldBreak());
    if (!recycle)
        return yielderPool.take();
    yielderPool.add(recycle);
}
class Yielder {
    constructor() {
        this._current = VOID0;
        this._index = NaN;
    }
    get current() { return this._current; }
    get index() { return this._index; }
    yieldReturn(value) {
        this._current = value;
        if (isNaN(this._index))
            this._index = 0;
        else
            this._index++;
        return true;
    }
    yieldBreak() {
        this._current = VOID0;
        this._index = NaN;
        return false;
    }
    dispose() {
        this.yieldBreak();
    }
}
var EnumeratorState;
(function (EnumeratorState) {
    EnumeratorState[EnumeratorState["Before"] = 0] = "Before";
    EnumeratorState[EnumeratorState["Running"] = 1] = "Running";
    EnumeratorState[EnumeratorState["Completed"] = 2] = "Completed";
    EnumeratorState[EnumeratorState["Faulted"] = 3] = "Faulted";
    EnumeratorState[EnumeratorState["Interrupted"] = 4] = "Interrupted";
    EnumeratorState[EnumeratorState["Disposed"] = 5] = "Disposed";
})(EnumeratorState || (EnumeratorState = {}));
export class EnumeratorBase extends DisposableBase {
    constructor(_initializer, _tryGetNext, disposer, isEndless) {
        super();
        this._initializer = _initializer;
        this._tryGetNext = _tryGetNext;
        this.reset();
        if (Type.isBoolean(isEndless))
            this._isEndless = isEndless;
        else if (Type.isBoolean(disposer))
            this._isEndless = disposer;
        if (Type.isFunction(disposer))
            this._disposer = disposer;
    }
    get current() {
        var y = this._yielder;
        return y && y.current;
    }
    get index() {
        var y = this._yielder;
        return y && y.index;
    }
    get isEndless() {
        return this._isEndless;
    }
    reset() {
        const _ = this;
        _.throwIfDisposed();
        var y = _._yielder;
        _._yielder = null;
        _._state = EnumeratorState.Before;
        if (y)
            yielder(y);
    }
    _assertBadState() {
        const _ = this;
        switch (_._state) {
            case EnumeratorState.Faulted:
                _.throwIfDisposed("This enumerator caused a fault and was disposed.");
                break;
            case EnumeratorState.Disposed:
                _.throwIfDisposed("This enumerator was manually disposed.");
                break;
        }
    }
    moveNext() {
        const _ = this;
        _._assertBadState();
        try {
            switch (_._state) {
                case EnumeratorState.Before:
                    _._yielder = _._yielder || yielder();
                    _._state = EnumeratorState.Running;
                    var initializer = _._initializer;
                    if (initializer)
                        initializer();
                case EnumeratorState.Running:
                    if (_._tryGetNext(_._yielder)) {
                        return true;
                    }
                    else {
                        this.dispose();
                        _._state = EnumeratorState.Completed;
                        return false;
                    }
                default:
                    return false;
            }
        }
        catch (e) {
            this.dispose();
            _._state = EnumeratorState.Faulted;
            throw e;
        }
    }
    nextValue() {
        return this.moveNext()
            ? this.current
            : VOID0;
    }
    next() {
        return this.moveNext()
            ? new IteratorResult(this.current, this.index)
            : IteratorResult.Done;
    }
    end() {
        this._ensureDisposeState(EnumeratorState.Interrupted);
    }
    'return'(value) {
        const _ = this;
        _._assertBadState();
        try {
            return value === VOID0 || _._state === EnumeratorState.Completed || _._state === EnumeratorState.Interrupted
                ? IteratorResult.Done
                : new IteratorResult(value, VOID0, true);
        }
        finally {
            _.end();
        }
    }
    _ensureDisposeState(state) {
        const _ = this;
        if (!_.wasDisposed) {
            _.dispose();
            _._state = state;
        }
    }
    _onDispose() {
        const _ = this;
        _._isEndless = false;
        var disposer = _._disposer;
        _._initializer = null;
        _._disposer = null;
        var y = _._yielder;
        _._yielder = null;
        this._state = EnumeratorState.Disposed;
        if (y)
            yielder(y);
        if (disposer)
            disposer();
    }
}
export default EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map