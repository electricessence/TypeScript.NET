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
const VOID0 = void (0);
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
    }
    get current() { return this._current; }
    get index() { return this._index; }
    yieldReturn(value) {
        this._current = value;
        if (this._index === VOID0)
            this._index = 0;
        else
            this._index++;
        return true;
    }
    yieldBreak() {
        this._current = VOID0;
        this._index = VOID0;
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
    EnumeratorState[EnumeratorState["After"] = 2] = "After";
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
        var _ = this;
        _.throwIfDisposed();
        var y = _._yielder;
        _._yielder = null;
        _._state = EnumeratorState.Before;
        if (y)
            yielder(y);
    }
    moveNext() {
        var _ = this;
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
                        return false;
                    }
                case EnumeratorState.After:
                    return false;
            }
        }
        catch (e) {
            this.dispose();
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
    'return'(value) {
        try {
            return value === VOID0 || this._state === EnumeratorState.After
                ? IteratorResult.Done
                : new IteratorResult(value, VOID0, true);
        }
        finally {
            this.dispose();
        }
    }
    _onDispose() {
        var _ = this, disposer = _._disposer;
        _._initializer = null;
        _._disposer = null;
        var y = _._yielder;
        _._yielder = null;
        this._state = EnumeratorState.After;
        if (y)
            yielder(y);
        if (disposer)
            disposer();
    }
}
export default EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map