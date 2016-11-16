import { Type } from "../../Types";
import { DisposableBase } from "../../Disposable/DisposableBase";
import { ObjectPool } from "../../Disposable/ObjectPool";
import { IteratorResult } from "./IteratorResult";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;
const VOID0 = void 0;
let yielderPool;
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
const NAME = "EnumeratorBase";
export class EnumeratorBase extends DisposableBase {
    constructor(_initializer, _tryGetNext, disposer, isEndless) {
        super();
        this._initializer = _initializer;
        this._tryGetNext = _tryGetNext;
        this._disposableObjectName = NAME;
        this.reset();
        if (Type.isBoolean(isEndless))
            this._isEndless = isEndless;
        else if (Type.isBoolean(disposer))
            this._isEndless = disposer;
        if (Type.isFunction(disposer))
            this._disposer = disposer;
    }
    get current() {
        const y = this._yielder;
        return y && y.current;
    }
    get index() {
        const y = this._yielder;
        return y ? y.index : NaN;
    }
    get isEndless() {
        return this._isEndless;
    }
    reset() {
        const _ = this;
        _.throwIfDisposed();
        const y = _._yielder;
        _._yielder = null;
        _._state = 0;
        if (y)
            yielder(y);
    }
    _assertBadState() {
        const _ = this;
        switch (_._state) {
            case 3:
                _.throwIfDisposed("This enumerator caused a fault and was disposed.");
                break;
            case 5:
                _.throwIfDisposed("This enumerator was manually disposed.");
                break;
        }
    }
    tryGetCurrent(out) {
        this._assertBadState();
        if (this._state === 1) {
            out(this.current);
            return true;
        }
        return false;
    }
    get canMoveNext() {
        return this._state < 2;
    }
    moveNext() {
        const _ = this;
        _._assertBadState();
        try {
            switch (_._state) {
                case 0:
                    _._yielder = _._yielder || yielder();
                    _._state = 1;
                    const initializer = _._initializer;
                    if (initializer)
                        initializer();
                case 1:
                    if (_._tryGetNext(_._yielder)) {
                        return true;
                    }
                    else {
                        this.dispose();
                        _._state = 2;
                        return false;
                    }
                default:
                    return false;
            }
        }
        catch (e) {
            this.dispose();
            _._state = 3;
            throw e;
        }
    }
    tryMoveNext(out) {
        if (this.moveNext()) {
            out(this.current);
            return true;
        }
        return false;
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
        this._ensureDisposeState(4);
    }
    'return'(value) {
        const _ = this;
        _._assertBadState();
        try {
            return value === VOID0 || _._state === 2 || _._state === 4
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
        const disposer = _._disposer;
        _._initializer = null;
        _._disposer = null;
        const y = _._yielder;
        _._yielder = null;
        this._state = 5;
        if (y)
            yielder(y);
        if (disposer)
            disposer();
    }
}
export default EnumeratorBase;
//# sourceMappingURL=EnumeratorBase.js.map