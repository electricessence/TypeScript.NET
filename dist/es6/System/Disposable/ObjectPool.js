/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon ObjectPool from Parallel Extension Extras and other ObjectPool implementations.
 * Uses .add(T) and .take():T
 */
import { dispose } from "./dispose";
import { DisposableBase } from "./DisposableBase";
import { TaskHandler } from "../Threading/Tasks/TaskHandler";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
const OBJECT_POOL = "ObjectPool", _MAX_SIZE = "_maxSize", ABSOLUTE_MAX_SIZE = 65536, MUST_BE_GT1 = "Must be at valid number least 1.", MUST_BE_LTM = `Must be less than or equal to ${ABSOLUTE_MAX_SIZE}.`;
export class ObjectPool extends DisposableBase {
    constructor(_maxSize, _generator, _recycler) {
        super();
        this._maxSize = _maxSize;
        this._generator = _generator;
        this._recycler = _recycler;
        this.autoClearTimeout = 5000;
        if (isNaN(_maxSize) || _maxSize < 1)
            throw new ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_GT1);
        if (_maxSize > ABSOLUTE_MAX_SIZE)
            throw new ArgumentOutOfRangeException(_MAX_SIZE, _maxSize, MUST_BE_LTM);
        this._localAbsMaxSize = Math.min(_maxSize * 2, ABSOLUTE_MAX_SIZE);
        var _ = this;
        _._disposableObjectName = OBJECT_POOL;
        _._pool = [];
        _._trimmer = new TaskHandler(() => _._trim());
        var clear = () => _._clear();
        _._flusher = new TaskHandler(clear);
        _._autoFlusher = new TaskHandler(clear);
    }
    get maxSize() {
        return this._maxSize;
    }
    get count() {
        var p = this._pool;
        return p ? p.length : 0;
    }
    _trim() {
        var pool = this._pool;
        while (pool.length > this._maxSize) {
            dispose.withoutException(pool.pop());
        }
    }
    trim(defer) {
        this.throwIfDisposed();
        this._trimmer.start(defer);
    }
    _clear() {
        var _ = this, p = _._pool;
        _._trimmer.cancel();
        _._flusher.cancel();
        _._autoFlusher.cancel();
        dispose.these(p, true);
        p.length = 0;
    }
    clear(defer) {
        this.throwIfDisposed();
        this._flusher.start(defer);
    }
    toArrayAndClear() {
        var _ = this;
        _.throwIfDisposed();
        _._trimmer.cancel();
        _._flusher.cancel();
        var p = _._pool;
        _._pool = [];
        return p;
    }
    dump() {
        return this.toArrayAndClear();
    }
    _onDispose() {
        super._onDispose();
        var _ = this;
        _._generator = null;
        _._recycler = null;
        dispose(_._trimmer, _._flusher, _._autoFlusher);
        _._trimmer = null;
        _._flusher = null;
        _._autoFlusher = null;
        _._pool.length = 0;
        _._pool = null;
    }
    extendAutoClear() {
        var _ = this;
        _.throwIfDisposed();
        var t = _.autoClearTimeout;
        if (isFinite(t) && !_._autoFlusher.isScheduled)
            _._autoFlusher.start(t);
    }
    add(o) {
        var _ = this;
        _.throwIfDisposed();
        if (_._pool.length >= _._localAbsMaxSize) {
            dispose(o);
        }
        else {
            if (_._recycler)
                _._recycler(o);
            _._pool.push(o);
            var m = _._maxSize;
            if (m < ABSOLUTE_MAX_SIZE && _._pool.length > m)
                _._trimmer.start(500);
        }
        _.extendAutoClear();
    }
    take() {
        var _ = this;
        _.throwIfDisposed();
        var e = _._pool.pop() || _._generator(), len = _._pool.length;
        if (_._pool.length <= _._maxSize)
            _._trimmer.cancel();
        if (len)
            _.extendAutoClear();
        return e;
    }
}
export default ObjectPool;
//# sourceMappingURL=ObjectPool.js.map